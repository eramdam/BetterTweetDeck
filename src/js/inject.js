/* global TD */
import moduleRaid from 'moduleraid';
import { Timestamp } from './components/time';
import { BTDUtils } from './components/btdDebug';
import { RemoveRedirection } from './components/removeRedirection';
import { ChirpHandler as ChirpHandlerClass } from './components/chirpHandler';
import { monitorMediaSizes, columnMediaSizes } from './util/columnsMediaSizeMonitor';
import { msgToContent } from './util/messaging';

const BTD_SETTINGS = JSON.parse(document.querySelector('[data-btd-settings]').dataset.btdSettings);

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

const Utils = new BTDUtils(BTD_SETTINGS, TD);

(async () => {
  /* Starts monitoring new chirps */
  const ChirpHandler = new ChirpHandlerClass(BTD_SETTINGS, TD, Utils);
  /* Monitor and get called on every chirp in the page */
  ChirpHandler.onChirp(async (chirpProps) => {
    if (chirpProps.urls) {
      const URLResult = await msgToContent({
        msg: 'CHIRP_REQUEST',
      });
      console.log(URLResult);
    }
  });

  /* init the ColumnsMediaSizeKeeper component */
  monitorMediaSizes();

  /*
  * If the user chose so, we override the timestamp function called by TweetDeck
  */
  if (BTD_SETTINGS.ts !== 'relative') {
    /* Init the Timestamp component */
    const BTDTime = new Timestamp(BTD_SETTINGS, TD);
    TD.util.prettyDate = d => BTDTime.prettyDate(d);
  }

  /*
 * If the user chose so, we override the link creation mechanism to remove the t.co redirection
 */
  if (BTD_SETTINGS.no_tco) {
    new RemoveRedirection(BTD_SETTINGS, TD).init();
  }

  $(document).one('dataColumnsLoaded', async () => {
    console.log('ready!');
  });
})();
