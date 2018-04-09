/* global TD */
import { Time } from './util/time';

const BTD_SETTINGS = $('[data-btd-settings]').data('btd-settings');
const BTDTime = new Time(BTD_SETTINGS);

$(document).one('dataColumnsLoaders', () => {
  console.log('ready!');
});


if (BTD_SETTINGS.ts !== 'relative') {
  TD.util.prettyDate = d => BTDTime.prettyDate(d);
}
