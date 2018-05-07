/* global TD */
import { Timestamp } from './components/time';
import { BTDUtils } from './components/btdDebug';
import { RemoveRedirection } from './components/removeRedirection';
// import { msgToContent } from './util/messaging';
import { ChirpHandler as ChirpHandlerClass } from './components/chirpHandler';
import { monitorMediaSizes } from './util/columnsMediaSizeMonitor';

const BTD_SETTINGS = $('[data-btd-settings]').data('btd-settings');
const Utils = new BTDUtils(BTD_SETTINGS, TD);
const ChirpHandler = new ChirpHandlerClass(BTD_SETTINGS, TD, Utils);

(async () => {
  /** Starts monitoring new chirps */
  ChirpHandler.monitorChirps();

  /** init the ColumnsMediaSizeKeeper component */
  monitorMediaSizes();

  /** Init the Timestamp component */
  const BTDTime = new Timestamp(BTD_SETTINGS, TD);

  /*
 * If the user chose so, we override the timestamp function called by TweetDeck
 */
  if (BTD_SETTINGS.ts !== 'relative') {
    TD.util.prettyDate = d => BTDTime.prettyDate(d);
  }

  /*
 * If the user chose so, we override the link creation mechanism to remove the t.co redirection
 */
  if (BTD_SETTINGS.no_tco) {
    new RemoveRedirection(BTD_SETTINGS, TD).init();
  }

  $(document).one('dataColumnsLoaded', () => {
    console.log('ready!');
  });
})();
