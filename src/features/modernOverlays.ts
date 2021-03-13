import './modernOverlays.css';

import _ from 'lodash';

import {getBackgroundColorForMediaInChirp} from '../helpers/colorHelpers';
import {isHTMLElement} from '../helpers/domHelpers';
import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {getChirpFromKeyAlone} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const useModernOverlays = makeBTDModule((options) => {
  const {TD, jq, settings} = options;

  if (!settings.useModernFullscreenImage) {
    return;
  }

  const originalOverlayBackground = document.body.style.getPropertyValue(
    '--btd-original-overlay-background'
  );

  document.body.setAttribute('btd-modern-overlays', 'true');

  jq.ajaxPrefilter((options) => {
    try {
      const url = new URL(options.url || '');

      if (!url.searchParams.has('include_ext_alt_text')) {
        return;
      }

      options.url = buildURLWithSearchParams(options.url || '', {
        include_ext_media_color: true,
      });
    } catch (e) {
      //
    }
  });

  const modalObserver = new MutationObserver((mutations) => {
    const mutation = mutations[0];

    if (mutation.addedNodes.length) {
      const newImage = _(Array.from(mutation.addedNodes))
        .map((n) => isHTMLElement(n) && n)
        .compact()
        .map((n) => n.querySelector<HTMLImageElement>('img.media-img'))
        .compact()
        .first();

      if (!newImage) {
        return;
      }

      const tweetModalKey = document
        .querySelector('#open-modal [data-key]')
        ?.getAttribute('data-key');

      if (!tweetModalKey) {
        return;
      }

      const modalChirp = getChirpFromKeyAlone(TD, tweetModalKey);
      if (!modalChirp) {
        return;
      }

      const newBackgroundColor = getBackgroundColorForMediaInChirp(modalChirp.chirp, newImage.src);

      const currentOverlayBackground = document.body.style.getPropertyValue(
        '--btd-overlay-background'
      );

      if (currentOverlayBackground === originalOverlayBackground) {
        document.body.style.setProperty('--btd-overlay-background', `transparent`);
      }

      if (!newBackgroundColor) {
        document.body.style.setProperty(
          '--btd-overlay-background',
          'var(--btd-original-overlay-background)'
        );
        return;
      }
      document.body.style.setProperty('--btd-overlay-background', newBackgroundColor);
    } else if (mutation.removedNodes.length) {
      const isModalEmpty = document.querySelectorAll('#open-modal *').length === 0;

      if (isModalEmpty) {
        document.body.style.setProperty(
          '--btd-overlay-background',
          'var(--btd-original-overlay-background)'
        );
      }
      return;
    }
  });

  modalObserver.observe(document.querySelector('#open-modal')!, {
    childList: true,
    subtree: true,
  });
});
