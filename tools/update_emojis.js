const needle = require('needle');
const _ = require('lodash');
const jsEmoji = require('emoji-js');
const fs = require('fs');

const Emoji = new jsEmoji.EmojiConvertor();
Emoji.img_set = 'twitter';

function getUnified(emoji) {
  Emoji.replace_mode = 'unified';

  const converted = Emoji.replace_colons(`:${emoji.s[0]}:`);

  if (!converted.startsWith(':') && !converted.startsWith('<img')) {
    return converted;
  }

  return null;
}

// https://raw.githubusercontent.com/iamcal/emoji-data/master/categories.json
const catOrder = {
  'Smileys & People': -80,
  'Animals & Nature': -70,
  'Food & Drink': -60,
  Activities: -50,
  'Travel & Places': -40,
  Objects: -30,
  Symbols: -20,
  Flags: -10,
};

const getMissingCategory = (shortName) => {
  if (shortName === 'keycap_star') {
    return 'Symbols';
  }

  if (shortName.startsWith('flag-')) {
    return 'Flags';
  }

  return null;
};

needle.get(
  'https://raw.githubusercontent.com/iamcal/emoji-data/340e3b897f71ca985ceccbd6b753e37776734f26/emoji.json',
  (err, res) => {
    const emojiArr = JSON.parse(res.body);

    const final = _.chain(emojiArr)
      .filter(emoji => emoji.category)
      .sortBy(emoji => emoji.sort_order)
      .sortBy(emoji => catOrder[emoji.category])
      .map(emoji => ({
        s: [...emoji.short_names, emoji.short_name],
        n: emoji.name,
        hs: Boolean(emoji.skin_variations),
        cat: emoji.category || getMissingCategory(emoji.short_name),
      }))
      .value();

    const finalForTemplate = final.filter(emoji => getUnified(emoji));
    const outStr = `module.exports = ${JSON.stringify(finalForTemplate)}`;

    fs.writeFileSync('./emojis.js', outStr, 'utf8');
  },
);
