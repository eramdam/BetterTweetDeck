import {config} from 'node-config-ts';

import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeSetupDebugFunctions = makeBTDModule(({jq, mR}) => {
  if (!config.Client.debug) {
    return;
  }

  window.BTD = {
    debug: {getChirpFromElement, getChirpFromKey, findMustache, jq, mR},
  };
});
