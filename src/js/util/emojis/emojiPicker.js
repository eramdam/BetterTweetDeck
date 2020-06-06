import { insertInsideComposer } from '../tweetdeckUtils';
import { $ } from '../util';
import {
  clickedOutsideElement,
  getEmojiElement,
  getEmojiListMarkup,
  getEmojiPickerMarkup,
  getSkinVariation,
  getUnified,
} from './emojiUtils';

function insertEmojiComposerButton() {
  const emojiComposerButton = `
  <button class="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--9" data-original-title="" tabindex=""> <i class="icon btd-emoji-icon"></i> <span class="js-add-image-button-label label padding-ls">Emojis</span> </button>`;

  if ($('.js-add-image-button')) {
    $('.js-add-image-button')[0].insertAdjacentHTML('beforebegin', emojiComposerButton);
    $('.js-add-emojis')[0].insertAdjacentHTML(
      'afterend',
      `
      <span class="js-emoji-holder"></span>
    `
    );
  }
}

const baseEmojiMarkup = getEmojiPickerMarkup(getEmojiListMarkup());

export function attachPickerAndButton() {
  insertEmojiComposerButton();

  if ($('.js-emoji-holder')) {
    $('.js-emoji-holder')[0].innerHTML = baseEmojiMarkup;
  }
}

function rebuildEmojiPicker() {
  if ($('.js-emoji-holder')) {
    $('.js-emoji-holder')[0].innerHTML = getEmojiPickerMarkup(getEmojiListMarkup());
  }
}

export function registerEmojiPickerEventsHandlers() {
  // Click on button.
  window.addEventListener('resize', () => {
    const emojiPopover = $('.emoji-popover')[0];

    if (emojiPopover.style.display === 'none') {
      return;
    }

    if (emojiPopover.getBoundingClientRect().bottom > window.innerHeight) {
      const button = document.body.querySelector('.js-add-emojis');
      const buttonDistanceFromBottom = Math.ceil(
        window.innerHeight - button.getBoundingClientRect().bottom + button.clientHeight + 10
      );

      emojiPopover.style = `display: block; bottom: ${buttonDistanceFromBottom}px`;
    } else {
      emojiPopover.style = 'display: block';
    }
  });
  document.body.addEventListener('click', (ev) => {
    if (!(ev.target.closest('.js-add-emojis') || ev.target.matches('.js-add-emojis'))) {
      return;
    }

    if (!$('.emoji-popover')) {
      return;
    }

    const emojiPopover = $('.emoji-popover')[0];

    if (emojiPopover.style.display === 'none') {
      emojiPopover.style = 'display: block';

      if (emojiPopover.getBoundingClientRect().bottom > window.innerHeight) {
        emojiPopover.style.top = '';
        const button = document.body.querySelector('.js-add-emojis');
        const buttonDistanceFromBottom = Math.ceil(
          window.innerHeight - button.getBoundingClientRect().bottom + button.clientHeight + 10
        );

        emojiPopover.style = `display: block; bottom: ${buttonDistanceFromBottom}px`;
      }
    } else {
      emojiPopover.style = 'display: none';
    }
  });

  // Click outside/inside emoji picker
  document.body.addEventListener('click', (ev) => {
    if (
      clickedOutsideElement('.emoji-popover', ev) &&
      clickedOutsideElement('.js-add-emojis', ev) &&
      $('.emoji-popover')[0].style.display === 'block'
    ) {
      $('.emoji-popover')[0].style.display = 'none';
      $('.emoji-search input')[0].value = '';
      $('.emoji-popover .emoji-container')[0].innerHTML = getEmojiListMarkup();
    }
  });

  // Category button on emoji picker
  document.body.addEventListener('click', (ev) => {
    if (
      !ev.target.matches('.category-chooser button') &&
      !ev.target.closest('button[data-btd-emoji-cat]')
    ) {
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

  // Change preview of emoji on hover
  let timeoutId;
  document.body.addEventListener('mouseover', (ev) => {
    if (!ev.target.matches('.js-emoji-holder') && !ev.target.closest('.js-emoji-holder')) {
      return;
    }

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
    const image = getEmojiElement(
      { s: [emoji.getAttribute('data-btd-shortcode')] },
      hasVariation ? getSkinVariation() : undefined
    );

    $('.emoji-popover .emoji-preview')[0].classList.add('-visible');
    $('.emoji-popover .emoji-preview .emoji-current-img')[0].innerHTML = image;
    $('.emoji-popover .emoji-preview .emoji-current-name')[0].innerText = `:${shortcode}:`;
  });

  // Click on an emoji
  document.body.addEventListener('click', (ev) => {
    if (!ev.target.matches('.js-emoji-holder') && !ev.target.closest('.js-emoji-holder')) {
      return;
    }

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
    const unified = getUnified(
      { s: [emoji.getAttribute('data-btd-shortcode')], hs: hasVariation },
      getSkinVariation()
    );

    insertInsideComposer(unified);
  });

  document.body.addEventListener('click', (ev) => {
    if (!ev.target.matches('.btd-skin-tone')) {
      return;
    }

    ev.preventDefault();
    ev.stopPropagation();
    const skinTone = ev.target.getAttribute('data-btd-skin-tone');

    localStorage['btd-skin-variation'] = skinTone;
    rebuildEmojiPicker();
  });

  document.body.addEventListener('input', (ev) => {
    if (!ev.target.matches('.emoji-search input')) {
      return;
    }

    const val = String(ev.target.value);
    $('.emoji-popover .emoji-container')[0].innerHTML = getEmojiListMarkup(val);
  });
}
