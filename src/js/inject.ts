import moduleRaid from 'moduleraid';

import {getChirpFromKey} from './helpers/tweetdeckHelpers';
import {setupChirpHandler} from './modules/chirpHandler';
import {setupMediaSizeMonitor} from './modules/columnMediaSizes';
import {maybeAddCustomDate} from './modules/maybePrettyDate';
import {maybeRemoveTcoRedirections} from './modules/removeRedirection';
import {
  BTDMessageOriginsEnum,
  BTDMessageTypesEnums,
  msgToContent,
  onBTDMessage,
  OpenFullscreenPreviewMessage
} from './services/messaging';
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
setupChirpHandler(
  (payload) => {
    msgToContent({
      type: BTDMessageTypesEnums.GOT_CHIRP,
      payload
    });
  },
  (payload) => {
    msgToContent({
      type: BTDMessageTypesEnums.REMOVED_CHIRP,
      payload
    });
  }
);

onBTDMessage<OpenFullscreenPreviewMessage>(BTDMessageOriginsEnum.CONTENT, BTDMessageTypesEnums.OPEN_FULLSCREEN_PREVIEW, (ev) => {
  const {chirpKey, columnKey, urlData} = ev.payload;

  const chirp = getChirpFromKey(chirpKey, columnKey);
  console.time('markup');
  const markup = chirp.targetTweet ? chirp.targetTweet.renderInMediaGallery() : chirp.renderInMediaGallery();
  console.timeEnd('markup');

  console.log({urlData, chirp});
  if (!chirp) {

  }

  // const modal = $('#open-modal');

  // modal.append(markup);

  // modal.css('display', 'block');
});

$(document).one('dataColumnsLoaded', () => {
  msgToContent({
    type: BTDMessageTypesEnums.READY
  });
});
