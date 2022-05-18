import './contentWarnings.css';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {extractContentWarnings} from './contentWarningsHelpers';
import {matchAgainstSpoilerKeywords} from './spoilerHelpers';

export const contentWarnings = makeBTDModule(({TD, settings}) => {
  onChirpAdded((payload) => {
    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    if (chirpNode.querySelectorAll('.btd-content-warning, .tweet-detail').length > 0) {
      return;
    }

    const isNotificationAboutTweet = payload.chirpExtra.action;
    const textToMatchAgainst =
      isNotificationAboutTweet && payload.chirp.targetTweet
        ? payload.chirp.targetTweet.text
        : payload.chirp.text;
    const htmlTextToMatchAgainst =
      isNotificationAboutTweet && payload.chirp.targetTweet
        ? payload.chirp.targetTweet.htmlText
        : payload.chirp.htmlText;

    const contentWarningKeywords = settings.detectContentWarningsWithoutKeywords
      ? settings.singleWordContentWarnings
      : '';
    const spoilerKeywords = settings.detectSpoilers ? settings.spoilerKeywords : '';

    if (
      !settings.detectContentWarnings &&
      !settings.detectContentWarningsWithoutKeywords &&
      !settings.detectSpoilers
    ) {
      return;
    }

    // If the `text` field starts with mentions but `htmlText` doesn't, the mentions are "hidden"
    // and need to be removed
    const finalTextToMatchAgainst =
      textToMatchAgainst.startsWith('@') && !htmlTextToMatchAgainst.startsWith('@')
        ? textToMatchAgainst.replace(/^(@[a-z_]+ )+/gi, '')
        : textToMatchAgainst;

    const matches =
      extractContentWarnings(finalTextToMatchAgainst, contentWarningKeywords) ||
      matchAgainstSpoilerKeywords(finalTextToMatchAgainst, spoilerKeywords);

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
    tweetText.innerHTML = htmlTextToMatchAgainst.replace(/^\n/, '');

    if (matches.shouldRemoveSubject) {
      tweetText.innerHTML = tweetText.innerHTML.replace(TD.util.escape(warningBlock), '');
    }
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
