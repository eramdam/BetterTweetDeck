import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => void;

export const insertSettingsButton = () => {
  const settingsButton = makeSettingsButton({});

  document
    .querySelector('.app-navigator [data-action="settings-menu"]')
    ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
};
