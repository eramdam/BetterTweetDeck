import './modernOverlays.css';

import _ from 'lodash';

import {maybeSetOverlayColorForMediaUrlInChirp} from '../helpers/colorHelpers';
import {isHTMLElement} from '../helpers/domHelpers';
import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {getChirpFromKeyAlone} from '../helpers/tweetdeckHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const useModernOverlays = makeBTDModule((options) => {
  const {TD, jq, settings} = options;

  if (!settings.useModernFullscreenImage) {
    return;
  }

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
        .querySelector('#open-modal .js-mediatable [data-key]')
        ?.getAttribute('data-key');

      if (!tweetModalKey) {
        return;
      }

      const modalChirp = getChirpFromKeyAlone(TD, tweetModalKey);
      if (!modalChirp) {
        return;
      }

      maybeSetOverlayColorForMediaUrlInChirp(modalChirp.chirp, newImage.src);
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

  jq(document).one('dataColumnsLoaded', () => {
    modalObserver.observe(document.querySelector('#open-modal')!, {
      childList: true,
      subtree: true,
    });
  });
});
