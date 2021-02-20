import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {sendMessageToBackground} from '../helpers/webExtensionHelpers';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/betterTweetDeck/btdMessageTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => void;

export const setupSettings = (settings: BTDSettings) => {
  const settingsButton = makeSettingsButton({
    onClick: () => {
      sendMessageToBackground({
        data: {
          requestId: undefined,
          isReponse: false,
          name: BTDMessages.OPEN_SETTINGS,
          origin: BTDMessageOriginsEnum.CONTENT,
          payload: undefined,
        },
      });
    },
  });

  document
    .querySelector('.app-navigator [data-action="settings-menu"]')
    ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
};
