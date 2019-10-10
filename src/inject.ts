import {isObject} from 'lodash';
import moduleRaid from 'moduleraid';

import {maybeRemoveRedirection} from './features/removeRedirection';
import {maybeSetupDebugFunctions} from './services/debugMethods';
import {BTDSettingsAttribute} from './types/BTDTypes';

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
Helpers.
 */

function markInjectScriptAsReady() {
  const {body} = document;
  if (!body) {
    return;
  }

  body.setAttribute('data-btd-ready', 'true');
}

function getBTDSettings() {
  const scriptElement = document.querySelector(`[${BTDSettingsAttribute}]`);
  const settingsAttribute = scriptElement && scriptElement.getAttribute(BTDSettingsAttribute);

  try {
    return settingsAttribute && JSON.parse(settingsAttribute);
  } catch (e) {
    return undefined;
  }
}
