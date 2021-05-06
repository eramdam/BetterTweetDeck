import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {BTDSettings} from '../types/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => Promise<void>;

export const insertSettingsButton = makeBTDModule(({jq, TD}) => {
  const settingsButton = makeSettingsButton({});

  jq(document).one('dataColumnsLoaded', () => {
    document
      .querySelector('.app-navigator [data-action="settings-menu"]')
      ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
  });
});
