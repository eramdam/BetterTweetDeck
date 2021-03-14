import {isObject} from 'lodash';

import {maybeAddColumnsButtons} from './features/addColumnButtons';
import {maybeAddTweetActions} from './features/addTweetActions';
import {maybeAddTweetMenuItems} from './features/addTweetMenuItems';
import {setupAME} from './features/advancedMuteEngine';
import {allowImagePaste} from './features/allowImagePaste';
import {setupThemeAutoSwitch} from './features/autoSwitchThemes';
import {putBadgesOnTopOfAvatars} from './features/badgesOnTopOfAvatars';
import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {maybeSetupCustomTimestampFormat} from './features/changeTimestampFormat';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeCollapseDms} from './features/collapseDms';
import {injectCustomCss} from './features/customCss';
import {maybeFreezeGifsInProfilePicture} from './features/freezeGifsProfilePictures';
import {setupGifModals} from './features/gifModals';
import {maybeHideColumnIcons} from './features/hideColumnIcons';
import {useModernOverlays} from './features/modernOverlays';
import {maybeRemoveRedirection} from './features/removeRedirection';
import {maybeRenderCardsInColumns} from './features/renderCardsInColumns';
import {renderMediaAndQuotedTweets} from './features/renderMediaAndQuotedTweets';
import {maybeReplaceHeartsByStars} from './features/replaceHeartsByStars';
import {maybeRevertToLegacyReplies} from './features/revertToLegacyReplies';
import {maybeMakeComposerButtonsSmaller} from './features/smallerComposerButtons';
import {tweakTweetDeckTheme} from './features/themeTweaks';
import {updateTabTitle} from './features/updateTabTitle';
import {updateTwemojiRegex} from './features/updateTwemojiRegex';
import {useOriginalAspectRatio} from './features/useOriginalAspectRatio';
import {maybeChangeUsernameFormat} from './features/usernameDisplay';
import {listenToInternalBTDMessage, sendInternalBTDMessage} from './helpers/communicationHelpers';
import {setupChirpHandler} from './services/chirpHandler';
import {setupMediaSizeMonitor} from './services/columnMediaSizeMonitor';
import {maybeSetupDebugFunctions} from './services/debugMethods';
import {insertSettingsButton} from './services/setupSettings';
import {applyTweetDeckSettings} from './types/abstractTweetDeckSettings';
import {BTDSettingsAttribute} from './types/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from './types/btdMessageTypes';
import {BTDSettings} from './types/btdSettingsTypes';
import {TweetDeckObject} from './types/tweetdeckTypes';

// Declare typings on the window
declare global {
  interface Window {
    TD: unknown;
  }
}

const moduleRaid = require('./moduleraid');
let mR;
try {
  mR = moduleRaid();
} catch (e) {
  console.log(moduleRaid);
  console.error(e);
}

const TD = window.TD as TweetDeckObject;
// Grab TweetDeck's jQuery from webpack
const jq: JQueryStatic | undefined =
  mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

(async () => {
  const settings = getBTDSettings();
  if (!settings || !jq || !isObject(TD)) {
    return;
  }

  const btdModuleOptions = {
    TD,
    jq,
    settings,
    mR,
  };

  // Add custom mustaches.
  TD.mustaches['btd/download_filename_format.mustache'] = settings.downloadFilenameFormat;
  // Marks the DOM to make sure we don't inject our script twice.
  document.body.setAttribute('data-btd-ready', 'true');

  // Setup BTD features
  setupChirpHandler(btdModuleOptions);
  maybeSetupDebugFunctions(btdModuleOptions);
  updateTwemojiRegex(btdModuleOptions);
  putBadgesOnTopOfAvatars(btdModuleOptions);
  useOriginalAspectRatio(btdModuleOptions);
  renderMediaAndQuotedTweets(btdModuleOptions);
  setupGifModals(btdModuleOptions);
  injectCustomCss(btdModuleOptions);
  maybeRenderCardsInColumns(btdModuleOptions);
  setupMediaSizeMonitor(btdModuleOptions);
  maybeRemoveRedirection(btdModuleOptions);
  maybeChangeUsernameFormat(btdModuleOptions);
  maybeRevertToLegacyReplies(btdModuleOptions);
  allowImagePaste(btdModuleOptions);
  maybeAddColumnsButtons(btdModuleOptions);
  maybeAddTweetMenuItems(btdModuleOptions);
  maybeAddTweetActions(btdModuleOptions);
  updateTabTitle(btdModuleOptions);
  changeAvatarsShape(btdModuleOptions);
  maybeMakeComposerButtonsSmaller(btdModuleOptions);
  maybeHideColumnIcons(btdModuleOptions);
  changeTweetActionsStyling(btdModuleOptions);
  changeScrollbarStyling(btdModuleOptions);
  maybeFreezeGifsInProfilePicture(btdModuleOptions);
  maybeCollapseDms(btdModuleOptions);
  setupAME(btdModuleOptions);
  maybeReplaceHeartsByStars(btdModuleOptions);
  tweakTweetDeckTheme(btdModuleOptions);
  useModernOverlays(btdModuleOptions);
  insertSettingsButton(btdModuleOptions);
  setupThemeAutoSwitch(btdModuleOptions);
  maybeSetupCustomTimestampFormat(btdModuleOptions);
  applyTweetDeckSettings(btdModuleOptions);

  jq(document).one('dataColumnsLoaded', () => {
    document.body.classList.add('btd-loaded');
    sendInternalBTDMessage({
      name: BTDMessages.BTD_READY,
      origin: BTDMessageOriginsEnum.INJECT,
      isReponse: false,
      payload: undefined,
    });
  });
  jq(document).on('uiResetImageUpload', () => {
    jq('.btd-gif-button').addClass('-visible');
  });

  listenToInternalBTDMessage(
    BTDMessages.DOWNLOAD_MEDIA_RESULT,
    BTDMessageOriginsEnum.INJECT,
    async (ev) => {
      if (ev.data.name !== BTDMessages.DOWNLOAD_MEDIA_RESULT) {
        return;
      }

      const gifFile = new File([ev.data.payload.blob], 'awesome-gif.gif', {
        type: 'image/gif',
      });
      jq(document).trigger('uiFilesAdded', {
        files: [gifFile],
      });
      jq('.btd-gif-button').removeClass('-visible');
    }
  );
})();

/**
Helpers.
 */

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
