import ModuleRaid from 'moduleraid';

export {};

declare global {
  interface Window {
    BTD?: {
      debug?: {
        jq?: JQueryStatic;
        mR: ModuleRaid;
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
        getChirpFromKeyAlone: typeof getChirpFromKeyAlone;
        clearMuteCatches: typeof clearMuteCatches;
      };
    };
  }
}
