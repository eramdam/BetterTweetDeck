import { $ } from '../util';
import { colonRegex, findEmoji, getImage, getSkinVariation, getUnified } from './emojiUtils';

let emojiDropdownItems = [];
let emojiDropdownItemSelected = null;

function replaceAt(string, index, target, replacement) {
  const firstPart = string.substr(0, index);
  const secondPart = string.substr(index + target.length);

  return firstPart + replacement + secondPart;
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

function getEmojiTypeaheadHolder(ev) {
  const parent = ev.target.closest('.compose-text-container');

  if (!parent) {
    return null;
  }

  return $('.btd-emoji-typeahead', parent)[0];
}

function updateEmojiDropdown(ev, items, skinVariation = '') {
  const holder = getEmojiTypeaheadHolder(ev);
  holder.style.display = 'block';

  emojiDropdownItems = items;
  emojiDropdownItemSelected = items[0];

  const template = (emoji, index) => {
    const isSelected = index === 0;

    return `
  <li class="typeahead-item padding-am cf is-actionable ${
  isSelected ? 's-selected' : ''
}" data-btd-emoji-index="${index}">
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
  return (
    emojiDropdownItems.length > 0 &&
    getEmojiTypeaheadHolder(event).style.display !== 'none'
  );
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

function moveSelection(event, offset) {
  const currentSelected = emojiDropdownItems.indexOf(emojiDropdownItemSelected);
  let newSelectedIndex = (currentSelected + offset) % emojiDropdownItems.length;

  if (newSelectedIndex < 0) {
    newSelectedIndex = emojiDropdownItems.length - 1;
  }

  emojiDropdownItemSelected = emojiDropdownItems[newSelectedIndex];

  const holder = getEmojiTypeaheadHolder(event);
  holder
    .querySelectorAll('li.typeahead-item')
    .forEach(e => e.classList.remove('s-selected'));
  holder
    .querySelector(`li:nth-child(${newSelectedIndex + 1})`)
    .classList.add('s-selected');
}

function selectTypeaheadEmoji(event, composeBoxNode) {
  const composeBox = composeBoxNode || event.target;
  const atCursor = valueAtCursor(composeBox);
  const toReplace = atCursor.value.match(colonRegex);
  const unifiedEmoji = getUnified(
    emojiDropdownItemSelected,
    getSkinVariation(),
  );

  const newValue = replaceAt(
    composeBox.value,
    toReplace.index,
    toReplace[0],
    getUnified(emojiDropdownItemSelected, getSkinVariation()),
  );

  composeBox.value = newValue;
  composeBox.dispatchEvent(new Event('change'));
  composeBox.selectionStart = toReplace.index + unifiedEmoji.length;
  composeBox.selectionEnd = toReplace.index + unifiedEmoji.length;
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

    case 'tab':
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

function eventInsideTweetBox(ev) {
  if (!ev.target.matches('.js-compose-text')) {
    return;
  }

  const { type } = ev;

  switch (type) {
    case 'input':
      emojiMatcherOnInput(ev);
      break;

    case 'keydown':
      keypressHandler(ev);
      break;

    case 'blur':
      hideEmojiDropdown(ev);
      break;

    default:
      break;
  }
}

function setSelection(event, position) {
  let newSelectedIndex = position % emojiDropdownItems.length;

  if (newSelectedIndex < 0) {
    newSelectedIndex = emojiDropdownItems.length - 1;
  }

  emojiDropdownItemSelected = emojiDropdownItems[newSelectedIndex];
  const holder = getEmojiTypeaheadHolder(event);
  holder
    .querySelectorAll('li.typeahead-item')
    .forEach(e => e.classList.remove('s-selected'));
  holder
    .querySelector(`li:nth-child(${newSelectedIndex + 1})`)
    .classList.add('s-selected');
}

function eventInsideEmojiDropdown(event) {
  if (!event.target.closest('.btd-emoji-typeahead li')) {
    return;
  }

  const { type } = event;
  const dropdownListItem = event.target.closest('.btd-emoji-typeahead li');
  const composeBox = event.target
    .closest('.compose-text-container')
    .querySelector('.js-compose-text');

  switch (type) {
    case 'mouseover':
      setSelection(event, Number(dropdownListItem.dataset.btdEmojiIndex));
      break;
    case 'click':
    case 'mousedown':
      setSelection(event, Number(dropdownListItem.dataset.btdEmojiIndex));
      selectTypeaheadEmoji(event, composeBox);
      break;
    default:
      break;
  }
}

export function setupEmojiCompletionEventHandlers() {
  document.body.addEventListener('input', eventInsideTweetBox);
  document.body.addEventListener('keydown', eventInsideTweetBox);
  document.body.addEventListener('blur', eventInsideTweetBox);
  document.body.addEventListener('mouseover', eventInsideEmojiDropdown);
  document.body.addEventListener('mousedown', eventInsideEmojiDropdown);
}

export function insertEmojiCompletionDropdownHolder() {
  const dropdownHolder = document.createElement('ul');
  dropdownHolder.className = 'lst lst-modal typeahead btd-emoji-typeahead';
  dropdownHolder.style.display = 'none';

  if (!$('.lst.lst-modal.typeahead')) {
    return;
  }

  $('.lst.lst-modal.typeahead')[0].insertAdjacentElement(
    'afterend',
    dropdownHolder,
  );
}
