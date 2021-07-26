import {ModuleLike} from 'moduleraid';
// @ts-expect-error
import regexp from 'twitter-regexps/emoji';

import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

const twitterModulePredicate = (mod: ModuleLike) =>
  hasProperty(mod, 'default') && mod.default instanceof RegExp;
const isTwitterRegexModule = makeIsModuleRaidModule<{default: RegExp}>(twitterModulePredicate);

export const updateTwemojiRegex = makeBTDModule(({mR}) => {
  const twitterRegexModule = mR.findModule(isTwitterRegexModule)[0];

  if (!isTwitterRegexModule(twitterRegexModule)) {
    return;
  }

  twitterRegexModule.default = regexp;
});
