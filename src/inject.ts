import {isObject} from 'lodash';
import moduleRaid from 'moduleraid';

import {maybeAddColumnsButtons} from './features/addColumnButtons';
import {maybeAddTweetActions} from './features/addTweetActions';
import {maybeAddTweetMenuItems} from './features/addTweetMenuItems';
import {setupAME} from './features/advancedMuteEngine';
import {allowImagePaste} from './features/allowImagePaste';
import {setupThemeAutoSwitch} from './features/autoSwitchThemes';
import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {maybeSetupCustomTimestampFormat} from './features/changeTimestampFormat';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeCollapseDms} from './features/collapseDms';
import {maybeFreezeGifsInProfilePicture} from './features/freezeGifsProfilePictures';
import {maybeHideColumnIcons} from './features/hideColumnIcons';
import {maybeRemoveRedirection} from './features/removeRedirection';
import {renderMediaAndQuotedTweets} from './features/renderMediaAndQuotedTweets';
import {maybeRevertToLegacyReplies} from './features/revertToLegacyReplies';
import {maybeMakeComposerButtonsSmaller} from './features/smallerComposerButtons';
import {updateTabTitle} from './features/updateTabTitle';
import {maybeChangeUsernameFormat} from './features/usernameDisplay';
import {putBadgesOnTopOfAvatars} from './features/verifiedBadges';
import {listenToInternalBTDMessage, sendInternalBTDMessage} from './helpers/communicationHelpers';
import {setupChirpHandler} from './inject/chirpHandler';
import {setupMediaSizeMonitor} from './inject/columnMediaSizeMonitor';
import {maybeSetupDebugFunctions} from './inject/debugMethods';
import {setupSettings} from './inject/setupSettings';
import {BTDSettingsAttribute} from './types/betterTweetDeck/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from './types/betterTweetDeck/btdMessageTypes';
import {BTDSettings} from './types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject} from './types/tweetdeckTypes';

// Declare typings on the window
declare global {
  interface Window {
    TD: unknown;
  }
}

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

const TD = window.TD as TweetDeckObject;
// Grab TweetDeck's jQuery from webpack
const jq: JQueryStatic | undefined =
  mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

(async () => {
  if (!isObject(TD)) {
    return;
  }
  renderMediaAndQuotedTweets({TD});

  const settings = getBTDSettings();

  if (!settings || !jq) {
    return;
  }

  const OGPluck = TD.util.pluck;
  const OGCanSend = OGPluck('canSend');
  const customCanSend = (t: any) => {
    if (t.hasQuotedTweet && t.hasMediaAttached) {
      return true;
    }

    return OGCanSend(t);
  };
  TD.util.pluck = (e) => {
    if (e === 'canSend') {
      return customCanSend;
    }

    return OGPluck(e);
  };

  setupChirpHandler(
    TD,
    (payload) => {
      sendInternalBTDMessage({
        name: BTDMessages.CHIRP_RESULT,
        origin: BTDMessageOriginsEnum.INJECT,
        isReponse: false,
        payload,
      });
      putBadgesOnTopOfAvatars(settings, payload);
    },
    (payload) => {
      sendInternalBTDMessage({
        name: BTDMessages.CHIRP_REMOVAL,
        origin: BTDMessageOriginsEnum.INJECT,
        isReponse: false,
        payload: {
          uuids: payload.uuidArray,
        },
      });
    }
  );

  markInjectScriptAsReady();
  setupSettings({jq, settings});
  setupMediaSizeMonitor({TD, jq});
  maybeSetupDebugFunctions({jq});
  maybeRemoveRedirection({TD});
  maybeChangeUsernameFormat({
    TD,
    settings,
  });
  maybeRevertToLegacyReplies({
    jq,
    TD,
    settings,
  });
  allowImagePaste({jq});
  maybeAddColumnsButtons({TD, jq, settings});
  maybeAddTweetMenuItems({TD, jq, settings});
  maybeAddTweetActions({TD, jq, settings});
  updateTabTitle({TD, jq});
  changeAvatarsShape({settings});
  maybeMakeComposerButtonsSmaller({settings});
  maybeHideColumnIcons({settings});
  changeTweetActionsStyling({settings});
  changeScrollbarStyling({settings});
  maybeFreezeGifsInProfilePicture({settings});
  maybeCollapseDms({settings});
  setupAME({TD, jq});

  // Embed custom mustaches.
  TD.mustaches['btd/download_filename_format.mustache'] = settings.downloadFilenameFormat;

  jq(document).one('dataColumnsLoaded', () => {
    document.body.classList.add('btd-loaded');
    maybeSetupCustomTimestampFormat({TD, settings});
    sendInternalBTDMessage({
      name: BTDMessages.BTD_READY,
      origin: BTDMessageOriginsEnum.INJECT,
      isReponse: false,
      payload: undefined,
    });
    setupThemeAutoSwitch({TD});
  });

  listenToInternalBTDMessage(
    BTDMessages.DOWNLOAD_MEDIA_RESULT,
    BTDMessageOriginsEnum.INJECT,
    async (ev) => {
      if (ev.data.name !== BTDMessages.DOWNLOAD_MEDIA_RESULT) {
        return;
      }

      const blob = ev.data.payload as Blob;
      const gifFile = new File([blob], 'awesome-gif.gif', {
        type: 'image/gif',
      });
      jq(document).trigger('uiFilesAdded', {
        files: [gifFile],
      });
      jq('.btd-gif-button').removeClass('-visible');
    }
  );
  jq(document).on('uiResetImageUpload', () => {
    jq('.btd-gif-button').addClass('-visible');
  });
})();

/**
Helpers.
 */

/** Marks the DOM to make sure we don't inject our script twice. */
function markInjectScriptAsReady() {
  const {body} = document;
  if (!body) {
    return;
  }

  body.setAttribute('data-btd-ready', 'true');
}

/** Parses and returns the settings from the <script> tag as an object. */
function getBTDSettings() {
  const scriptElement = document.querySelector(`[${BTDSettingsAttribute}]`);
  const settingsAttribute = scriptElement && scriptElement.getAttribute(BTDSettingsAttribute);

  try {
    const raw = settingsAttribute && JSON.parse(settingsAttribute);
    return raw as BTDSettings;
  } catch (e) {
    return undefined;
  }
}
