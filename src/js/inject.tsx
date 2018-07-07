/* global TD */
import moduleRaid from 'moduleraid';
import React from 'react';
import ReactDOM from 'react-dom';

import {BTDUtils} from './components/btdDebug';
import {ChirpHandler as ChirpHandlerClass} from './components/chirpHandler';
import {RemoveRedirection} from './components/removeRedirection';
import {Timestamp} from './components/time';
import {BTDUrlProviderResultTypeEnum} from './thumbnails/types';
import {BTDSettings} from './types';
import {monitorMediaSizes} from './util/columnsMediaSizeMonitor';
import {BTDMessageTypesEnums, msgToContent, ThumbnailDataMessage} from './util/messaging';

const BTD_SETTINGS: BTDSettings = JSON.parse(document.querySelector('[data-btd-settings]')!.getAttribute('data-btd-settings') || '');
const {TD} = window;

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

const Utils = new BTDUtils(BTD_SETTINGS, TD);
Utils.attach();

(async () => {
  /* Starts monitoring new chirps */
  const ChirpHandler = new ChirpHandlerClass(BTD_SETTINGS, TD, Utils);
  /* Monitor and get called on every chirp in the page */
  ChirpHandler.onChirp(async (chirpProps) => {
    if (chirpProps.urls.length > 0) {
      msgToContent<ThumbnailDataMessage>({
        type: BTDMessageTypesEnums.CHIRP_URLS,
        payload: chirpProps.urls
      }).then((urlData) => {
        switch (urlData.payload.type) {
          case BTDUrlProviderResultTypeEnum.IMAGE:
            if (!chirpProps.originalNode.querySelector('.js-tweet.tweet')) {
              return;
            }
            chirpProps.originalNode.querySelector('.js-tweet.tweet')!.insertAdjacentHTML('afterend', '<div class="js-media position-rel item-box-full-bleed margin-tm" data-btd-custom></div>');
            console.log(urlData.payload);
            ReactDOM.render(
              <div className=" js-media-preview-container media-preview-container position-rel width-p--100     margin-t--20   is-paused ">
                <div className="media-caret" />
                <a
                  className="js-media-image-link block med-link media-item media-size-large   is-zoomable"
                  href={urlData.payload.url}
                  target="_blank"
                  style={{
                    backgroundImage: `url("${urlData.payload.thumbnailUrl}")`,
                    color: 'red'
                  }}
                  onMouseDown={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    console.log('yolo');
                  }}
                >
                  {' '}
                </a>
                <a
                  href="https://images.google.com/searchbyimage?image_url=https://pbs.twimg.com/media/DhfaJJ6U8AARvzh.jpg?format=jpg&amp;name=medium"
                  target="_blank"
                  rel="url noopener noreferrer"
                  className="js-show-tip reverse-image-search is-actionable "
                  title="Search image on Google"
                />
              </div>,
              chirpProps.originalNode.querySelector('[data-btd-custom]'),
              console.log
            );
            break;

          default:
            break;
        }
      });
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
    TD.util.prettyDate = (d: Date) => BTDTime.prettyDate(d);
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

// onBTDMessage(BTDMessageOriginsEnum.CONTENT, (ev) => {
//   console.log('to inject', ev.data.type);
// });

declare global {
  interface Window {
    TD: any;
    $: any;
  }
}
