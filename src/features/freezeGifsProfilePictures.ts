import {memoize} from 'lodash';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeFreezeGifsInProfilePicture = makeBTDModule(({settings}) => {
  if (!settings.disableGifsInProfilePictures) {
    return;
  }

  const getImageUrl = memoize((profilePic: string) => {
    const baseUrl = new URL(`https://images4-focus-opensocial.googleusercontent.com/gadgets/proxy`);

    baseUrl.searchParams.append('url', profilePic);
    baseUrl.searchParams.append('container', 'focus');
    baseUrl.searchParams.append('refresh', '86400');
    baseUrl.searchParams.append('resize_w', '200');

    return baseUrl.toString();
  });

  const mutationCallback = () => {
    Array.from(document.querySelectorAll<HTMLImageElement>(`img.avatar`) || [])
      .filter((img) => {
        return !!img;
      })
      .filter((img) => img.src.endsWith('.gif'))
      .forEach((img, _i, array) => {
        console.log(array.length, ' images to change');

        img.src = getImageUrl(img.src);
      });
  };
  const observer = new MutationObserver(mutationCallback);

  mutationCallback();
  observer.observe(document.body!, {
    subtree: true,
    childList: true,
  });
});
