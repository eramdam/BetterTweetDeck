import {isObject} from 'lodash';
import moduleRaid from 'moduleraid';

import {changeAvatarsShape} from './features/changeAvatarShape';
import {changeScrollbarStyling} from './features/changeScrollbars';
import {maybeSetupCustomTimestampFormat} from './features/changeTimestampFormat';
import {changeTweetActionsStyling} from './features/changeTweetActions';
import {maybeRemoveRedirection} from './features/removeRedirection';
import {maybeRevertToLegacyReplies} from './features/revertToLegacyReplies';
import {putBadgesOnTopOfAvatars} from './features/verifiedBadges';
import {sendInternalBTDMessage} from './helpers/communicationHelpers';
import {setupChirpHandler} from './services/chirpHandler';
import {setupMediaSizeMonitor} from './services/columnMediaSizeMonitor';
import {maybeSetupDebugFunctions} from './services/debugMethods';
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

const TweetDeck = window.TD as TweetDeckObject;
// Grab TweetDeck's jQuery from webpack
const $: JQueryStatic | undefined =
  mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

(async () => {
  if (!isObject(TweetDeck)) {
    return;
  }

  const settings = getBTDSettings();

  if (!settings || !$) {
    return;
  }

  setupChirpHandler(
    TweetDeck,
    (payload) => {
      putBadgesOnTopOfAvatars(settings, payload);
      sendInternalBTDMessage({
        name: BTDMessages.CHIRP_RESULT,
        origin: BTDMessageOriginsEnum.INJECT,
        isReponse: false,
        payload,
      });
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
  setupMediaSizeMonitor(TweetDeck, $);
  maybeSetupDebugFunctions();
  maybeRemoveRedirection(TweetDeck);
  maybeRevertToLegacyReplies(TweetDeck, settings);
  changeAvatarsShape(settings);
  changeTweetActionsStyling(settings);
  changeScrollbarStyling(settings);

  $(document).one('dataColumnsLoaded', () => {
    maybeSetupCustomTimestampFormat(TweetDeck, settings);
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
