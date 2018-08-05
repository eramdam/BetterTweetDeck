import {BTDUrlProvider, BTDUrlProviderResultTypeEnum} from '../types';

export const GiphyProvider: BTDUrlProvider = {
  name: 'Giphy',
  settingsKey: 'giphy',
  matchUrl: () => false,
  fetchData: async () => ({
    type: BTDUrlProviderResultTypeEnum.IMAGE,
    thumbnailUrl: '',
    url: ''
  })
};
