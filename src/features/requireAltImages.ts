import './requireAltImages.css';

import _ from 'lodash';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

// Some of the logic is based on https://www.abitofaccess.com/alt-or-not-code
export const requireAltImages = makeBTDModule(({settings, TD, jq}) => {
  modifyMustacheTemplate(TD, 'compose/docked_compose.mustache', (str) => {
    return str.replace(
      'cf margin-t--12 margin-b--30',
      'cf margin-t--12 margin-b--30 btd-compose-button-wrapper'
    );
  });

  if (!settings.disableTweetButtonIfAltIsMissing) {
    return;
  }

  const composer = document.querySelector<HTMLDivElement>('div[data-drawer="compose"]');

  if (!composer) {
    return;
  }

  let noAltTextIndicator = '';
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

    const needsReminder = composerNeedsAltReminder(
      composer,
      settings.disableTweetButtonIfAltIsMissingInDMs
    );
    const needsConfirmation = composerNeedsConfirmation(composer);

    if (needsReminder || needsConfirmation) {
      disableButton(sendButton, !needsReminder);
    } else {
      enableButton(sendButton);
    }
  });

  observer.observe(composer, {
    childList: true,
    subtree: true,
  });

  jq(composer).on('change', 'input#account-safeguard-checkbox', () => {
    const sendButton = composer.querySelector<HTMLButtonElement>('button.js-send-button');

    if (!sendButton) {
      return;
    }

    const needsReminder = composerNeedsAltReminder(
      composer,
      settings.disableTweetButtonIfAltIsMissingInDMs
    );

    if (needsReminder) {
      disableButton(sendButton);
      return false;
    }
  });

  function composerNeedsAltReminder(
    composer: HTMLDivElement,
    disableTweetButtonIfAltIsMissingInDMs: boolean
  ) {
    const hasImages = Boolean(composer.querySelector('.js-media-added > *'));
    if (!hasImages) {
      return false;
    }
    const isComposingDM = Boolean(
      composer.querySelector(
        '.compose-message-recipient-container:not(.is-hidden) .compose-message-account'
      )
    );

    const imagesAreMissingDescription = Array.from(
      composer.querySelectorAll('div.js-add-image-description')
    ).some((el) => {
      if (!noAltTextIndicator) {
        noAltTextIndicator = el.textContent?.trim() || '';
      }

      return el.textContent?.trim() === noAltTextIndicator;
    });

    return isComposingDM
      ? disableTweetButtonIfAltIsMissingInDMs && imagesAreMissingDescription
      : imagesAreMissingDescription;
  }
  function composerNeedsConfirmation(composer: HTMLDivElement) {
    const confirmationCheckbox = composer.querySelector<HTMLInputElement>(
      '.js-account-safeguard-checkbox:not(.is-hidden) input#account-safeguard-checkbox'
    );

    return confirmationCheckbox ? !confirmationCheckbox.checked : false;
  }

  function disableButton(sendButton: HTMLElement, noWarning = false) {
    sendButton.classList.add('is-disabled');
    sendButton.style.pointerEvents = 'none';
    if (
      sendButton.closest('.btd-compose-button-wrapper')!.querySelector('.btd-composer-warning') &&
      !noWarning
    ) {
      return;
    }
    if (noWarning) {
      Array.from(
        sendButton.closest('.cf')?.querySelectorAll('.btd-composer-warning') || []
      ).forEach((el) => el.remove());
    } else {
      sendButton.closest('.pull-right')?.insertAdjacentElement('beforebegin', makeWarningElement());
    }
  }

  function enableButton(sendButton: HTMLElement) {
    sendButton.classList.remove('is-disabled');
    sendButton.style.pointerEvents = 'auto';
    Array.from(sendButton.closest('.cf')?.querySelectorAll('.btd-composer-warning') || []).forEach(
      (el) => el.remove()
    );
  }

  function makeWarningElement() {
    const el = document.createElement('div');
    el.classList.add('pull-left', 'btd-composer-warning');
    el.innerText = 'All images require a description!';
    return el;
  }
});
