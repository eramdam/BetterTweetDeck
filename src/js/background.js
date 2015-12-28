import * as BHelper from './util/browserHelper';
import * as logger from './util/logger';

BHelper.settings.setAll({
  'installed_date': 42,
  'ts': 'absolute_metric',
  'full_aft_24': true,
  'nm_disp': 'both',
  'no_hearts': false,
  'no_tco': true,
  'flash_tweets': 'mentions',
  'css': {
    'round_pic': true,
    'no_col_icns': true,
    'no_play_btn': true,
    'gray_icns_notifs': false,
    'minimal_mode': true,
    'small_icns_compose': true,
    'usrname_only_typeahed': true
  },
  'share_item': {
    'enabled': false,
    'short_txt': false
  }
}, (settings) => {
  console.debug(`Default settings to`, settings);
}, true);