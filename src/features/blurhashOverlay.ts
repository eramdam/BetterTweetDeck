import _ from 'lodash';

import {getOverlayBackgroundForImage} from '../helpers/blurhashHelpers';
import {isHTMLElement} from '../helpers/domHelpers';
import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const useBlurhashForOverlayBackground = makeBTDModule((options) => {
  const originalOverlayBackground = document.body.style.getPropertyValue(
    '--btd-original-overlay-background'
  );

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

      const imageUrl = buildURLWithSearchParams(newImage.src, {
        name: 'thumb',
      });

      const currentOverlayBackground = document.body.style.getPropertyValue(
        '--btd-overlay-background'
      );

      if (currentOverlayBackground === originalOverlayBackground) {
        document.body.style.setProperty('--btd-overlay-background', `transparent`);
      }

      getOverlayBackgroundForImage(imageUrl).then((color) => {
        if (!color) {
          document.body.style.setProperty(
            '--btd-overlay-background',
            '--btd-original-overlay-background'
          );
          return;
        }
        document.body.style.setProperty('--btd-overlay-background', color);
      });
    } else if (mutation.removedNodes.length) {
      const isModalEmpty = document.querySelectorAll('#open-modal *').length === 0;

      if (isModalEmpty) {
        console.log('resetting overlay');
        document.body.style.setProperty(
          '--btd-overlay-background',
          '--btd-original-overlay-background'
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
