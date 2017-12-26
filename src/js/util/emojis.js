import jsEmoji from 'emoji-js';
import { sortBy } from 'lodash';
import emojis from '../../emojis/emojis';
import { $ } from './util';

const Emoji = new jsEmoji.EmojiConvertor();
const emojiSheet = chrome.extension.getURL('emojis/sheet_twitter_64.png');
Emoji.img_set = 'twitter';

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


function getEventTarget(evt) {
  let targ = (evt.target) ? evt.target : evt.srcElement;
  if (targ != null) {
    if (targ.nodeType === 3) {
      targ = targ.parentNode;
    }
  }
  return targ;
}

function clickedOutsideElement(elSelector) {
  let theElem = getEventTarget(window.event);
  while (theElem != null) {
    if (theElem.matches(elSelector)) {
      return false;
    }

    theElem = theElem.offsetParent;
  }
  return true;
}

// From http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
function insertAtCursor(input, value) {
  // IE support
  if (document.selection) {
    input.focus();
    const sel = document.selection.createRange();
    sel.text = value;
  // MOZILLA and others
  } else if (input.selectionStart || input.selectionStart === '0') {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    input.value = input.value.substring(0, startPos) + value + input.value.substring(endPos, input.value.length);
  } else {
    input.value += value;
  }
}

function getEmojiTypeaheadHolder(event) {
  const parent = event.target.parentElement;

  if (!parent) {
    return null;
  }

  return $('.btd-emoji-typeahead', event.target.parentElement)[0];
}

function valueAtCursor(input) {
  const selection = {
    start: input.selectionStart,
    end: input.selectionEnd,
  };

  const lookStart = selection.start === selection.end ? 0 : selection.start;

  const beforeCursor = input.value.substr(lookStart, selection.end);

  return {
    value: beforeCursor,
    index: selection.end,
  };
}

function getSkinVariation() {
  const skinVariation = Number(localStorage['btd-skin-variation']) || 1;
  let skinV;

  if (skinVariation === 1) {
    skinV = '';
  } else {
    skinV = `:skin-tone-${skinVariation}:`;
  }

  return skinV;
}

function getUnified(emoji, skinVariation) {
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

function getImage(emoji, skinVariation = '') {
  Emoji.replace_mode = 'css';
  Emoji.supports_css = true;
  Emoji.use_sheet = true;

  return Emoji.replace_colons(`:${emoji.s[0]}:${skinVariation}`).replace('/emoji-data/sheet_twitter_64.png', emojiSheet);
}

function getEmojiElement(emoji, skinVariation = '') {
  let title = emoji.n || emoji.s[0];
  title = title.replace(/_-/g, ' ');

  return `<a href="#" title="${title.toLowerCase()}" data-btd-has-variation="${emoji.hs}" data-btd-shortcode="${emoji.s[0]}" class="btd-emoji">${getImage(emoji, skinVariation)}</a>`;
}

function getEmojiPickerMarkup(emojiContent) {
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
          <button title="${catNames[0]}" data-btd-emoji-cat="${catNames[0]}" class="-active">${getImage({ s: ['ok_hand'] })}</button>
          <button title="${catNames[1]}" data-btd-emoji-cat="${catNames[1]}" class="-active">${getImage({ s: ['cat'] })}</button>
          <button title="${catNames[2]}" data-btd-emoji-cat="${catNames[2]}" class="-active">${getImage({ s: ['pizza'] })}</button>
          <button title="${catNames[3]}" data-btd-emoji-cat="${catNames[3]}" class="-active">${getImage({ s: ['soccer'] })}</button>
          <button title="${catNames[4]}" data-btd-emoji-cat="${catNames[4]}" class="-active">${getImage({ s: ['rocket'] })}</button>
          <button title="${catNames[5]}" data-btd-emoji-cat="${catNames[5]}" class="-active">${getImage({ s: ['bulb'] })}</button>
          <button title="${catNames[6]}" data-btd-emoji-cat="${catNames[6]}" class="-active">${getImage({ s: ['100'] })}</button>
          <button title="${catNames[7]}" data-btd-emoji-cat="${catNames[7]}" class="-active">${getImage({ s: ['fr'] })}</button>
        </div>
      </div>
    </div>
  `;
}

const colonRegex = /:([a-z0-9_\-+]+):?:?([a-z0-9_-]+)?:?$/;

function findEmoji(query) {
  const filteredEmojis = emojis.filter((emoji) => {
    return emoji.s.some(shortcode => new RegExp(`(?:_|)${query}(?:_|)`).exec(shortcode));
  });

  return sortBy(filteredEmojis, (emojiMatch) => {
    if (emojiMatch.s.includes(query)) {
      return -1;
    }

    if (emojiMatch.s.some(shortcode => shortcode.startsWith(query))) {
      return 0;
    }

    return 1;
  });
}

let emojiDropdownItems = [];
let emojiDropdownItemSelected = null;

function updateEmojiDropdown(event, items, skinVariation = '') {
  const holder = getEmojiTypeaheadHolder(event);
  holder.style.display = 'block';

  emojiDropdownItems = items;
  emojiDropdownItemSelected = items[0];

  const template = (emoji, index) => {
    const isSelected = index === 0;

    return `
  <li class="typeahead-item padding-am cf is-actionable ${isSelected ? 's-selected' : ''}">
    <p class="js-hashtag txt-ellipsis">
      <span class="btd-emoji">
      ${emoji.hs ? getImage(emoji, skinVariation) : getImage(emoji)}
      </span>
      ${emoji.s[0]}
    </p>
  </li>
  `;
  };

  const markup = items.map(template);

  holder.innerHTML = markup.join('\n');
}

function hideEmojiDropdown(event) {
  const holder = getEmojiTypeaheadHolder(event);
  holder.style.display = 'none';
}

function isEmojiDropdownOpened(event) {
  return emojiDropdownItems.length > 0 && getEmojiTypeaheadHolder(event).style.display !== 'none';
}

function moveSelection(event, offset) {
  const currentSelected = emojiDropdownItems.indexOf(emojiDropdownItemSelected);
  let newSelectedIndex = (currentSelected + offset) % emojiDropdownItems.length;

  if (newSelectedIndex < 0) {
    newSelectedIndex = emojiDropdownItems.length - 1;
  }

  emojiDropdownItemSelected = emojiDropdownItems[newSelectedIndex];

  const holder = getEmojiTypeaheadHolder(event);
  holder.querySelectorAll('li.typeahead-item').forEach(e => e.classList.remove('s-selected'));
  holder.querySelector(`li:nth-child(${newSelectedIndex + 1})`).classList.add('s-selected');
}

function replaceAt(string, index, target, replacement) {
  const firstPart = string.substr(0, index);
  const secondPart = string.substr(index + target.length);

  return firstPart + replacement + secondPart;
}

function selectTypeaheadEmoji(event) {
  const composeBox = event.target;
  const atCursor = valueAtCursor(composeBox);
  const toReplace = atCursor.value.match(colonRegex);
  const unifiedEmoji = getUnified(emojiDropdownItemSelected, getSkinVariation());

  const newValue = replaceAt(composeBox.value, toReplace.index, toReplace[0], getUnified(emojiDropdownItemSelected, getSkinVariation()));

  composeBox.value = newValue;
  composeBox.selectionStart = toReplace.index + unifiedEmoji.length;
  composeBox.selectionEnd = toReplace.index + unifiedEmoji.length;
  composeBox.dispatchEvent(new Event('change'));
  hideEmojiDropdown(event);
}

function keypressHandler(event) {
  const key = event.key;

  if (!isEmojiDropdownOpened(event)) {
    return;
  }

  switch (key.toLowerCase()) {
    case 'arrowdown':
      event.preventDefault();
      event.stopPropagation();
      moveSelection(event, 1);
      break;

    case 'arrowup':
      event.preventDefault();
      event.stopPropagation();
      moveSelection(event, -1);
      break;

    case 'enter':
      event.preventDefault();
      event.stopPropagation();
      selectTypeaheadEmoji(event);
      break;

    case 'escape':
      event.preventDefault();
      event.stopPropagation();
      hideEmojiDropdown(event);
      break;

    default:
      break;
  }
}

function emojiMatcherOnInput(event) {
  const skinVariation = getSkinVariation();

  const beforeCursor = valueAtCursor(event.target).value;
  const colonMatch = beforeCursor.match(colonRegex);

  if (colonMatch && colonMatch[1] && colonMatch[1].length >= 2) {
    const emojiMatches = findEmoji(colonMatch[1]).slice(0, 8);

    if (emojiMatches.length > 0) {
      updateEmojiDropdown(event, emojiMatches, skinVariation);
    } else {
      hideEmojiDropdown(event);
    }
  } else {
    hideEmojiDropdown(event);
  }
}

// Poor man's event delegation
function eventInsideTweetBox(event) {
  if (!event.target.matches('.js-compose-text')) {
    return;
  }

  const { type } = event;

  switch (type) {
    case 'input':
      emojiMatcherOnInput(event);
      break;

    case 'keydown':
      keypressHandler(event);
      break;

    case 'blur':
      hideEmojiDropdown(event);
      break;

    default:
      break;
  }
}

function getEmojiList(query) {
  if (query) {
    const emojiMatches = findEmoji(query);
    const skinVariation = getSkinVariation();

    return `
      <div class="emoji-category">
      ${emojiMatches.map(emoji => getEmojiElement(emoji, emoji.hs ? skinVariation : undefined)).join('')}
      </div>
    `;
  }

  let defaultEmojiContent = '';

  defaultEmojiContent = `
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
  Object.keys(catOrder).forEach((cat) => {
    defaultEmojiContent += `
    <h3 class="emoji-category-title" data-btd-emoji-cat="${cat}">${cat}</h3>
    <div class="emoji-category" data-btd-emoji-cat="${cat}">
    `;

    emojis.filter(emoji => emoji.cat === cat).forEach((emoji) => {
      defaultEmojiContent += getEmojiElement(emoji, emoji.hs ? getSkinVariation() : undefined);
    });

    defaultEmojiContent += '</div>';
  });

  return defaultEmojiContent;
}

function skinToneHandler(event) {
  if (!event.target.matches('.btd-skin-tone')) {
    return false;
  }

  event.preventDefault();
  event.stopPropagation();
  const skinTone = event.target.getAttribute('data-btd-skin-tone');

  localStorage['btd-skin-variation'] = skinTone;
  return true;
}

let eventsBound = false;

function buildEmojiPicker(rebuild = false) {
  const emojiPickerMarkup = getEmojiPickerMarkup(getEmojiList());

  if (!rebuild) {
    const emojiComposerButton = `
    <button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--9" data-original-title="" tabindex=""> <i class="icon btd-emoji-icon"></i> <span class="js-add-image-button-label label padding-ls">Emojis</span> </button>`;

    $('.js-add-image-button')[0].insertAdjacentHTML('beforebegin', emojiComposerButton);
  }

  const emojiHolder = rebuild ? $('.js-emoji-holder')[0] : document.createElement('span');

  if (!rebuild) {
    emojiHolder.className = 'js-emoji-holder';
  }

  emojiHolder.innerHTML = emojiPickerMarkup;

  if (!rebuild) {
    $('.js-add-emojis')[0].insertAdjacentElement('afterend', emojiHolder);

    $('.js-add-emojis')[0].addEventListener('click', () => {
      const emojiPop = $('.emoji-popover')[0];

      if (emojiPop.style.display === 'none') {
        emojiPop.style.display = 'block';
      } else {
        emojiPop.style.display = 'none';
      }
    });
  } else {
    const emojiPop = $('.emoji-popover')[0];

    if (emojiPop.style.display === 'none') {
      emojiPop.style.display = 'block';
    } else {
      emojiPop.style.display = 'none';
    }
  }

  if (eventsBound) {
    return;
  }

  const dropdownHolder = document.createElement('ul');
  dropdownHolder.className = 'lst lst-modal typeahead btd-emoji-typeahead';
  dropdownHolder.style.display = 'none';

  $('.lst.lst-modal.typeahead')[0].insertAdjacentElement('afterend', dropdownHolder);

  $('.js-emoji-holder')[0].addEventListener('keyup', (ev) => {
    if (!ev.target.matches('.emoji-search input')) {
      return;
    }

    const val = String(ev.target.value);
    $('.emoji-popover .emoji-container')[0].innerHTML = getEmojiList(val);
  });

  $('.js-emoji-holder')[0].addEventListener('click', (ev) => {
    if (!ev.target.matches('.category-chooser button') && !ev.target.closest('button[data-btd-emoji-cat]')) {
      return;
    }
    let emojiCat;

    if (ev.target.hasAttribute('data-btd-emoji-cat')) {
      emojiCat = ev.target;
    } else {
      emojiCat = ev.target.closest('[data-btd-emoji-cat]');
    }

    const emojiCatName = emojiCat.getAttribute('data-btd-emoji-cat');

    const emojiCatEl = $(`.emoji-popover h3[data-btd-emoji-cat="${emojiCatName}"]`)[0];

    emojiCatEl.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  const tweetCompose = $('textarea.js-compose-text')[0];
  let timeoutId;
  $('.js-emoji-holder')[0].addEventListener('mouseover', (ev) => {
    let emoji;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (ev.target.hasAttribute('data-btd-shortcode')) {
      emoji = ev.target;
    } else {
      emoji = ev.target.closest('[data-btd-shortcode]');
    }

    if (!emoji) {
      timeoutId = setTimeout(() => {
        $('.emoji-popover .emoji-preview')[0].classList.remove('-visible');
      }, 150);
      return;
    }

    const hasVariation = emoji.getAttribute('data-btd-has-variation') === 'true';
    const shortcode = emoji.getAttribute('data-btd-shortcode');
    const image = getEmojiElement({ s: [emoji.getAttribute('data-btd-shortcode')] }, hasVariation ? getSkinVariation() : undefined);

    $('.emoji-popover .emoji-preview')[0].classList.add('-visible');
    $('.emoji-popover .emoji-preview .emoji-current-img')[0].innerHTML = image;
    $('.emoji-popover .emoji-preview .emoji-current-name')[0].innerText = `:${shortcode}:`;
  });
  $('.js-emoji-holder')[0].addEventListener('click', (ev) => {
    let emoji;

    if (ev.target.hasAttribute('data-btd-shortcode')) {
      emoji = ev.target;
    } else {
      emoji = ev.target.closest('[data-btd-shortcode]');
    }

    if (!emoji) {
      return;
    }

    const hasVariation = emoji.getAttribute('data-btd-has-variation') === 'true';
    const unified = getUnified({ s: [emoji.getAttribute('data-btd-shortcode')], hs: hasVariation }, getSkinVariation());

    insertAtCursor(tweetCompose, unified);
    tweetCompose.dispatchEvent(new Event('change'));
  });

  $('.js-emoji-holder')[0].addEventListener('click', (ev) => {
    const caught = skinToneHandler(ev);
    if (caught) {
      buildEmojiPicker(true);
    }
  });

  document.body.addEventListener('input', eventInsideTweetBox);
  document.body.addEventListener('keydown', eventInsideTweetBox);
  document.body.addEventListener('blur', eventInsideTweetBox);

  document.addEventListener('click', () => {
    if (clickedOutsideElement('.emoji-popover') && clickedOutsideElement('.js-add-emojis') && $('.emoji-popover')[0].style.display === 'block') {
      $('.emoji-popover')[0].style.display = 'none';
      $('.emoji-search input')[0].value = '';
      $('.emoji-popover .emoji-container')[0].innerHTML = getEmojiList();
    }
  });

  eventsBound = true;
}

export default buildEmojiPicker;
