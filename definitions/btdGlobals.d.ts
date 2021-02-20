export {};

declare global {
  interface Window {
    BTD?: {
      debug?: {
        $?: JQueryStatic;
        mR: any;
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
      };
    };
  }
}
