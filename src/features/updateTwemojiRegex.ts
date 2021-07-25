// @ts-expect-error
import regexp from 'twitter-regexps/emoji';

import {makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

const twitterModulePredicate = (mod: any) => mod.default instanceof RegExp;
const isTwitterRegexModule = makeIsModuleRaidModule<{default: RegExp}>(twitterModulePredicate);

export const updateTwemojiRegex = makeBTDModule(({mR}) => {
  const twitterRegexModule = mR.findModule(twitterModulePredicate)[0];

  if (!isTwitterRegexModule(twitterRegexModule)) {
    return;
  }

  twitterRegexModule.default = regexp;
});
