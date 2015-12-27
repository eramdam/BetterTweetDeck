import * as BHelper from './util/browserHelper';
import * as logger from './util/logger';

BHelper.settings.setAll({
  'installed_date': 42,
  'ts': 'absolute_metric',
  'full_aft_24': false,
  'nm_disp': 'both',
  'no_hearts': true,
  'no_tco': true,
  'flash_tweets': 'mentions',
  'css': {
    'round_pic': true,
    'no_col_icns': true,
    'no_play_btn': true,
    'gray_icns_notifs': true,
    'minimal_mode': true,
    'small_icns_compose': true,
    'usrname_only_typeahed': true
  },
  'share_item': {
    'enabled': false,
    'short_txt': false
  }
}, (settings) => {
  logger.debug(`Default settings to`, settings);
}, true);