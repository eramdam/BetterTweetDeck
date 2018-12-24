import moduleRaid from 'moduleraid';

import {setupChirpHandler} from './modules/chirpHandler';
import {setupMediaSizeMonitor} from './modules/columnMediaSizes';
import {maybeAddCustomDate} from './modules/maybePrettyDate';
import {maybeRemoveTcoRedirections} from './modules/removeRedirection';
import {BTDMessageTypesEnums, msgToContent} from './services/messaging';
import {BTDSettings} from './types';

declare global {
  interface Window {
    TD: any;
    $: any;
  }
}

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

const Settings: BTDSettings = JSON.parse(document.querySelector('[data-btd-settings]')!.getAttribute('data-btd-settings') || '');

/**
 * Setup different services/modules.
 */
maybeRemoveTcoRedirections(Settings, window.TD);
maybeAddCustomDate(Settings, window.TD);
setupMediaSizeMonitor(Settings, window.TD);

/**
 * "Subscriptions".
 */
setupChirpHandler((payload) => {
  msgToContent({
    type: BTDMessageTypesEnums.DEBUG,
    payload
  });
});

$(document).one('dataColumnsLoaded', () => {
  msgToContent({
    type: BTDMessageTypesEnums.READY
  });
});
