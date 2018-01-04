import gifshot from 'gifshot';
import FileSaver from 'file-saver';
import PromiseEach from 'promise-each';
import config from 'config';
import timestampOnElement from './util/timestamp';
import { send as sendMessage, on as onMessage } from './util/messaging';
import * as secureDomify from './util/secureDomify';
import * as Thumbnails from './util/thumbnails';
import * as Templates from './util/templates';
import Emojis from './util/emojis';
import Log from './util/logger';
import * as BHelper from './util/browserHelper';
import { $, TIMESTAMP_INTERVAL, onEvent, sendEvent } from './util/util';
import '../css/index.css';

let SETTINGS;

/**
 * This will contain the sizes of each column
 * Ensuring a much faster way to retrieve/update them than querying the DOM
 */
const COLUMNS_MEDIA_SIZES = new Map();

/**
 * Injecting inject.js in head before doing anything else
 */

sendMessage({ action: 'get_settings' }, (response) => {
  SETTINGS = response.settings;
  const scripts = [
    BHelper.getExtensionUrl('js/inject.js'),
  ];

  if (!BHelper.isFirefox) {
    scripts.push(BHelper.getExtensionUrl('embeds.js'));
  }

  scripts.forEach((src) => {
    const el = document.createElement('script');
    el.src = src;
    el.setAttribute('data-btd-settings', JSON.stringify(SETTINGS));
    document.head.appendChild(el);
  });

  const getFontFile = format => BHelper.getExtensionUrl(`fonts/tweetdeck-regular-webfont-old.${format}`);

  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = `
    @font-face {
      font-family: 'old_tweetdeckregular';
      src: url("${getFontFile('eot')}");
      src: url("${getFontFile('eot')}?#iefix") format("embedded-opentype"), url("${getFontFile('woff')}") format("woff"), url("${getFontFile('ttf')}") format("truetype"), url("${getFontFile('svg')}") format("svg");
      font-weight: normal;
      font-style: normal
    }
  `;

  document.head.appendChild(style);
});

function saveGif(gifshotObj, name, event, videoEl) {
  return fetch(gifshotObj.image)
    .then(res => res.blob())
    .then((blob) => {
      event.target.style.opacity = 1;
      event.target.innerText = 'Download as .GIF';
      FileSaver.saveAs(blob, name);
      videoEl.playbackRate = 1;
    });
}

function updateGifProgress(element, progress) {
  if (progress > 0.99) {
    element.innerText = 'Converting to GIF... (Finalizing)';
  } else {
    element.innerText = `Converting to GIF... (${Number(progress * 100).toFixed(1)}%)`;
  }
}


/**
 * Since this function wil be called every ~3sec we have to check if we actually
 * have timestamps to change before anything else
 */
function refreshTimestamps() {
  const timestamps = $('.js-timestamp');

  if (!timestamps) {
    return;
  }


  timestamps.forEach((jsTimstp) => {
    const d = jsTimstp.getAttribute('data-time');
    const t = $('a, span', jsTimstp);
    const noChildren = jsTimstp.childElementCount === 0;

    if (!t && !noChildren) {
      return;
    }

    if (noChildren) {
      timestampOnElement(jsTimstp, d);
      return;
    }

    t.forEach(el => timestampOnElement(el, d));
  });
}

/**
 * This function will simply take settings in `css` field
 * and then add/remove classes on the body
 */

const disabledOnFirefox = ['no_scrollbars', 'slim_scrollbars'];

function tweakClassesFromVisualSettings() {
  const enabledClasses = Object.keys(SETTINGS.css)
    .filter((key) => {
      if (BHelper.isFirefox) {
        return !disabledOnFirefox.includes(key);
      }

      return true;
    })
    .filter(key => SETTINGS.css[key])
    .map(cl => `btd__${cl}`);

  document.querySelector('html').classList.add('btd-on');
  document.body.classList.add(...enabledClasses);

  if (SETTINGS.flash_tweets.enabled) {
    document.body.classList.add(`btd__flash-${SETTINGS.flash_tweets.mode}`);
  }

  if (SETTINGS.no_hearts) {
    document.body.classList.add('btd__stars');
  }

  if (SETTINGS.old_replies) {
    document.body.classList.add('btd__old_replies');
  }

  if (SETTINGS.custom_columns_width.enabled) {
    document.body.classList.add('btd__custom_column_size');

    const styleTag = document.createElement('style');
    const safeValue = SETTINGS.custom_columns_width.size.replace(/;\{\}/g, '');

    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(`
      .column {
        width: ${safeValue} !important;
      }
    `));
    document.head.appendChild(styleTag);
  }
}

function hideURLVisually(url, node) {
  if (!url) {
    return;
  }

  const anchors = $(`p > a[href="${url.expanded_url}"]`, node);

  if (!anchors) {
    return;
  }

  anchors.forEach((a) => {
    const lastNode = [...a.parentNode.childNodes].pop();

    if (lastNode !== a) {
      return;
    }

    a.classList.add('btd-isvishidden');
  });
}

/**
 * Adds a media preview on a node (tweet) from an url
 * @param  {String} url         The url of the media
 * @param  {DOMElement} node    The node containing the said url
 * @param  {String} mediaSize   Size of the thumbnail
 * @return {Promise}
 */
function thumbnailFromSingleURL(url, node, mediaSize) {
  if (mediaSize === 'off') {
    return Promise.resolve('No need for thumbnails');
  }

  const anchors = $(`a[href="${url.expanded_url}"]`, node);

  if (!anchors) {
    return Promise.resolve('No anchors found');
  }

  const anchor = anchors[0];

  if (anchor.getAttribute('data-url-scanned') === 'true' || $('.js-media', node)) {
    return Promise.resolve('Media preview already added');
  }

  anchor.setAttribute('data-url-scanned', 'true');

  Thumbnails.thumbnailFor(url.expanded_url).then((data) => {
    /**
     * Prematurely stops the process if one of the two is met:
     * - no data
     * - the content is a video and Embed.ly didn't find any thumbnail
     */
    if (!data || (data.type === 'video' && !data.thumbnail_url)) {
      return;
    }

    if (SETTINGS.css.hide_url_thumb) {
      hideURLVisually(url, node);
    }

    const tbUrl = data.thumbnail_url;
    const origUrl = data.url;

    const type = data.html ? 'video' : 'image';
    const embed = data.html ? data.html : null;
    const provider = Thumbnails.validateUrl(url.expanded_url).provider;

    const html = Templates.previewTemplate({
      mediaPreviewSrc: tbUrl,
      sourceLink: url.expanded_url,
      size: mediaSize,
      type,
      provider,
    });
    const previewNode = secureDomify.parse(html);

    const modalHtml = Templates.modalTemplate({
      imageUrl: origUrl,
      originalUrl: url.expanded_url,
      type,
      videoEmbed: embed,
      provider,
    });

    if (mediaSize === 'large') {
      const insertNode = $('.js-tweet.tweet-detail', node) ? $('.js-tweet-text', node) : $('.js-tweet.tweet', node);
      insertNode[0].insertAdjacentElement('afterend', previewNode);
    } else {
      $('.tweet-body p, .tweet-text', node)[0].insertAdjacentElement('afterend', previewNode);
    }

    $('.js-media-image-link', node)[0].addEventListener('click', (e) => {
      e.preventDefault();

      const tweetKey = node.getAttribute('data-key');
      const colKey = node.closest('[data-column]').getAttribute('data-column');

      sendEvent('getOpenModalTweetHTML', { tweetKey, colKey, modalHtml });
    });
  });

  return Promise.resolve();
}

// Will call thumbnailFromSingleURL on a given set of urls + node + media size
function thumbnailsFromURLs(urls, node, mediaSize) {
  return Promise.resolve(urls).then(PromiseEach((url) => {
    // If the url is in fact an entity object from TweetDeck OR is not supported then we don't process it
    if (url.type || url.sizes || !Thumbnails.validateUrl(url.expanded_url).matches) {
      return false;
    }

    return thumbnailFromSingleURL(url, node, mediaSize);
  }));
}

function addStickerToMessage(stickerObject, node) {
  const url = stickerObject.images.size_1x.url;
  const id = stickerObject.id;
  const imgElement = document.createElement('img');
  imgElement.src = url;
  imgElement.className = 'btd-sticker-message';
  imgElement.style = 'max-width: 72px;';

  if ($('.btd-sticker-message', node)) {
    return;
  }

  const link = $(`[href$="${id}"]`, node);

  if (link) {
    link[0].classList.add('btd-isvishidden');
  }

  $('.tweet-body p, .tweet-text', node)[0].insertAdjacentElement('afterend', imgElement);
}

/**
 * This is the main stuff, function called on every tweet
 */
function tweetHandler(tweet, columnKey, parent) {
  const hasParent = Boolean(parent);

  if (!tweet) {
    return;
  }

  if (!hasParent) {
    if (!$(`.js-column[data-column="${columnKey}"]`)) {
      Log(tweet, columnKey);
    }
    parent = $(`.js-column[data-column="${columnKey}"]`)[0];
  }

  let nodes;

  if (!hasParent) {
    nodes = $(`.stream-item[data-key="${tweet.id}"]`, parent);
  } else {
    nodes = $(`[data-key="${tweet.id}"]`, parent);
  }

  // If the tweet is actually a message in the DM column
  if (tweet.messageThreadId) {
    nodes = $(`.stream-item[data-key="${tweet.messageThreadId}"]`, parent);
  }

  if (tweet.sender) {
    nodes = $(`.stream-item[data-key="${tweet.id}"]`, parent);
  }

  const mediaSize = COLUMNS_MEDIA_SIZES.get(columnKey);

  if (!nodes) {
    nodes = [];
    Log('failed to get node for', tweet);
  }

  nodes.forEach((node) => {
    if (tweet.retweetedStatus) {
      node.classList.add('btd-is-retweet');
    }

    // Timestamps:
    // $('time > *', node).forEach((el) => timestampOnElement(el, tweet.created));
    if ($('time > *', node)) {
      const t = tweet.retweet ? tweet.retweet.created : tweet.created;
      $('time > *', node).forEach(el => timestampOnElement(el, t));
    }

    const type = tweet.action || tweet.chirpType;

    /**
     * Adding Verified badge if needed
     */
    if (SETTINGS.css.show_verified) {
      let userToVerify;
      const classesToAdd = ['btd-is-from-verified'];

      switch (type) {
        case 'retweet':
        case 'retweeted_retweet':
        case 'favorite':
          if ($('.has-source-avatar', node)) {
            userToVerify = tweet.sourceUser;
            classesToAdd.push('btd-is-from-verified-mini');
          } else {
            userToVerify = tweet.targetTweet.user;
          }

          break;

        case 'mention':
        case 'quoted_tweet':
          userToVerify = tweet.sourceUser;
          break;

        case 'list_member_added':
          userToVerify = tweet.owner;
          classesToAdd.push('btd-is-from-verified-mini');
          break;

        case 'message_thread':
          if (tweet.participants.length > 1) {
            break;
          }

          userToVerify = tweet.participants[0];
          break;

        case 'tweet':
          userToVerify = tweet.retweetedStatus ? tweet.retweetedStatus.user : tweet.user;
          break;

        default:
          break;
      }

      if (userToVerify && userToVerify.isVerified) {
        const el = node;

        if (el) {
          el.classList.add(...classesToAdd);
        }
      }
    }

    const profilePicture = $('.tweet-avatar[src$=".gif"]', node) && $('.tweet-avatar[src$=".gif"]', node)[0];

    if (profilePicture && SETTINGS.no_gif_pp) {
      profilePicture.src = Thumbnails.getSafeURL(profilePicture.src);
    }

    let chirpURLs = [];

    // Urls:
    // If it got entities, it's a tweet
    if (tweet.entities) {
      chirpURLs = [...tweet.entities.urls, ...tweet.entities.media];
    } else if (tweet.targetTweet && tweet.targetTweet.entities) {
      // If it got targetTweet it's an activity on a tweet
      chirpURLs = [...tweet.targetTweet.entities.urls, ...tweet.targetTweet.entities.media];
    } else if (tweet.retweet && tweet.retweet.entities) {
      chirpURLs = [...tweet.retweet.entities.urls, ...tweet.retweet.entities.media];
    } else if (tweet.retweetedStatus && tweet.retweetedStatus.entities) {
      chirpURLs = [...tweet.retweetedStatus.entities.urls, ...tweet.retweetedStatus.entities.media];
    }

    setTimeout(() => {
      if (tweet.attachment && tweet.attachment.sticker) {
        addStickerToMessage(tweet.attachment.sticker, node);
      }
    }, 0);

    const mediaURLs = chirpURLs.filter(url => url.type || url.display_url.startsWith('youtube.com/watch?v=') || url.display_url.startsWith('vine.co/v/'));

    if (chirpURLs.length > 0) {
      const urlForThumbnail = chirpURLs.filter(url => !url.id).pop();

      if (mediaURLs.length > 0 && SETTINGS.css.hide_url_thumb && mediaSize !== 'off') {
        hideURLVisually(mediaURLs.pop(), node);
      }

      // Maybe we could have a gallery or something when we have different URLs
      // We pass a single URL even though the code is ready to handle multiples URLs
      if (urlForThumbnail && node.closest('[data-column]')) {
        thumbnailsFromURLs([urlForThumbnail], node, mediaSize);
      }
    }
  });
}

function closeOpenModal() {
  $('#open-modal')[0].style.display = 'none';
  if ($('#open-modal')[0].firstElementChild) {
    $('#open-modal')[0].firstElementChild.remove();
  }
}

function setMaxDimensionsOnElement(el) {
  const rect = $('#open-modal [btd-custom-modal] .js-embeditem')[0].getBoundingClientRect();
  const src = el.src;

  if (src.includes('gfycat.') || src.includes('imgur.') || src.includes('bandcamp.')) {
    return;
  }

  el.setAttribute('style', `max-width: ${rect.width}px; max-height: ${rect.height}px`);
}

function setMaxDimensionsOnModalImg() {
  if ($('#open-modal [btd-custom-modal]') && $('#open-modal [btd-custom-modal]').length) {
    const loadableEls = $('#open-modal [btd-custom-modal] .js-embeditem [data-btdsetmax], #open-modal [btd-custom-modal] .js-embeditem iframe, #open-modal [btd-custom-modal] .js-embeditem video');

    if (!loadableEls) {
      return;
    }

    const loadable = loadableEls[0];
    loadable.addEventListener('load', ev => setMaxDimensionsOnElement(ev.target));
    loadable.addEventListener('loadstart', ev => setMaxDimensionsOnElement(ev.target));

    if (loadable.hasAttribute('data-btd-loaded') || loadable.readyState === 4) {
      setMaxDimensionsOnElement(loadable);
    }
  }
}

window.addEventListener('resize', setMaxDimensionsOnModalImg);

// Prepare to know when TD is ready
onEvent('BTDC_ready', () => {
  tweakClassesFromVisualSettings();
  // Refresh timestamps once and then set the interval
  refreshTimestamps();
  setInterval(refreshTimestamps, TIMESTAMP_INTERVAL);
  Emojis();

  const settingsURL = BHelper.getExtensionUrl('options/options.html');
  const settingsBtn = `
    <a class="btd-settings-btn js-header-action link-clean cf app-nav-link padding-h--10 with-nav-border-t" data-title="BTD Settings">
      <div class="obj-left margin-l--2">
        <i class="icon icon-sliders icon-medium"></i>
      </div>
      <div class="nbfc padding-ts hide-condensed txt-size--16">BTD Settings</div>
    </a>
  `;
  const settingsBtnNode = secureDomify.parse(settingsBtn);
  $('nav.app-navigator')[0].insertAdjacentElement('afterbegin', settingsBtnNode);
  $('.btd-settings-btn')[0].addEventListener('click', (e) => {
    e.preventDefault();
    window.open(settingsURL);
  });

  onMessage((details) => {
    switch (details.action) {
      case 'progress_gif':
        updateGifProgress($('[data-btd-dl-gif]')[0], details.progress);
        break;
      default:
        document.dispatchEvent(new CustomEvent('uiComposeTweet'));
        $('textarea.js-compose-text')[0].value = `${details.text} ${details.url}`;
        $('textarea.js-compose-text')[0].dispatchEvent(new Event('change'));
        break;
    }
  });

  if (SETTINGS.need_update_banner) {
    sendMessage({ action: 'displayed_update_banner' });
    setTimeout(() => {
      sendEvent('showTDBanner', {
        banner: {
          bg: '#3daafb',
          fg: '#07214c',
          action: 'trigger-event',
          event: {
            type: 'openBtdSettings',
            data: {
              url: BHelper.getExtensionUrl('options/options.html?on=update'),
            },
          },
          text: `Better TweetDeck has been updated to ${BHelper.getVersion()}!`,
          label: 'See the changes',
        },
      });
    }, 1000);
  }

  // Tell any potential versions of BTD that they are not alone, and alert the user if they respond.
  const browser = BHelper.getBrowser();
  if (browser) {
    const extensions = config.Client.extension_ids[browser];
    Object.values(extensions || {}).forEach((extensionID) => {
      chrome.runtime.sendMessage(
        extensionID, { action: 'version', key: BHelper.getVersion() }, {},
        (response) => {
          if (response) {
            if (response.action === 'badVersion' && response.key) {
              sendEvent('showTDBanner', {
                banner: {
                  bg: '#fba214',
                  fg: '#4c3500',
                  action: 'trigger-event',
                  // TODO: is there a universal way to open the extension management dialog?
                  // there's `chrome://extensions/?id=${extensionID}` but i get nothing anywhere else
                  event: {
                    type: 'openBtdSettings',
                    data: {
                      url: 'https://youtu.be/CRMcSAgoabw',
                    },
                  },
                  text: 'A different version of Better TweetDeck has been detected. Please disable all other versions!',
                  label: 'Oooo yeah, caaan doo!',
                },
              });
            }
          }
        },
      );
    });
  }
});

onEvent('BTDC_showed_follow_banner', () => {
  sendMessage({ action: 'displayed_follow_banner' });
});

onEvent('BTDC_gotChirpForColumn', (ev, data) => {
  const { chirp, colKey } = data;

  tweetHandler(chirp, colKey);
});

onEvent('BTDC_gotChirpInMediaModal', (ev, data) => {
  const { chirp } = data;

  tweetHandler(chirp, null, $('.js-mediatable')[0]);
});

onEvent('BTDC_gotMediaGalleryChirpHTML', (ev, data) => {
  const {
    markup,
    modalHtml,
    chirp,
    colKey,
  } = data;

  const openModal = $('#open-modal')[0];
  const tweetMarkupString = modalHtml.replace('<div class="js-med-tweet med-tweet"></div>', `<div class="js-med-tweet med-tweet">${markup}</div>`);
  const tweetNode = secureDomify.parse(tweetMarkupString);

  closeOpenModal();

  openModal.appendChild(tweetNode);
  openModal.style.display = 'block';
  openModal.querySelector('img, iframe').onload = e => e.target.setAttribute('data-btd-loaded', 'true');

  if ($('[data-instgrm-version]', openModal)) {
    sendEvent('renderInstagramEmbed');
  }

  if ($('[rel="favorite"]', openModal)) {
    $('[rel="favorite"]', openModal)[0].addEventListener('click', () => {
      sendEvent('likeChirp', {
        chirpKey: chirp.id,
        colKey,
      });
    });
  }

  if ($('[rel="retweet"]', openModal)) {
    $('[rel="retweet"]', openModal)[0].addEventListener('click', () => {
      sendEvent('retweetChirp', {
        chirpKey: chirp.id,
        colKey,
      });
    });
  }

  if ($('[rel="reply"]', openModal)) {
    $('[rel="reply"]', openModal)[0].addEventListener('click', () => {
      setTimeout(() => {
        $(`[data-column="${colKey}"] [data-key="${chirp.id}"] [rel="reply"]`)[0].click();
        closeOpenModal();
      }, 0);
    });
  }

  $('#open-modal a[rel="dismiss"]')[0].addEventListener('click', closeOpenModal);

  $('[rel="actionsMenu"]', openModal)[0].addEventListener('click', () => {
    setTimeout(() => {
      $(`[data-column="${colKey}"] [data-key="${chirp.id}"] [rel="actionsMenu"]`)[0].click();
    }, 0);
    setTimeout(() => {
      const originalMenu = document.querySelector(`[data-column="${colKey}"] [data-key="${chirp.id}"] .dropdown-menu`);
      originalMenu.classList.add('pos-t');
      $('[rel="actionsMenu"]', openModal)[0].insertAdjacentElement('afterEnd', originalMenu);
      $('#open-modal .dropdown-menu').forEach(el => el.addEventListener('click', closeOpenModal));
    }, 0);
  });

  if ($('[data-btd-dl-gif]', openModal)) {
    const videoEl = $('video', openModal)[0];

    $('[data-btd-dl-gif]', openModal)[0].addEventListener('click', (e) => {
      e.preventDefault();
      e.target.style.opacity = 0.8;

      const gifshotOptions = {
        gifWidth: videoEl.getAttribute('data-btd-width'),
        gifHeight: videoEl.getAttribute('data-btd-height'),
        video: [videoEl.getAttribute('src')],
        name: videoEl.getAttribute('data-btd-name'),
        numFrames: Math.floor(videoEl.duration / 0.1),
        interval: 0.1,
        sampleInterval: 10,
      };


      const gifshotCb = (obj) => {
        if (obj.error) {
          return;
        }

        saveGif(obj, gifshotOptions.name, e, videoEl);
      };

      // Firefox doesn't support Web Workers from content scripts so we have to run it in the background
      // ...
      // ...
      // Yes, it's hacky but we have no choice ¯\(ツ)/¯
      if (BHelper.isFirefox) {
        e.target.innerText = 'Converting to GIF... (in progress)';
        return sendMessage({
          action: 'download_gif',
          options: gifshotOptions,
        }, response => gifshotCb(response.obj));
      }

      return gifshot.createGIF(Object.assign(gifshotOptions, {
        progressCallback: progress => updateGifProgress(e.target, progress),
      }), gifshotCb);
    });
  }
});

onEvent('BTDC_columnMediaSizeUpdated', (ev, data) => {
  const { id, size } = data;

  COLUMNS_MEDIA_SIZES.set(id, size);
});

onEvent('BTDC_columnsChanged', (ev, data) => {
  const colsArray = data;

  if (COLUMNS_MEDIA_SIZES.size !== colsArray.length) {
    COLUMNS_MEDIA_SIZES.clear();
  }

  colsArray.filter(col => col.id)
    .forEach((col) => {
      COLUMNS_MEDIA_SIZES.set(col.id, col.mediaSize || 'medium');
    });
});

onEvent('BTDC_clickedOnGif', (ev, data) => {
  const { tweetKey, colKey, video } = data;

  const modalHtml = Templates.modalTemplate({
    imageUrl: '',
    originalUrl: '',
    type: 'video',
    videoEmbed: `
      <video autoplay loop src="${video.src}" data-btd-name="${video.name}" data-btd-height="${video.height}" data-btd-width="${video.width}">
        <source video-src="${video.src}" type="video/mp4" src="${video.src}">
      </video>
    `,
    hasGIFDownload: true,
    provider: 'gif',
  });

  sendEvent('getOpenModalTweetHTML', { tweetKey, colKey, modalHtml });
});

window.addEventListener('message', (ev) => {
  let data;

  try {
    data = ev.data && JSON.parse(ev.data);
  } catch (e) {
    // lolnope
  }

  if (data) {
    switch (data.message) {
      case 'resize_imgur':
        $(`iframe[src="${data.href}"]`)[0].style.height = `${data.height}px`;
        break;

      default:
        break;
    }
  }
});
