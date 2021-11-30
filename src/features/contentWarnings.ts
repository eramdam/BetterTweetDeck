import './contentWarnings.css';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {extractContentWarnings} from './contentWarningsHelpers';

export const contentWarnings = makeBTDModule(({TD, settings}) => {
  if (!settings.detectContentWarnings) {
    return;
  }

  onChirpAdded((payload) => {
    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    if (chirpNode.querySelectorAll('.btd-content-warning, .tweet-detail').length > 0) {
      return;
    }

    const matches = extractContentWarnings(payload.chirp.text);

    if (!matches) {
      return;
    }

    const warningBlock = matches.block;
    const warningSubject = matches.subject;
    const warningText = matches.text;

    if (!warningSubject || !warningText) {
      return;
    }

    const details = document.createElement('details');
    details.classList.add('btd-content-warning', 'is-actionable');

    const summary = document.createElement('summary');
    summary.innerHTML = TD.util.transform(warningBlock);

    // Stopping event propagation because everything inside tweets opens the detail view
    summary.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    details.appendChild(summary);

    const tweetText = document.createElement('p');
    tweetText.classList.add('tweet-text', 'js-tweet-text', 'with-linebreaks');
    tweetText.innerHTML = payload.chirp.htmlText
      .replace(TD.util.escape(warningBlock), '')
      .replace(/^\n/, '');
    details.appendChild(tweetText);
    details.addEventListener('toggle', () => {
      if (details.open) details.closest('.js-tweet')?.classList.add('cw-open');
      else {
        details.closest('.js-tweet')?.classList.remove('cw-open');
      }
    });

    chirpNode.querySelector('.tweet-text')?.replaceWith(details);
    details.closest('.js-tweet')?.classList.add('cw');
  });
});
