import {config} from 'node-config-ts';

import {findMustache, getChirpFromElement, getChirpFromKey} from '../helpers/tweetdeckHelpers';

export const maybeSetupDebugFunctions = (jq: JQueryStatic, mR: any) => {
  if (!config.Client.debug) {
    return;
  }

  window.BTD = {
    debug: {getChirpFromElement, getChirpFromKey, findMustache, $: jq, mR},
  };
};
