import {isObject} from 'lodash';
import moduleRaid from 'moduleraid';

import {maybeRemoveRedirection} from './features/removeRedirection';
import {listenToBTDMessage} from './helpers/communicationHelpers';
import {maybeSetupDebugFunctions} from './services/debugMethods';
import {BTDSettingsAttribute} from './types/betterTweetDeck/btdCommonTypes';
import {
  BTDMessageOriginsEnum,
  BTDMessages,
  BTDThumbnailMessageTypes,
} from './types/betterTweetDeck/btdMessageTypes';

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

const TweetDeck = window.TD;
// Grab TweetDeck's jQuery from webpack
const jQuery: JQuery | undefined = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

(async () => {
  if (!isObject(TweetDeck)) {
    return;
  }

  const settings = getBTDSettings();

  if (!settings) {
    return;
  }

  markInjectScriptAsReady();
  maybeSetupDebugFunctions();
  maybeRemoveRedirection(TweetDeck);

  console.log('Hello from inject');
})();

/**
 * Events shenanigans.
 */

listenToBTDMessage(BTDMessages.FETCH_THUMBNAIL, BTDMessageOriginsEnum.INJECT, (ev) => {
  return {
    ...ev.data,
    name: BTDMessages.THUMBNAIL_RESULT,
    origin: BTDMessageOriginsEnum.INJECT,
    payload: {
      html: 'html',
      thumbnailUrl: 'url',
      type: BTDThumbnailMessageTypes.VIDEO,
      url: ev.data.payload.url,
    },
  };
});

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
    return settingsAttribute && JSON.parse(settingsAttribute);
  } catch (e) {
    return undefined;
  }
}
