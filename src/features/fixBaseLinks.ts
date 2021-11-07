import {isEntityFinderPositiveResult} from 'skyla';

import {makeBTDModule} from '../types/btdCommonTypes';

export const fixBaseLinks = makeBTDModule(({skyla}) => {
  skyla.onEntityAdded((res) => {
    if (!isEntityFinderPositiveResult(res)) {
      return;
    }

    Array.from(res.node.querySelectorAll('a[href^="/"]')).forEach((anchor) => {
      if ((anchor.getAttribute('href') || '').startsWith('/i/')) {
        return;
      }

      anchor.setAttribute('href', `https://twitter.com${anchor.getAttribute('href')}`);
    });
  });
});
