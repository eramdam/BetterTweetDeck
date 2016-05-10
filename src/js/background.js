import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';

BHelper.settings.setAll({
  installed_date: 42,
  ts: 'absolute_metric',
  full_aft_24: true,
  nm_disp: 'inverted',
  no_hearts: false,
  no_tco: true,
  flash_tweets: 'mentions',
  css: {
    round_pic: true,
    no_col_icns: true,
    no_play_btn: true,
    gray_icns_notifs: true,
    minimal_mode: true,
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
}, (settings) => {
  console.debug('Default settings to', settings);
}, true);

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
