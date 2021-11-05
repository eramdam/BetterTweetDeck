import * as t from 'io-ts';

import {BTDUsernameFormat} from '../features/usernameDisplay';
import {makeEnumRuntimeType, withDefault} from '../helpers/runtimeTypeHelpers';

export const RBetterTweetDeckSettings = t.type({
  /** Change the display of usernames in columns. */
  usernamesFormat: withDefault(
    makeEnumRuntimeType<BTDUsernameFormat>(BTDUsernameFormat),
    BTDUsernameFormat.DEFAULT
  ),

  useOriginalAspectRatioForSingleImages: withDefault(t.boolean, false),
});

export interface BTDSettings extends t.TypeOf<typeof RBetterTweetDeckSettings> {}

export function parseBTDSettings(src: any): BTDSettings {
  return src;
}
