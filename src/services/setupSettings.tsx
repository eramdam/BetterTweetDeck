import {makeSettingsButton} from '../components/openBtdSettingsButton';
import {sendInternalBTDMessage} from '../helpers/communicationHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {insertDomChefElement} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {BTDMessageOriginsEnum, BTDMessages} from '../types/btdMessageTypes';
import {BTDSettings} from '../types/btdSettingsTypes';

export type OnSettingsUpdateAsync = (newBtdSettings: BTDSettings) => void;
export type OnSettingsUpdate = (newBtdSettings: BTDSettings) => void;

export const insertSettingsButton = makeBTDModule(({jq, TD}) => {
  const settingsButton = makeSettingsButton({});

  jq(document).one('dataColumnsLoaded', () => {
    document
      .querySelector('.app-navigator [data-action="settings-menu"]')
      ?.insertAdjacentElement('beforebegin', insertDomChefElement(settingsButton));
  });

  jq(document).on('click', '[btd-action="open_theme_settings"]', () => {
    sendInternalBTDMessage({
      isReponse: false,
      name: BTDMessages.OPEN_SETTINGS,
      origin: BTDMessageOriginsEnum.INJECT,
      payload: {
        selectedId: 'theme',
      },
    });
  });

  modifyMustacheTemplate(TD, 'settings/global_setting_general.mustache', (string) => {
    const result = string.replace(
      `<div class="obj-left js-theme"> <label class="fixed-width-label txt-uppercase touch-larger-label"><b>{{_i}}Theme{{/i}}</b></label> <label class="fixed-width-label radio"> <input type="radio" class="js-settings-radio js-theme-radio touch-larger-label" name="theme" value="dark"> {{_i}}Dark{{/i}} </label> <label class="fixed-width-label radio"> <input type="radio" class="js-settings-radio js-theme-radio touch-larger-label" name="theme" value="light"> {{_i}}Light{{/i}} </label> </div>`,
      `
      <div class="obj-left js-theme"><label class="fixed-width-label txt-uppercase touch-larger-label"><b>{{_i}}Theme{{/i}}</b></label><a href="#" style="width:120px; display: inline-block;" btd-action="open_theme_settings">Open theme preferences</a></div>`
    );

    return result;
  });
});
