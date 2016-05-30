import emojis from '../../emojis/emojis.js';
import jsEmoji from 'js-emoji';
import { $ } from './util';

const Emoji = new jsEmoji.EmojiConvertor();
Emoji.img_set = 'twitter';

const catOrder = {
  People: -80,
  Nature: -70,
  Foods: -60,
  Activity: -50,
  Places: -40,
  Objects: -30,
  Symbols: -20,
  Flags: -10,
};

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
function insertAtCursor(myField, myValue) {
  // IE support
  if (document.selection) {
    myField.focus();
    const sel = document.selection.createRange();
    sel.text = myValue;
  // MOZILLA and others
  } else if (myField.selectionStart || myField.selectionStart === '0') {
    const startPos = myField.selectionStart;
    const endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
  } else {
    myField.value += myValue;
  }
}

function getUnified(emoji) {
  Emoji.replace_mode = 'unified';

  const converted = Emoji.replace_colons(`:${emoji.s}:`);

  if (converted !== `:${emoji.s}:` && !converted.startsWith('<img')) {
    return converted;
  }

  return null;
}

function getImage(emoji) {
  Emoji.replace_mode = 'css';
  Emoji.supports_css = true;
  Emoji.use_sheet = true;

  return Emoji.replace_colons(`:${emoji.s}:`).replace('/emoji-data/sheet_twitter_64.png', chrome.extension.getURL('emojis/sheet_twitter_64.png'));
}

function getEmojiElement(emoji) {
  const title = emoji.n || '';

  return `<a href="#" title="${title.toLowerCase()}" data-btd-shortcode="${emoji.s}" class="btd-emoji">${getImage(emoji)}</a>`;
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
          <input type="text" />
        </div>
        <div class="emoji-container">
        ${emojiContent}
        </div>
        <div class="category-chooser">
          <button title="People" data-btd-emoji-cat="People" class="-active">${getImage({ s: 'ok_hand' })}</button>
          <button title="Nature" data-btd-emoji-cat="Nature" class="-active">${getImage({ s: 'cat' })}</button>
          <button title="Foods" data-btd-emoji-cat="Foods" class="-active">${getImage({ s: 'pizza' })}</button>
          <button title="Activity" data-btd-emoji-cat="Activity" class="-active">${getImage({ s: 'soccer' })}</button>
          <button title="Places" data-btd-emoji-cat="Places" class="-active">${getImage({ s: 'rocket' })}</button>
          <button title="Objects" data-btd-emoji-cat="Objects" class="-active">${getImage({ s: 'bulb' })}</button>
          <button title="Symbols" data-btd-emoji-cat="Symbols" class="-active">${getImage({ s: '100' })}</button>
          <button title="Flags" data-btd-emoji-cat="Flags" class="-active">${getImage({ s: 'fr' })}</button>
    		</div>
      </div>
    </div>
  `;
}

export function buildEmojiPicker(skinVariation = false) {
  let emojiContent = '';

  Object.keys(catOrder).forEach((cat) => {
    emojiContent += `
    <h3 class="emoji-category-title" data-btd-emoji-cat="${cat}">${cat}</h3>
    <div class="emoji-category" data-btd-emoji-cat="${cat}">
    `;

    emojis.filter(emoji => emoji.cat === cat).forEach(emoji => {
      emojiContent += getEmojiElement(emoji);
    });

    emojiContent += '</div>';
  });

  const emojiPickerMarkup = getEmojiPickerMarkup(emojiContent);

  const emojiComposerButton = `
  <button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--9" data-original-title="" tabindex=""> <i class="icon btd-emoji-icon"></i> <span class="js-add-image-button-label label padding-ls">Emojis</span> </button>`;

  $('.js-add-image-button')[0].insertAdjacentHTML('beforebegin', emojiComposerButton);

  const emojiHolder = document.createElement('span');
  emojiHolder.className = 'js-emoji-holder';
  emojiHolder.innerHTML = emojiPickerMarkup;

  $('.js-add-emojis')[0].insertAdjacentHTML('afterend', emojiHolder.outerHTML);

  $('.js-add-emojis')[0].addEventListener('click', () => {
    const emojiPop = $('.emoji-popover')[0];

    if (emojiPop.style.display === 'none') {
      emojiPop.style.display = 'block';
    } else {
      emojiPop.style.display = 'none';
    }
  });

  $('.emoji-search input')[0].addEventListener('keyup', (ev) => {
    const val = String(ev.target.value);
    $('.emoji-container .btd-emoji[title]').forEach(el => {
      el.style.display = 'inline-block';
    });

    if (val.length < 1 || /^\s$/.test(val)) {
      return;
    }

    const emojisToHide = $(`.emoji-container .btd-emoji:not([title*="${val}"])`);

    emojisToHide.forEach(el => {
      el.style.display = 'none';
    });
  });

  $('.category-chooser button').forEach(catButton => {
    catButton.addEventListener('click', ev => {
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
  });

  const tweetCompose = $('textarea.js-compose-text')[0];
  $('.emoji-popover .btd-emoji').forEach(emojiEl => {
    emojiEl.addEventListener('click', (ev) => {
      let emoji;

      if (ev.target.hasAttribute('data-btd-shortcode')) {
        emoji = emoji.target;
      } else {
        emoji = ev.target.closest('[data-btd-shortcode]');
      }

      const unified = getUnified({ s: emoji.getAttribute('data-btd-shortcode') });

      insertAtCursor(tweetCompose, unified);
      tweetCompose.dispatchEvent(new Event('change'));
    });
  });

  const emojiPicker = $('.emoji-popover')[0];

  document.addEventListener('click', () => {
    if (clickedOutsideElement('.emoji-popover') && clickedOutsideElement('.js-add-emojis') && emojiPicker.style.display === 'block') {
      emojiPicker.style.display = 'none';
    }
  });
}
