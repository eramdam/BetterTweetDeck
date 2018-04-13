/* global TD */
import { Time } from './components/time';

const BTD_SETTINGS = $('[data-btd-settings]').data('btd-settings');
const BTDTime = new Time(BTD_SETTINGS, TD);

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
  const dummyEl = document.createElement('span');
  const originalCreateUrlAnchor = TD.util.createUrlAnchor;

  TD.util.createUrlAnchor = (e) => {
    let result = originalCreateUrlAnchor(e);
    // this never touches the final DOM ever so it's fine
    dummyEl.innerHTML = result;
    const anchor = dummyEl.querySelector('a');

    if (anchor) {
      anchor.href = anchor.dataset.fullUrl;
      result = anchor.outerHTML;
    }

    return result;
  };
}

$(document).one('dataColumnsLoaders', () => {
  console.log('ready!');
});
