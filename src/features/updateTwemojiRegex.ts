import moduleraid from 'moduleraid';
const regexp = require('twitter-regexps/emoji');

export function updateTwemojiRegex(mR: moduleraid) {
  mR.findModule((mod) => mod.default instanceof RegExp)[0].default = regexp;
}
