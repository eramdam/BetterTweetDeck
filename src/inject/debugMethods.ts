import {config} from 'node-config-ts';

import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

/** Setup a few helpful debug functions on the global scope if the config asks for it. */
export const maybeSetupDebugFunctions = makeBTDModule(({jq}) => {
  if (!config.Client.debug) {
    return;
  }

  window.$ = jq;

  window.BTD = {
    debug: {getChirpFromElement, getChirpFromKey, findMustache},
  };
});
