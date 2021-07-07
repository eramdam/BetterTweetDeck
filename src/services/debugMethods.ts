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
      unclearColumns: (TD) => {
        TD.controller.columnManager.getAllOrdered().forEach((c) => {
          try {
            c.model.setClearedTimestamp(0);
            c.backfill();
          } catch (e) {
            //
          }
        });
      },
      jq,
      mR,
    },
  };
});
