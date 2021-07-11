import './requireAltImages.css';

import _ from 'lodash';

import {isHTMLElement} from '../helpers/domHelpers';
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
    const sendButton = composer.querySelector<HTMLButtonElement>('button.js-send-button');

    // If we don't have a send button, nothing to do.
    if (!sendButton) {
      return;
    }

    const hasImages = Boolean(composer.querySelector('.js-media-added > *'));
    const hasAddedWarning = _(mutations)
      .flatMap((m) => Array.from(m.addedNodes))
      .some((n) => {
        return (
          isHTMLElement(n) &&
          Boolean(
            n.classList.contains('btd-composer-warning') || n.closest('.btd-composer-warning')
          )
        );
      });

    const hasRemovedImages = _(mutations)
      .flatMap((m) => Array.from(m.removedNodes))
      .some((n) => {
        return Boolean(isHTMLElement(n) && n.classList.contains('compose-media-bar-holder'));
      });

    if (hasAddedWarning) {
      return;
    }

    const isButtonDisabled = sendButton.classList.contains('is-disabled');

    if (!hasImages) {
      sendButton.closest('.cf')?.querySelector('.btd-composer-warning')?.remove();
      if (sendButton && hasRemovedImages) {
        const textarea = composer.querySelector('textarea');
        if (!textarea) {
          return;
        }

        if (textarea.value.length && isButtonDisabled) {
          enableButton(sendButton);
        }
      }
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

    if (needsReminder && !isButtonDisabled) {
      disableButton(sendButton);
    } else if (isButtonDisabled) {
      enableButton(sendButton);
    }
  });

  observer.observe(composer, {
    childList: true,
    subtree: true,
  });
});

function disableButton(sendButton: HTMLElement) {
  sendButton.classList.add('is-disabled');
  sendButton.style.pointerEvents = 'none';
  sendButton.closest('.pull-right')?.insertAdjacentElement('beforebegin', makeWarningElement());
}

function enableButton(sendButton: HTMLElement) {
  sendButton.classList.remove('is-disabled');
  sendButton.style.pointerEvents = 'auto';
  sendButton.closest('.cf')?.querySelector('.btd-composer-warning')?.remove();
}

function makeWarningElement() {
  const el = document.createElement('div');
  el.classList.add('pull-left', 'btd-composer-warning');
  el.innerText = 'All images require a description!';
  return el;
}
