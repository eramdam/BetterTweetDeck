import {makeBTDModule} from '../types/btdCommonTypes';
const regexp = require('twitter-regexps/emoji');

export const updateTwemojiRegex = makeBTDModule(({mR}) => {
  mR.findModule((mod) => mod.default instanceof RegExp)[0].default = regexp;
});
