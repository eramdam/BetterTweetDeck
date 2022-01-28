import './mediaWarnings.css';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {TweetDeckColumnMediaPreviewSizesEnum, TwitterMediaWarnings} from '../types/tweetdeckTypes';

const mediaWarningsRenderers = {
  [TwitterMediaWarnings.ADULT_CONTENT]: 'nudity',
  [TwitterMediaWarnings.GRAPHIC_VIOLENCE]: 'violence',
  [TwitterMediaWarnings.OTHER]: 'sensitive content',
};

export const mediaWarnings = makeBTDModule(({TD}) => {
  onChirpAdded((payload) => {
    if (!payload.chirp.mediaWarnings || payload.chirp.mediaWarnings.length === 0) {
      return;
    }

    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    const mediaPreview = chirpNode.querySelector('.js-media');

    if (!mediaPreview || payload.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.OFF) {
      return;
    }

    if (mediaPreview.classList.contains('item-box-full-bleed')) {
      mediaPreview.classList.add('full-bleed-media-preview-with-warning');
    } else {
      mediaPreview.classList.add('media-preview-with-warning');
    }

    const contentWarnings = payload.chirp.mediaWarnings.map((m) => mediaWarningsRenderers[m]);
    if (contentWarnings.length > 1) {
      contentWarnings[contentWarnings.length - 1] = `and ${
        contentWarnings[contentWarnings.length - 1]
      }`;
    }
    const warningsAsString = contentWarnings.join(', ');
    const contentWarningHeader = `Content warning: ${warningsAsString}`;
    const isInSmallMediaColumn =
      payload.columnMediaSize === TweetDeckColumnMediaPreviewSizesEnum.SMALL;
    let contentWarningBody = `The Tweet author flagged this Tweet as showing sensitive content.`;
    const details = document.createElement('details');
    if (isInSmallMediaColumn && payload.chirp.entities.media.length === 1) {
      contentWarningBody += ` Click to show.`;
    }
    details.open = true;
    details.classList.add('media-warning');
    details.classList.add(`media-warning-${payload.chirp.entities.media.length}`);

    details.innerHTML = `
      <div>
        <strong>${contentWarningHeader}</strong>
        <span>${contentWarningBody}</span>
        <div class="show-button-row">
          <span>Show</span>
        </div>
      </div>
    `.trim();

    mediaPreview.appendChild(details);
    const summary = document.createElement('summary');
    details.appendChild(summary);
    summary.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    details.addEventListener('toggle', (e) => {
      if (!(e.target instanceof HTMLDetailsElement)) {
        return;
      }

      const parentMedia = e.target.closest('.js-media');

      if (!parentMedia) {
        return;
      }

      if (details.open) {
        summary.textContent = '';

        if (parentMedia.classList.contains('item-box-full-bleed')) {
          parentMedia.classList.add('full-bleed-media-preview-with-warning');
        } else {
          parentMedia.classList.add('media-preview-with-warning');
        }
      } else {
        summary.textContent = 'Hide';
        if (parentMedia.classList.contains('item-box-full-bleed')) {
          parentMedia.classList.remove('full-bleed-media-preview-with-warning');
        } else {
          parentMedia.classList.remove('media-preview-with-warning');
        }
      }
    });
  });
});
