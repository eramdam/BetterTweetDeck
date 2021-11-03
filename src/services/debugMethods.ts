import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeSetupDebugFunctions = makeBTDModule(({jq, mR}) => {
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
