export {};

declare global {
  interface Window {
    BTD?: {
      debug?: {
        $?: JQueryStatic;
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
      };
    };
  }
}
