import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';
import { defaultsDeep } from 'lodash';

const defaultSettings = {
  installed_date: new Date().getTime(),
  ts: 'absolute_metric',
  full_aft_24: true,
  nm_disp: 'inverted',
  no_hearts: false,
  no_tco: true,
  flash_tweets: 'mentions',
  rtl_text_style: true,
  css: {
    round_pic: true,
    no_col_icns: true,
    no_play_btn: true,
    gray_icns_notifs: false,
    minimal_mode: true,
    flash_tweets: 'mentions',
    small_icns_compose: true,
    usrname_only_typeahed: true,
    hide_view_conversation: true,
    actions_on_right: true,
    actions_on_hover: true,
  },
  share_item: {
    enabled: false,
    short_txt: false,
  },
};

BHelper.settings.getAll(settings => {
  BHelper.settings.setAll(defaultsDeep(settings, defaultSettings), (newSettings) => {
    console.debug('Default settings to', newSettings);
  }, true);
});

Messages.on((message, sender, sendResponse) => {
  switch (message.action) {
    case 'get_settings':
      BHelper.settings.getAll((settings) => sendResponse({ settings }));
      return true;

    case 'get':
      BHelper.settings.get(message.key, (val) => sendResponse({ val }));
      return true;

    default:
      return false;
  }
});
