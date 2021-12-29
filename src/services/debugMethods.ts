import {clearMuteCatches} from '../features/mutesCatcher';
import {
  findMustache,
  getChirpFromElement,
  getChirpFromKey,
  getChirpFromKeyAlone,
} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeSetupDebugFunctions = makeBTDModule(({jq, mR}) => {
  window.BTD = {
    debug: {
      getChirpFromElement,
      getChirpFromKey,
      getChirpFromKeyAlone,
      findMustache,
      jq,
      mR,
      clearMuteCatches,
    },
  };
});
