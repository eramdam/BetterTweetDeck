import config from 'config';
import { flatten } from 'lodash';

let SETTINGS;

TD.mustaches['status/tweet_single.mustache'] = TD.mustaches['status/tweet_single.mustache'].replace('{{>status/tweet_single_footer}} </div> </div>', '{{>status/tweet_single_footer}} </div> <i class="sprite tweet-dogear"></i></div>');
TD.mustaches['status/tweet_detail.mustache'] = TD.mustaches['status/tweet_detail.mustache'].replace('</footer> {{/getMainTweet}}', '</footer> {{/getMainTweet}} <i class="sprite tweet-dogear"></i>');

const getChirpFromKey = (key, colKey) => {
  const column = TD.controller.columnManager.get(colKey);

  if (!column) {
    return null;
  }

  const chirpsArray = [];
  Object.keys(column.updateIndex).forEach(updateKey => {
    const c = column.updateIndex[updateKey];
    if (c) {
      chirpsArray.push(c);
    }

    if (c && c.retweetedStatus) {
      chirpsArray.push(c.retweetedStatus);
    }

    if (c && c.quotedTweet) {
      chirpsArray.push(c.quotedTweet);
    }

    if (c && c.messages) {
      chirpsArray.push(...c.messages);
    }
  });

  if (column.detailViewComponent) {
    if (column.detailViewComponent.repliesTo && column.detailViewComponent.repliesTo.repliesTo) {
      chirpsArray.push(...column.detailViewComponent.repliesTo.repliesTo);
    }

    if (column.detailViewComponent.replies && column.detailViewComponent.replies.replies) {
      chirpsArray.push(...column.detailViewComponent.replies.replies);
    }
  }

  const chirp = chirpsArray.find(c => c.id === String(key));

  if (!chirp) {
    console.error(`did not find chirp ${key} within ${colKey}`);
    return null;
  }

  return chirp;
};

if (config.get('Client.debug')) {
  /**
   * Takes a node and fetches the chirp associated with it (useful for debugging)
   */
  window._BTDinspectChirp = (element) => {
    if (!element.closest('[data-key]') || !element.closest('[data-column]')) {
      throw new Error('Not a chirp');
    }

    const colKey = element.closest('[data-column]').getAttribute('data-column');
    const chirpKey = element.closest('[data-key]').getAttribute('data-key');

    return getChirpFromKey(chirpKey, colKey);
  };

  window._BTDGetChirp = getChirpFromKey;
}

/**
 * Send messages to the content window with BTDC_ prefix
 */
const proxyEvent = (name, detail = {}) => {
  name = `BTDC_${name}`;
  let cache = [];
  detail = JSON.stringify(detail, (key, val) => {
    if (typeof val === 'object' && val !== null) {
      if (cache.indexOf(val) !== -1 && !val.screenName) {
        return null;
      }
      cache.push(val);
    }

    return val;
  });
  cache = null;
  window.postMessage({ name, detail }, 'https://tweetdeck.twitter.com');
};

const decorateChirp = (chirp) => {
  if (!chirp) {
    return undefined;
  }

  chirp.chirpType = chirp.chirpType;
  chirp.action = chirp.action;
  return chirp;
};

const postMessagesListeners = {
  BTDC_getOpenModalTweetHTML: (ev, data) => {
    const { tweetKey, colKey, modalHtml } = data;

    const chirp = getChirpFromKey(tweetKey, colKey);

    if (!chirp) {
      return;
    }

    let markup;

    if (chirp.renderInMediaGallery) {
      markup = chirp.renderInMediaGallery();
    } else if (chirp.targetTweet) {
      markup = chirp.targetTweet.renderInMediaGallery();
    }

    proxyEvent('gotMediaGalleryChirpHTML', { markup, chirp: decorateChirp(chirp), modalHtml, colKey });
  },
  BTDC_getChirpFromColumn: (ev, data) => {
    const { chirpKey, colKey } = data;
    const chirp = getChirpFromKey(chirpKey, colKey);

    if (!chirp) {
      return;
    }

    proxyEvent('gotChirpForColumn', { chirp: decorateChirp(chirp), colKey });
  },
  BTDC_likeChirp: (ev, data) => {
    const { chirpKey, colKey } = data;
    const chirp = getChirpFromKey(chirpKey, colKey);

    if (!chirp) {
      return;
    }

    chirp.favorite();
  },
  BTDC_retweetChirp: (ev, data) => {
    const { chirpKey, colKey } = data;
    const chirp = getChirpFromKey(chirpKey, colKey);

    if (!chirp) {
      return;
    }

    chirp.retweet();
  },
  BTDC_settingsReady: (ev, data) => {
    const { settings } = data;
    SETTINGS = settings;

    const tasks = TD.controller.scheduler._tasks;
    // We delete the callback for the timestamp task so the content script can do it itself
    if (settings.ts !== 'relative') {
      Object.keys(tasks).forEach((key) => {
        if (tasks[key].period === 30000) {
          tasks[key].callback = () => false;
        }
      });
    }
  },
};

window.addEventListener('message', (ev) => {
  if (ev.origin.indexOf('tweetdeck.') === -1) {
    return false;
  }

  if (!ev.data.name || !ev.data.name.startsWith('BTDC_') || !postMessagesListeners[ev.data.name]) {
    return false;
  }

  return postMessagesListeners[ev.data.name](ev, ev.data.detail);
});

const switchThemeClass = () => {
  document.body.dataset.btdtheme = TD.settings.getTheme();
};

const handleInsertedNode = (ev) => {
  const target = ev.target;
  // If the target of the event contains mediatable then we are inside the media modal
  if (target.classList && target.classList.contains('js-mediatable')) {
    const chirpKey = target.querySelector('[data-key]').getAttribute('data-key');
    const chirpKeyEl = document.querySelector(`[data-column] [data-key="${chirpKey}"]`);
    const colKey = chirpKeyEl && chirpKeyEl.closest('[data-column]').getAttribute('data-column');

    if (!colKey) {
      return;
    }

    const chirp = getChirpFromKey(chirpKey, colKey);

    if (!chirp) {
      return;
    }

    proxyEvent('gotChirpInMediaModal', { chirp: decorateChirp(chirp) });
    return;
  }

  if (!target.hasAttribute || !target.hasAttribute('data-key')) {
    return;
  }

  const chirpKey = target.getAttribute('data-key');
  const colKey = target.closest('.js-column').getAttribute('data-column');

  const chirp = getChirpFromKey(chirpKey, colKey);

  if (!chirp) {
    return;
  }

  if (chirp._hasAnimatedGif) {
    const videoEl = $(`[data-key="${chirp.entities.media[0].id}"] video`)[0];

    if (videoEl && videoEl.paused) {
      return;
    }

    if (SETTINGS.stop_gifs) {
      setTimeout(() => {
        $(`[data-key="${chirp.entities.media[0].id}"] [rel="pause"]`)[0].click();
      });
    }
  }

  proxyEvent('gotChirpForColumn', { chirp: decorateChirp(chirp), colKey });
};

document.addEventListener('DOMNodeInserted', handleInsertedNode);

$(document).on('uiVisibleChirps', (ev, data) => {
  const { chirpsData, columnKey } = data;
  const isThereGifs = chirpsData.filter(chirp => {
    const hasGif = chirp.chirp && chirp.chirp._hasAnimatedGif;
    const el = chirp.$elem[0];
    const isPaused = el.querySelector('video') && !el.querySelector('video').paused;

    return hasGif && isPaused;
  }).length > 0;

  if (isThereGifs && SETTINGS.stop_gifs) {
    chirpsData.filter(chirp => chirp.chirp._hasAnimatedGif).forEach(c => {
      const videoEl = $(`[data-column="${columnKey}"] [data-key="${c.id}"] video`)[0];

      if (videoEl && videoEl.paused) {
        return;
      }

      setTimeout(() => {
        $(`[data-column="${columnKey}"] [data-key="${c.id}"] [rel="pause"]`)[0].click();
      });
    });
  }
});

// TD Events
$(document).on('dataColumns', (ev, data) => {
  const cols = data.columns.filter(col => col.model.state.settings).map((col) => ({
    id: col.model.privateState.key,
    mediaSize: col.model.state.settings.media_preview_size,
  }));

  proxyEvent('columnsChanged', cols);
});

$(document).on('uiToggleTheme', switchThemeClass);

// Will ensure we keep the media preview size value even when the user changes it
$(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
  const id = ev.target.closest('.js-column').getAttribute('data-column');

  proxyEvent('columnMediaSizeUpdated', { id, size: data.value });
});

// We wait for the loading of the columns and we get all the media preview size
$(document).one('dataColumnsLoaded', () => {
  proxyEvent('ready');

  $('.js-column').each((i, el) => {
    let size = TD.storage.columnController.get($(el).data('column')).getMediaPreviewSize();

    if (!size) {
      size = 'medium';
    }

    $(el).attr('data-media-size', size);
  });

  switchThemeClass();
});

const closeCustomModal = () => {
  $('#open-modal').css('display', 'none');
  $('#open-modal').empty();
};

$(document).keydown((ev) => {
  if ($('#open-modal [btd-custom-modal]').length && ev.keyCode === 27) {
    closeCustomModal();
    return;
  }
});

document.addEventListener('paste', ev => {
  if (ev.clipboardData) {
    const items = ev.clipboardData.items;

    if (!items) {
      return;
    }

    const files = [];

    [...items].forEach(item => {
      if (item.type.indexOf('image') < 0) {
        return;
      }
      const blob = item.getAsFile();

      files.push(blob);
    });

    if (files.length === 0) {
      return;
    }

    $(document).trigger('uiFilesAdded', {
      files,
    });
  }
});

const handleGifClick = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  const chirpKey = ev.target.closest('[data-key]').getAttribute('data-key');
  const colKey = ev.target.closest('.js-column').getAttribute('data-column');
  const video = {
    src: ev.target.src,
  };

  const chirp = getChirpFromKey(chirpKey, colKey);

  if (!chirp) {
    return;
  }

  video.height = chirp.entities.media[0].sizes.large.h;
  video.width = chirp.entities.media[0].sizes.large.w;
  video.name = `${chirp.user.screenName}-${video.src.split('/').pop().replace('.mp4', '')}`;

  proxyEvent('clickedOnGif', { tweetKey: chirpKey, colKey, video });
};

$('body').on('click', 'article video.js-media-gif', handleGifClick);

$('body').on('click', '#open-modal', (ev) => {
  const isMediaModal = document.querySelector('.js-modal-panel .js-media-preview-container, .js-modal-panel iframe');

  if (!SETTINGS.css.no_bg_modal ||
  !isMediaModal) {
    return;
  }

  if (!ev.target.closest('.med-tray')
   && !ev.target.closest('.mdl-btn-media') && $('a[rel="dismiss"]')[0]
   && !ev.target.closest('.med-tweet')) {
    ev.preventDefault();
    ev.stopPropagation();

    if ($('#open-modal [btd-custom-modal]').length) {
      closeCustomModal();
      return;
    }

    $('a[rel="dismiss"]').click();
    return;
  }
});
