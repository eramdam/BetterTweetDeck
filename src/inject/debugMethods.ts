import {config} from 'node-config-ts';

import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

declare global {
  interface Window {
    $: JQueryStatic;
    BTD: {
      debug: {
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
      };
    };
  }
}

/** Setup a few helpful debug functions on the global scope if the config asks for it. */
export const maybeSetupDebugFunctions = makeBTDModule(({$}) => {
  if (!config.Client.debug) {
    return;
  }

  window.$ = $;

  window.BTD = {
    debug: {getChirpFromElement, getChirpFromKey, findMustache},
  };
});
