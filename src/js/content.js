import each from 'promise-each';
import timestampOnElement from './util/timestamp';
import { send as sendMessage, on as onMessage } from './util/messaging';
import * as Thumbnails from './util/thumbnails';
import * as Templates from './util/templates';
import * as Usernames from './util/usernames';
import * as Emojis from './util/emojis';
import * as Log from './util/logger.js';

import { $, TIMESTAMP_INTERVAL, on, sendEvent } from './util/util';

let settings;

/**
 * This will contain the sizes of each column
 * Ensuring a much faster way to retrieve/update them than querying the DOM
 */
const COLUMNS_MEDIA_SIZES = new Map();

/**
 * Injecting inject.js in head before doing anything else
 */
const scriptEl = document.createElement('script');
scriptEl.src = chrome.extension.getURL('js/inject.js');
document.head.appendChild(scriptEl);

sendMessage({ action: 'get_settings' }, (response) => {
  settings = response.settings;
});


/**
 * Since this function wil be called every ~3sec we have to check if we actually
 * have timestamps to change before anything else
 */
function refreshTimestamps() {
  if (!$('.js-timestamp')) {
    return;
  }

  $('.js-timestamp').forEach((jsTimstp) => {
    const d = jsTimstp.getAttribute('data-time');
    $('a, span', jsTimstp).forEach((el) => timestampOnElement(el, d));
  });
}

/**
 * This function will simply take settings in `css` field
 * and then add/remove classes on the body
 */
function tweakClassesFromVisualSettings() {
  const enabledClasses = Object.keys(settings.css)
                        .filter((key) => settings.css[key])
                        .map((cl) => `btd__${cl}`);

  document.body.classList.add(...enabledClasses);

  if (settings.flash_tweets.enabled) {
    document.body.classList.add(`btd__flash-${settings.flash_tweets.mode}`);
  }

  if (settings.no_hearts) {
    document.body.classList.remove('hearty');
  }
}


function expandURL(url, node) {
  const anchors = $(`a[href="${url.url}"]`, node);

  if (!anchors) {
    return;
  }

  anchors.forEach((anchor) => anchor.setAttribute('href', url.expanded_url));
}

function hideURLVisually(url, node) {
  if (!url) {
    return;
  }

  const anchors = $(`p > a[href="${url.expanded_url}"]`, node);

  if (!anchors) {
    return;
  }

  anchors.forEach(a => {
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

    if (settings.css.hide_url_thumb) {
      hideURLVisually(url, node);
    }

    const tbUrl = data.thumbnail_url;
    const origUrl = data.url;

    const type = data.html ? 'video' : 'image';
    const embed = data.html ? data.html : null;
    const provider = Thumbnails.validateUrl(url.expanded_url).provider;

    const html = Templates.previewTemplate(tbUrl, url.expanded_url, mediaSize, type);
    const modalHtml = Templates.modalTemplate({ imageUrl: origUrl, originalUrl: url.expanded_url, type, videoEmbed: embed, provider });

    if (mediaSize === 'large') {
      $('.tweet.js-tweet', node)[0].insertAdjacentHTML('afterend', html);
    } else {
      $('.tweet-body p, .tweet-text', node)[0].insertAdjacentHTML('afterend', html);
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
  return Promise.resolve(urls).then(each((url) => {
    // If the url is in fact an entity object from TweetDeck OR is not supported then we don't process it
    if (url.type || url.sizes || !Thumbnails.validateUrl(url.expanded_url).matches) {
      return false;
    }

    return thumbnailFromSingleURL(url, node, mediaSize);
  }));
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
      Log.debug(tweet, columnKey);
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
    Log.debug('failed to get node for', tweet);
  }

  nodes.forEach((node) => {
    let urlsToChange = [];

    if (tweet.retweetedStatus) {
      node.classList.add('btd-is-retweet');
    }

    // Timestamps:
    // $('time > *', node).forEach((el) => timestampOnElement(el, tweet.created));
    if ($('time > *', node)) {
      const t = tweet.retweet ? tweet.retweet.created : tweet.created;
      $('time > *', node).forEach((el) => timestampOnElement(el, t));
    }

    const type = tweet.action || tweet.chirpType;

    /**
     * Usernames formatting
     */
    switch (type) {
      case 'retweeted_retweet':
      case 'retweet':
      case 'favorite':
      case 'favorited_retweet':
        Usernames.format({ node, user: tweet.sourceUser, fSel: '.activity-header .nbfc .account-link.txt-bold' });
        Usernames.format({ node, user: tweet.targetTweet.user, fSel: '.tweet-header .nbfc .fullname', uSel: '.tweet-header .nbfc .username' });
        break;

      case 'mention':
        Usernames.format({ node, user: tweet.sourceUser, fSel: '.tweet-header .nbfc .fullname', uSel: '.tweet-header .nbfc .username' });
        break;

      case 'quoted_tweet':
        Usernames.format({ node, user: tweet.sourceUser, fSel: '.js-tweet > .tweet-header .nbfc .fullname', uSel: '.js-tweet > .tweet-header .nbfc .username' });
        Usernames.format({ node, user: tweet.targetUser, fSel: '.quoted-tweet .tweet-header .nbfc .fullname', uSel: '.quoted-tweet .tweet-header .nbfc .username' });
        break;

      case 'follow':
        Usernames.format({ node, user: tweet.following, fSel: '.activity-header .account-link' });
        break;

      case 'list_member_added':
        Usernames.format({ node, user: tweet.owner, fSel: '.nbfc .account-link' });
        break;

      case 'tweet':
        if (tweet.retweetedStatus) {
          Usernames.format({ node, user: tweet.user, fSel: '.tweet-context .nbfc [rel=user]' });
          Usernames.format({ node, user: tweet.retweetedStatus.user, fSel: '.tweet-header .nbfc .fullname', uSel: '.tweet-header .nbfc .username' });
        } else {
          Usernames.format({ node, user: tweet.user, fSel: '.tweet-header .nbfc .fullname', uSel: '.tweet-header .nbfc .username' });
        }

        if (tweet.quotedTweet) {
          Usernames.format({ node, user: tweet.quotedTweet.user, fSel: '.quoted-tweet .tweet-header .fullname', uSel: '.quoted-tweet .tweet-header .username' });
        }
        break;

      case 'message':
        Usernames.format({ node, user: tweet.sender, fSel: '.tweet-header .nbfc .fullname', uSel: '.tweet-header .nbfc .username' });
        break;

      case 'message_thread':
        if (tweet.type === 'ONE_TO_ONE') {
          Usernames.format({ node, user: tweet.participants[0], fSel: '.link-complex b', uSel: '.username' });
        } else if (tweet.type === 'GROUP_DM') {
          Usernames.formatGroupDM({ node, participants: tweet.participants, fSel: '.tweet-header .account-link > b' });
        }
        break;

      default:
        break;
    }

    /**
     * Adding Verified badge if needed
     */
    if (settings.css.show_verified) {
      let userToVerify;
      let avatarSelector;
      const classesToAdd = ['btd-is-verified'];

      switch (type) {
        case 'retweet':
        case 'retweeted_retweet':
        case 'favorite':
          userToVerify = tweet.sourceUser;
          avatarSelector = '.has-source-avatar.activity-header .item-img';
          classesToAdd.push('btd-is-verified-mini');
          break;

        case 'mention':
        case 'quoted_tweet':
          userToVerify = tweet.sourceUser;
          avatarSelector = '.tweet-header .account-link';
          break;

        case 'list_member_added':
          userToVerify = tweet.owner;
          avatarSelector = '.obj-left.item-img';
          classesToAdd.push('btd-is-verified-mini');
          break;

        case 'message_thread':
          if (tweet.participants.length > 1) {
            break;
          }

          userToVerify = tweet.participants[0];
          avatarSelector = '.obj-left.item-img';
          break;

        case 'tweet':
          userToVerify = tweet.retweetedStatus ? tweet.retweetedStatus.user : tweet.user;
          avatarSelector = '.account-link .item-img';
          break;

        default:
          break;
      }

      if (userToVerify && userToVerify.isVerified && avatarSelector) {
        const el = $(avatarSelector, node);

        if (el && el[0]) {
          el[0].classList.add(...classesToAdd);
        }
      }
    }

    const profilePicture = $('.tweet-avatar[src$=".gif"]', node) && $('.tweet-avatar[src$=".gif"]', node)[0];

    if (profilePicture && settings.no_gif_pp) {
      profilePicture.src = Thumbnails.getSafeURL(profilePicture.src);
    }


    // Urls:
    // If it got entities, it's a tweet
    if (tweet.entities) {
      urlsToChange = [...tweet.entities.urls, ...tweet.entities.media];
    } else if (tweet.targetTweet && tweet.targetTweet.entities) {
      // If it got targetTweet it's an activity on a tweet
      urlsToChange = [...tweet.targetTweet.entities.urls, ...tweet.targetTweet.entities.media];
    } else if (tweet.retweet && tweet.retweet.entities) {
      urlsToChange = [...tweet.retweet.entities.urls, ...tweet.retweet.entities.media];
    } else if (tweet.retweetedStatus && tweet.retweetedStatus.entities) {
      urlsToChange = [...tweet.retweetedStatus.entities.urls, ...tweet.retweetedStatus.entities.media];
    }

    const mediaURLS = urlsToChange.filter(url => url.type || url.display_url.startsWith('youtube.com/watch?v=') || url.display_url.startsWith('vine.co/v/'));

    if (urlsToChange.length > 0) {
      // We expand URLs if needed
      if (settings.no_tco) {
        urlsToChange.forEach(url => expandURL(url, node));
      }

      const urlForThumbnail = urlsToChange.filter(url => !url.id).pop();
      let urlToHide;

      if (mediaURLS.length > 0) {
        urlToHide = mediaURLS.pop();
      }

      if (settings.css.hide_url_thumb && mediaSize !== 'off') {
        hideURLVisually(urlToHide, node);
      }

      if (!urlForThumbnail || !node.closest('[data-column]')) {
        return;
      }
      // We pass a single URL even though the code is ready to handle multiples URLs
      // Maybe we could have a gallery or something when we have different URLs
      thumbnailsFromURLs([urlForThumbnail], node, mediaSize);
    }

    const RTL_RE = /[\u0590-\u083F]|[\u08A0-\u08FF]|[\uFB1D-\uFDFF]|[\uFE70-\uFEFF]/mg;
    const tweetTextNode = $('.tweet-text', node) && $('.tweet-text', node)[0];

    if (tweetTextNode && settings.rtl_text_style) {
      if (tweet.htmlText && !tweet.targetTweet) {
        if (tweet.htmlText.match(RTL_RE)) {
          tweetTextNode.style.direction = 'rtl';
        }
      } else if (tweet.targetTweet) {
        if (tweet.targetTweet.htmlText.match(RTL_RE)) {
          tweetTextNode.style.direction = 'rtl';
        }
      }
    }
  });
}

function closeOpenModal() {
  $('#open-modal')[0].style.display = 'none';
  $('#open-modal')[0].innerHTML = '';
}

// Prepare to know when TD is ready
on('BTDC_ready', () => {
  tweakClassesFromVisualSettings();
  sendEvent('settingsReady', { settings });
  // Refresh timestamps once and then set the interval
  refreshTimestamps();
  setInterval(refreshTimestamps, TIMESTAMP_INTERVAL);
  Emojis.buildEmojiPicker();

  const settingsURL = chrome.extension.getURL('options/options.html');
  const settingsBtn = `
  <a class="btd-settings-btn js-header-action link-clean cf app-nav-link padding-hl" data-title="Better TweetDeck Settings"> <div class="obj-left"> <i class="icon icon-sliders icon-large"></i> </div> <div class="nbfc padding-ts hide-condensed">Better TweetDeck Settings</div> </a>
  `;
  $('nav.app-navigator')[0].insertAdjacentHTML('afterbegin', settingsBtn);
  $('.btd-settings-btn')[0].addEventListener('click', (e) => {
    e.preventDefault();
    window.open(settingsURL);
  });

  onMessage((details) => {
    document.dispatchEvent(new CustomEvent('uiComposeTweet'));
    $('textarea.js-compose-text')[0].value = `${details.text} ${details.url}`;
    $('textarea.js-compose-text')[0].dispatchEvent(new Event('change'));
  });
});

on('BTDC_gotChirpForColumn', (ev, data) => {
  const { chirp, colKey } = data;

  tweetHandler(chirp, colKey);
});

on('BTDC_gotChirpInMediaModal', (ev, data) => {
  const { chirp } = data;

  tweetHandler(chirp, null, $('.js-mediatable')[0]);
});

on('BTDC_gotMediaGalleryChirpHTML', (ev, data) => {
  const { markup, modalHtml, chirp, colKey } = data;

  const openModal = $('#open-modal')[0];
  openModal.innerHTML = modalHtml.replace('<div class="js-med-tweet med-tweet"></div>', `<div class="js-med-tweet med-tweet">${markup}</div>`);
  openModal.style.display = 'block';

  $('[rel="favorite"]', openModal)[0].addEventListener('click', () => {
    sendEvent('likeChirp', { chirpKey: chirp.id, colKey });
  });

  $('[rel="retweet"]', openModal)[0].addEventListener('click', () => {
    sendEvent('retweetChirp', { chirpKey: chirp.id, colKey });
  });

  $('[rel="reply"]', openModal)[0].addEventListener('click', () => {
    setTimeout(() => {
      $(`[data-column="${colKey}"] [data-key="${chirp.id}"] [rel="reply"]`)[0].click();
      closeOpenModal();
    }, 0);
  });

  $('#open-modal a[rel="dismiss"]')[0].addEventListener('click', closeOpenModal);

  $('[rel="actionsMenu"]', openModal)[0].addEventListener('click', () => {
    setTimeout(() => {
      $(`[data-column="${colKey}"] [data-key="${chirp.id}"] [rel="actionsMenu"]`)[0].click();
    }, 0);
    setTimeout(() => {
      const originalMenu = document.querySelector(`[data-column="${colKey}"] [data-key="${chirp.id}"] .dropdown-menu`);
      originalMenu.classList.add('pos-t');
      $('[rel="actionsMenu"]', openModal)[0].insertAdjacentElement('afterEnd', originalMenu);
      $('#open-modal .dropdown-menu').forEach((el) => el.addEventListener('click', closeOpenModal));
    }, 0);
  });
});

on('BTDC_columnMediaSizeUpdated', (ev, data) => {
  const { id, size } = data;

  COLUMNS_MEDIA_SIZES.set(id, size);
});

on('BTDC_columnsChanged', (ev, data) => {
  const colsArray = data;

  if (COLUMNS_MEDIA_SIZES.size !== colsArray.length) {
    COLUMNS_MEDIA_SIZES.clear();
  }

  colsArray.filter(col => col.id)
           .forEach(col => {
             COLUMNS_MEDIA_SIZES.set(col.id, col.mediaSize || 'medium');
           });
});
