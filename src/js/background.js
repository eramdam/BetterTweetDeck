import * as BHelper from './util/browserHelper';
import * as logger from './util/logger';

BHelper.settings.setAll({
  test: {
    foo: 42
  }
}, (settings) => {
  logger.debug(`Default settings to`, settings);
}, true);