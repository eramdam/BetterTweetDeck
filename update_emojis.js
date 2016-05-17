'use strict';

const needle = require('needle');
const _ = require('lodash');
const jsEmoji = require('js-emoji');
const Emoji = new jsEmoji.EmojiConvertor();
const fs = require('fs');
Emoji.img_set = 'twitter';

function getUnified(emoji) {
  Emoji.replace_mode = 'unified';

  const converted = Emoji.replace_colons(`:${emoji.s}:`);

  if (converted !== `:${emoji.s}:` && !converted.startsWith('<img'))
    return converted;

  return null;
}

function getImage(emoji) {
  Emoji.replace_mode = 'css';
  Emoji.supports_css = true;
  Emoji.use_sheet = true;

  return Emoji.replace_colons(`:${emoji.s}:`);
}

function getEmojiElement(emoji) {
  return `<a href="#" data-string="${getUnified(emoji)}" title="${emoji.name}" class="btd-emoji">${getImage(emoji)}</a>`;
}

const catOrder = {
  'People': -80,
  'Nature': -70,
  'Foods': -60,
  'Activity': -50,
  'Places': -40,
  'Objects': -30,
  'Symbols': -20,
  'Flags': -10
};

const getMissingCategory = (short_name) => {
  if (short_name === 'keycap_star')
    return 'Symbols';

  if (short_name.startsWith('flag-'))
    return 'Flags';

  return null;
};

needle.get('https://raw.githubusercontent.com/iamcal/emoji-data/master/emoji.json', (err, res) => {
  const emojiArr = JSON.parse(res.body);

  const final = _.chain(emojiArr)
                  .filter(emoji => emoji.category)
                  .sortBy(emoji => emoji.sort_order)
                  .sortBy(emoji => catOrder[emoji.category])
                  .map(emoji => {
                    return {
                      s: emoji.short_name,
                      n: emoji.name,
                      hs: Boolean(emoji.skin_variations),
                      cat: emoji.category || getMissingCategory(emoji.s_name)
                    }
                  })
                  .value();

    const finalForTemplate = final.filter(emoji => getUnified(emoji));
    const outStr = `module.exports = ${JSON.stringify(finalForTemplate)}`;

    fs.writeFileSync('./src/emojis/emojis.js', outStr, 'utf8');
});
