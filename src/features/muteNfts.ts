import {makeBTDModule} from '../types/btdCommonTypes';

export const muteNftAvatars = makeBTDModule(({TD, jq, settings}) => {
  jq(document).on('TD.ready', () => {
    const nftFilters = TD.controller.filterManager
      .getAll()
      .filter((f) => f.type === 'BTD_nft_avatar');

    if (nftFilters.length < 1) {
      return;
    }

    if (settings.muteNftAvatars) {
      TD.controller.filterManager.addFilter('BTD_nft_avatar', '');
    } else {
      nftFilters.forEach((filter) => {
        TD.controller.filterManager.removeFilter(filter);
      });
    }
  });
});
