import moduleraid from 'moduleraid';

import {TweetDeckObject} from '../src/types/tweetdeckTypes';

export {};

declare global {
  interface Window {
    BTD?: {
      debug?: {
        jq?: JQueryStatic;
        mR?: moduleraid;
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
        unclearColumns: (TD: TweetDeckObject) => void;
      };
    };
  }
}
