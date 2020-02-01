import jsEmoji from 'emoji-js';
import { sortBy } from 'lodash';

import emojis from '../../../emojis/emojis';
import { getExtensionUrl } from '../browserHelper';

const Emoji = new jsEmoji.EmojiConvertor();

const emojiSheet = getExtensionUrl('emojis/sheet_twitter_64.png');
Emoji.img_set = 'twitter';

export const colonRegex = /:([a-z0-9_\-+]+):?:?([a-z0-9_-]+)?:?$/i;

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

const catNames = Object.keys(catOrder);

export function findEmoji(query) {
  query = query.toLowerCase();

  const filteredEmojis = emojis.filter((emoji) => {
    return emoji.s.some((shortcode) => new RegExp(`(?:_|)${query}(?:_|)`).exec(shortcode));
  });

  return sortBy(filteredEmojis, (emojiMatch) => {
    if (emojiMatch.s.includes(query)) {
      return -1;
    }

    if (emojiMatch.s.some((shortcode) => shortcode.startsWith(query))) {
      return 0;
    }

    return 1;
  });
}

export function getUnified(emoji, skinVariation) {
  Emoji.replace_mode = 'unified';

  let str = `:${emoji.s[0]}:`;

  if (emoji.hs) {
    str += skinVariation;
  }

  const converted = Emoji.replace_colons(str);

  if (converted !== `:${emoji.s[0]}:` && !converted.startsWith('<img')) {
    return converted;
  }

  return null;
}

export function getSkinVariation() {
  const skinVariation = Number(localStorage['btd-skin-variation']) || 1;
  let skinV;

  if (skinVariation === 1) {
    skinV = '';
  } else {
    skinV = `:skin-tone-${skinVariation}:`;
  }

  return skinV;
}

export function getImage(emoji, skinVariation = '') {
  Emoji.replace_mode = 'css';
  Emoji.supports_css = true;
  Emoji.use_sheet = true;

  return Emoji.replace_colons(`:${emoji.s[0]}:${skinVariation}`).replace(
    '/emoji-data/sheet_twitter_64.png',
    emojiSheet
  );
}

export function getEmojiElement(emoji, skinVariation = '') {
  let title = emoji.n || emoji.s[0];
  title = title.replace(/_-/g, ' ');

  return `<a href="#" title="${title.toLowerCase()}" data-btd-has-variation="${
    emoji.hs
  }" data-btd-shortcode="${emoji.s[0]}" class="btd-emoji">${getImage(emoji, skinVariation)}</a>`;
}

export function getEmojiPickerMarkup(emojiContent) {
  return `
    <div class="popover popover-position-t emoji-popover" style="display: none;">
      <div class="caret">
        <span class="caret-outer"></span>
        <span class="caret-inner"></span>
      </div>
      <div class="emojis-compose-panel">
        <div class="emoji-search">
          <input type="text" placeholder="Search emojis" autofocus/>
        </div>
        <div class="emoji-container">
        ${emojiContent}
        </div>
        <div class="emoji-preview">
          <span class="emoji-current-img">${getImage({ s: ['ok_hand'] })}</span>
          <span class="emoji-current-name">:ok_hand:</span>
        </div>
        <div class="category-chooser">
          <button title="${catNames[0]}" data-btd-emoji-cat="${
    catNames[0]
  }" class="-active">${getImage({ s: ['ok_hand'] })}</button>
          <button title="${catNames[1]}" data-btd-emoji-cat="${
    catNames[1]
  }" class="-active">${getImage({ s: ['cat'] })}</button>
          <button title="${catNames[2]}" data-btd-emoji-cat="${
    catNames[2]
  }" class="-active">${getImage({ s: ['pizza'] })}</button>
          <button title="${catNames[3]}" data-btd-emoji-cat="${
    catNames[3]
  }" class="-active">${getImage({ s: ['soccer'] })}</button>
          <button title="${catNames[4]}" data-btd-emoji-cat="${
    catNames[4]
  }" class="-active">${getImage({ s: ['rocket'] })}</button>
          <button title="${catNames[5]}" data-btd-emoji-cat="${
    catNames[5]
  }" class="-active">${getImage({ s: ['bulb'] })}</button>
          <button title="${catNames[6]}" data-btd-emoji-cat="${
    catNames[6]
  }" class="-active">${getImage({ s: ['100'] })}</button>
          <button title="${catNames[7]}" data-btd-emoji-cat="${
    catNames[7]
  }" class="-active">${getImage({ s: ['fr'] })}</button>
        </div>
      </div>
    </div>
  `;
}

export function getEventTarget(evt) {
  let targ = evt.target ? evt.target : evt.srcElement;
  if (targ != null) {
    if (targ.nodeType === 3) {
      targ = targ.parentNode;
    }
  }
  return targ;
}

export function clickedOutsideElement(elSelector, ev) {
  let theElem = getEventTarget(ev);
  while (theElem != null) {
    if (theElem.matches(elSelector)) {
      return false;
    }

    theElem = theElem.offsetParent;
  }
  return true;
}

export function getEmojiListMarkup(query) {
  if (query) {
    const emojiMatches = findEmoji(query);
    const skinVariation = getSkinVariation();

    return `
      <div class="emoji-category">
      ${emojiMatches
        .map((emoji) => getEmojiElement(emoji, emoji.hs ? skinVariation : undefined))
        .join('')}
      </div>
    `;
  }

  let defaultEmojiContent = '';

  Object.keys(catOrder).forEach((cat) => {
    defaultEmojiContent += `
    <h3 class="emoji-category-title" data-btd-emoji-cat="${cat}">${cat}</h3>
    <div class="emoji-category" data-btd-emoji-cat="${cat}">
    `;

    emojis
      .filter((emoji) => emoji.cat === cat)
      .forEach((emoji) => {
        defaultEmojiContent += getEmojiElement(emoji, emoji.hs ? getSkinVariation() : undefined);
      });

    defaultEmojiContent += '</div>';
  });

  defaultEmojiContent += `
  <h3 class="emoji-category-title">Skin tone</h3>
  <div class="emoji-category">
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="1" title style="background-color: #f9cd37;"></a>
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="2" title style="background-color: #f4dfce;"></a>
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="3" title style="background-color: #f0d3a0;"></a>
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="4" title style="background-color: #d1ad86;"></a>
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="5" title style="background-color: #ab7f52;"></a>
    <a href="#" class="btd-skin-tone" data-btd-skin-tone="6" title style="background-color: #78523a;"></a>
  </div>
`;

  return defaultEmojiContent;
}
