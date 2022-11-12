import {makeBTDModule} from '../types/btdCommonTypes';

export const muteTwitterCircle = makeBTDModule(({TD, jq, settings}) => {
  jq(document).on('TD.ready', () => {
    const circleTweetFilters = TD.controller.filterManager
      .getAll()
      .filter((f) => f.type === 'BTD_circle_tweets');

    if (settings.muteCircleTweets) {
      if (circleTweetFilters.length < 1) {
        TD.controller.filterManager.addFilter('BTD_circle_tweets', '');
      }
    } else {
      circleTweetFilters.forEach((filter) => {
        TD.controller.filterManager.removeFilter(filter);
      });
    }
  });
});
