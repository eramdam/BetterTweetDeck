import {config} from 'node-config-ts';

import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';

declare global {
  interface Window {
    BTD: any;
  }
}

export function maybeSetupDebugFunctions() {
  if (!config.Client.debug) {
    return;
  }

  window.BTD = {};
  window.BTD.debug = {
    getChirpFromElement,
    getChirpFromKey,
    findMustache,
  };
}
