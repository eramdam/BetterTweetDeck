import moduleraid from 'moduleraid';

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
      };
    };
  }
}
