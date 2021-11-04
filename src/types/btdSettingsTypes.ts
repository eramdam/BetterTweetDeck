import * as t from 'io-ts';

export const RBetterTweetDeckSettings = t.type({});

export interface BTDSettings extends t.TypeOf<typeof RBetterTweetDeckSettings> {}

export function parseBTDSettings(src: any): BTDSettings {
  return src;
}
