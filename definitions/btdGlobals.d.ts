export {};

declare global {
  interface Window {
    $?: JQueryStatic;
    BTD?: {
      debug?: {
        findMustache: typeof findMustache;
        getChirpFromElement: typeof getChirpFromElement;
        getChirpFromKey: typeof getChirpFromKey;
      };
    };
  }
}
