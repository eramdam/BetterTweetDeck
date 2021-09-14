import {ModuleLike} from 'moduleraid';

import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import twemojiRegex from './twemojiRegex';

const twitterModulePredicate = (mod: ModuleLike) =>
  hasProperty(mod, 'default') && mod.default instanceof RegExp;
const isTwitterRegexModule = makeIsModuleRaidModule<{default: RegExp}>(twitterModulePredicate);

export const updateTwemojiRegex = makeBTDModule(({mR}) => {
  const twitterRegexModule = mR.findModule(isTwitterRegexModule)[0];

  if (!isTwitterRegexModule(twitterRegexModule)) {
    return;
  }

  twitterRegexModule.default = twemojiRegex;
});
