import './contentWarnings.css';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';

const contentWarningRegex =
  // eslint-disable-next-line no-useless-escape
  /^([\[\(]?(?:cw|tw|cn)(?:\W+)?\s([^\n|\]|\)|…]+)[\]\)…]?)(?:\n+)?((?:.+)?\n?)+$/gi;

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

    const matches = [...payload.chirp.text.matchAll(contentWarningRegex)];

    if (matches.length < 1) {
      return;
    }

    const warningBlock = matches[0][1];
    const warningSubject = matches[0][2];
    const warningText = matches[0][3];

    if (!warningSubject || !warningText) {
      return;
    }

    const details = document.createElement('details');
    details.classList.add('btd-content-warning', 'is-actionable');

    const summary = document.createElement('summary');
    summary.innerHTML = TD.util.transform(warningSubject);

    // Stopping event propagation because everything inside tweets opens the detail view
    summary.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    details.appendChild(summary);

    const tweetText = document.createElement('p');
    tweetText.classList.add('tweet-text', 'js-tweet-text', 'with-linebreaks');
    tweetText.innerHTML = payload.chirp.htmlText.replace(warningBlock, '').trim();
    details.appendChild(tweetText);

    chirpNode.querySelector('.tweet-text')?.replaceWith(details);
  });
});
