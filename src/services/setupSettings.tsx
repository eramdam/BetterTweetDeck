import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => void;

export const insertSettingsButton = makeBTDModule(({jq}) => {
  const settingsButton = makeSettingsButton({});

  jq(document).one('dataColumnsLoaded', () => {
    document
      .querySelector('.app-navigator [data-action="settings-menu"]')
      ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
  });
});
