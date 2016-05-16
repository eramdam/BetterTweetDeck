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

function getUnified(emoji) {
  Emoji.replace_mode = 'unified';

  const converted = Emoji.replace_colons(`:${emoji.short}:`);

  if (converted !== `:${emoji.short}:` && !converted.startsWith('<img')) {
    return converted;
  }

  return null;
}

function getImage(emoji) {
  Emoji.replace_mode = 'css';
  Emoji.supports_css = true;
  Emoji.use_sheet = true;

  return Emoji.replace_colons(`:${emoji.short}:`).replace('/emoji-data/sheet_twitter_64.png', chrome.extension.getURL('emojis/sheet_twitter_64.png'));
}

function getEmojiElement(emoji) {
  return `<a href="#" title="${emoji.name}" class="btd-emoji">${getImage(emoji)}</a>`;
}

function getEmojiPickerMarkup(emojiContent) {
  return `
    <div class="popover popover-position-t margin-ll emoji-popover" id="" style="display: none;">
      <div class="caret">
        <span class="caret-outer"></span>
        <span class="caret-inner"></span>
      </div>
      <div class="emojis-compose-panel">
        <div class="emoji-container">
        ${emojiContent}
        </div>
        <div class="category-chooser">
      			<a title="Smileys &amp; People" data-cat="Smileys_n_People" href="#" class="btd-emoji emojis-t-1f600 active"></a>
      			<a title="Animals &amp; Nature" data-cat="Animals_n_Nature" href="#" class="btd-emoji emojis-t-1f436"></a>
      			<a title="Food &amp; Drink" data-cat="Food_n_Drink" href="#" class="btd-emoji emojis-t-1f34f"></a>
      			<a title="Activity" data-cat="Activity" href="#" class="btd-emoji emojis-t-26bd"></a>
      			<a title="Travel &amp; Places" data-cat="Travel_n_Places" href="#" class="btd-emoji emojis-t-1f697"></a>
      			<a title="Objects" data-cat="Objects" href="#" class="btd-emoji emojis-t-231a"></a>
      			<a title="Symbols" data-cat="Symbols" href="#" class="btd-emoji emojis-t-2764"></a>
      			<a title="Flags" data-cat="Flags" href="#" class="btd-emoji emojis-t-1f1e6-1f1eb"></a>
      		</div>
      </div>
    </div>
  `;
}

export function buildEmojiPicker(skinVariation = false) {
  let emojiContent = '';

  Object.keys(catOrder).forEach((cat) => {
    emojiContent += `<div class="${cat}">`;

    emojis.filter(emoji => emoji.cat === cat).forEach(emoji => {
      emojiContent += getEmojiElement(emoji);
    });

    emojiContent += '</div>';
  });

  const emojiPickerMarkup = getEmojiPickerMarkup(emojiContent);

  const emojiComposerButton = `
  <button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--9" data-original-title="" tabindex=""> <i class="icon icon-camera"></i> <span class="js-add-image-button-label label padding-ls">Emojis</span> </button>`;

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
}
