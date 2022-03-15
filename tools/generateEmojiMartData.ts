// Based off https://github.com/missive/emoji-mart/blob/master/scripts/build.js

import axios from 'axios';
import * as fs from 'fs/promises';
import * as _ from 'lodash';
import {titleCase} from 'title-case';
const emojiLib = require('emojilib');

const categories = [
  ['Smileys & Emotion', 'smileys'],
  ['People & Body', 'people'],
  ['Animals & Nature', 'nature'],
  ['Food & Drink', 'foods'],
  ['Activities', 'activity'],
  ['Travel & Places', 'places'],
  ['Objects', 'objects'],
  ['Symbols', 'symbols'],
  ['Flags', 'flags'],
];

interface EmojiData {
  compressed: boolean;
  categories: {id: string; name: string; emojis: string[]}[];
  emojis: {
    [k: string]: any;
  };
  aliases: {
    [k: string]: string;
  };
}

const sets = ['apple', 'facebook', 'google', 'twitter'];

(async () => {
  const emojiData = await axios
    .get(`https://raw.githubusercontent.com/iamcal/emoji-data/emoji_14/emoji.json`)
    .then((r) => r.data);

  let data: EmojiData = {compressed: true, categories: [], emojis: {}, aliases: {}};
  let categoriesIndex: {[k: string]: number} = {};

  categories.forEach((category, i) => {
    let [name, id] = category;
    data.categories[i] = {id: id, name: name, emojis: []};
    categoriesIndex[name] = i;
  });

  emojiData.sort((a: any, b: any) => {
    var aTest = a.sort_order || a.short_name,
      bTest = b.sort_order || b.short_name;

    return aTest - bTest;
  });

  emojiData.forEach((datum: any) => {
    var category = datum.category;
    var categoryIndex;

    if (!datum.category) {
      throw new Error('“' + datum.short_name + '” doesn’t have a category');
    }

    var keepEmoji = false;

    ['twitter'].forEach((set) => {
      if (keepEmoji) return;
      if (datum[`has_img_${set}`]) {
        keepEmoji = true;
      }
    });

    if (!keepEmoji) {
      return;
    }

    sets.forEach((set) => {
      var key = `has_img_${set}`;
      delete datum[key];
    });

    datum.name || (datum.name = datum.short_name.replace(/\\-/g, ' '));
    datum.name = titleCase(String(datum.name || '').toLowerCase());

    if (!datum.name) {
      throw new Error('“' + datum.short_name + "” doesn't have a name");
    }

    datum.emoticons = datum.texts || [];
    datum.text = datum.text || '';
    delete datum.texts;

    const unified = String.fromCodePoint(
      ...datum.unified.split('-').map((s: string) => parseInt(s, 16))
    );
    if (emojiLib[unified]) {
      datum.keywords = emojiLib[unified];
    }

    if (datum.subcategory !== 'skin-tone') {
      categoryIndex = categoriesIndex[category];
      data.categories[categoryIndex].emojis.push(datum.short_name);
      data.emojis[datum.short_name] = datum;
    }

    datum.short_names.forEach((short_name: string, i: number) => {
      if (i === 0) {
        return;
      }

      data.aliases[short_name] = datum.short_name;
    });

    delete datum.docomo;
    delete datum.au;
    delete datum.softbank;
    delete datum.google;
    delete datum.image;
    delete datum.category;
    delete datum.sort_order;

    compress(datum);
  });

  var flags = data.categories[categoriesIndex['Flags']];
  flags.emojis = flags.emojis
    .filter((flag) => {
      // Until browsers support Flag UN
      if (flag == 'flag-un') return;
      return true;
    })
    .sort();

  // Merge “Smileys & Emotion” and “People & Body” into a single category
  let smileys = data.categories[0];
  let people = data.categories[1];
  let smileysAndPeople = {id: 'people', name: 'Smileys & People', emojis: []};
  smileysAndPeople.emojis = []
    // @ts-expect-error
    .concat(smileys.emojis.slice(0, 114))
    // @ts-expect-error
    .concat(people.emojis)
    // @ts-expect-error
    .concat(smileys.emojis.slice(114));

  data.categories.unshift(smileysAndPeople);
  data.categories.splice(1, 2);

  console.log({
    sheetRows:
      _(data.emojis)
        .values()
        .map((e) => e.k[0])
        .flatten()
        .uniq()
        .sortBy()
        .last() + 2,
    sheetColumns:
      _(data.emojis)
        .values()
        .map((e) => e.k[1])
        .flatten()
        .uniq()
        .sortBy()
        .last() + 1,
  });

  await fs.writeFile('./src/assets/emoji-mart-data.json', JSON.stringify(data));
})();

const mapping = {
  name: 'a',
  unified: 'b',
  non_qualified: 'c',
  has_img_apple: 'd',
  has_img_google: 'e',
  has_img_twitter: 'f',
  has_img_facebook: 'h',
  keywords: 'j',
  sheet: 'k',
  emoticons: 'l',
  text: 'm',
  short_names: 'n',
  added_in: 'o',
};

function compress(emoji: any) {
  emoji.short_names = emoji.short_names.filter(function (short_name: string) {
    return short_name !== emoji.short_name;
  });
  delete emoji.short_name;
  emoji.sheet = [emoji.sheet_x, emoji.sheet_y];
  delete emoji.sheet_x;
  delete emoji.sheet_y;
  emoji.added_in = parseInt(emoji.added_in);

  if (emoji.added_in === 6) {
    delete emoji.added_in;
  }

  for (var key in mapping) {
    // @ts-expect-error
    emoji[mapping[key]] = emoji[key];
    delete emoji[key];
  }

  for (var _key in emoji) {
    var value = emoji[_key];

    if (Array.isArray(value) && !value.length) {
      delete emoji[_key];
    } else if (typeof value === 'string' && !value.length) {
      delete emoji[_key];
    } else if (value === null) {
      delete emoji[_key];
    }
  }
}
