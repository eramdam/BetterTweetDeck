/* global TD */
import { Time } from './components/time';
import { BTDDebug } from './components/btdDebug';
import { RemoveRedirection } from './components/removeRedirection';


(async () => {
  const BTD_SETTINGS = $('[data-btd-settings]').data('btd-settings');
  const BTDTime = new Time(BTD_SETTINGS, TD);

  new BTDDebug(BTD_SETTINGS, TD).attach();

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
