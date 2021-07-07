import {BtdConfig} from '../defineConfig';
import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeSetupDebugFunctions = makeBTDModule(({jq, mR}) => {
  if (!BtdConfig.debug) {
    return;
  }

  window.BTD = {
    debug: {
      getChirpFromElement,
      getChirpFromKey,
      findMustache,
      jq,
      mR,
    },
  };
});
