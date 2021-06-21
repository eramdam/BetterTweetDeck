import './requireAltImages.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

// Some of the logic is based on https://www.abitofaccess.com/alt-or-not-code
export const requireAltImages = makeBTDModule(({settings, TD}) => {
  if (!settings.disableTweetButtonIfAltIsMissing) {
    return;
  }

  const composer = document.querySelector('div[data-drawer="compose"]');

  if (!composer) {
    return;
  }

  let noAltTextIndicator = '';

  modifyMustacheTemplate(TD, 'compose/docked_compose.mustache', (str) => {
    return str.replace(
      'cf margin-t--12 margin-b--30',
      'cf margin-t--12 margin-b--30 btd-compose-button-wrapper'
    );
  });

  const observer = new MutationObserver((mutations) => {
    const hasTouchedImages = mutations.some((m) => {
      if (!(m.target instanceof HTMLElement)) {
        return false;
      }

      return m.target.matches('.js-media-added');
    });

    // If we didn't edit media, nothing to do.
    if (!hasTouchedImages) {
      return;
    }

    const sendButton = composer.querySelector<HTMLButtonElement>('button.js-send-button');

    // If we don't have a send button, nothing to do.
    if (!sendButton) {
      return;
    }

    const needsReminder = Array.from(
      composer.querySelectorAll('div.js-add-image-description')
    ).some((el) => {
      if (!noAltTextIndicator) {
        noAltTextIndicator = el.textContent?.trim() || '';
      }

      return el.textContent?.trim() === noAltTextIndicator;
    });

    if (needsReminder) {
      sendButton.classList.add('is-disabled');
      sendButton.style.pointerEvents = 'none';
      sendButton.closest('.pull-right')?.insertAdjacentElement('beforebegin', makeWarningElement());
    } else {
      sendButton.classList.remove('is-disabled');
      sendButton.style.pointerEvents = 'auto';
      sendButton.closest('.cf')?.querySelector('.pull-left')?.remove();
    }
  });

  observer.observe(composer, {
    childList: true,
    subtree: true,
  });
});

function makeWarningElement() {
  const el = document.createElement('div');
  el.classList.add('pull-left');
  el.innerText = 'All images require a description!';
  return el;
}
