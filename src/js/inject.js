import config from 'config';
import Log from './util/logger';
import UsernamesTemplates from './util/username_templates';

let SETTINGS;

const deciderOverride = {
  simplified_replies: false,
};

const getChirpFromKey = (key, colKey) => {
  const column = TD.controller.columnManager.get(colKey);

  if (!column) {
    return null;
  }

  const chirpsArray = [];
  Object.keys(column.updateIndex).forEach((updateKey) => {
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

    if (c && c.targetTweet) {
      chirpsArray.push(c.targetTweet);
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
    Log(`did not find chirp ${key} within ${colKey}`);
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

  window._BTDFindMustache = content => Object.keys(TD.mustaches).filter(i => TD.mustaches[i].toLowerCase().includes(content.toLowerCase()));
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

let bannerID = 1;

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
  BTDC_renderInstagramEmbed: () => {
    instgrm.Embeds.process();
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

    if (settings.old_replies) {
      TD.config.decider_overlay = deciderOverride;

      TD.decider.updateForGuestId();
    }

    TD.old_mustaches = Object.assign({}, TD.mustaches);


    TD.globalRenderOptions.btd = {
      // Use with
      // <div class="bg-r-white txt-seamful-black">
      // {{#btd.usernameFromURL}}myProfileURL{{/btd.usernameFromURL}}
      usernameFromURL: function usernameFromURL() {
        return function what(input, render) {
          // I don't want this function to break horribly the day Twitter closes this issue
          // https://github.com/twitter/hogan.js/issues/222#issuecomment-106101791
          const val = render ? render(input) : Hogan.compile(input).render(this);

          return val.match(/https:\/\/(?:www.|)twitter.com\/(?:@|)([A-Za-z0-9_]+)/) && val.match(/https:\/\/(?:www.|)twitter.com\/(?:@|)([A-Za-z0-9_]+)/)[1];
        };
      },
    };

    if (settings.regex_filter) {
      TD.vo.Filter.prototype._testString = function _testString(e) {
        const regex = new RegExp(this.value, 'g');
        if (!e || !this.value) {
          return !0;
        }
        if (this.exact) {
          if (e === this.value) {
            return this.positive;
          }
          if (this.fuzzy && `@${e}` === this.value) {
            return this.positive;
          }
        } else if (e.match(regex) && this.type === 'phrase') {
          return this.positive;
        } else if (e.indexOf(this.value) !== -1) {
          return this.positive;
        }
        return !this.positive;
      };
    }

    // Re-adds the RT/Like indicators
    TD.mustaches['status/tweet_single.mustache'] = TD.mustaches['status/tweet_single.mustache'].replace('{{>status/tweet_single_footer}} </div>', '{{>status/tweet_single_footer}} <i class="sprite tweet-dogear"></i> </div>');
    TD.mustaches['status/tweet_detail.mustache'] = TD.mustaches['status/tweet_detail.mustache'].replace('</footer> {{/getMainTweet}}', '</footer> {{/getMainTweet}} <i class="sprite tweet-dogear"></i>');

    // Inject items into the interaction bar
    if (settings.hotlink_item) {
      let insertedActions = '';
      let insertedDetails = '';
      const actionStache = TD.mustaches['status/tweet_single_actions.mustache'];
      const detailStache = TD.mustaches['status/tweet_detail_actions.mustache'];

      // Duplicate the 'Like' action
      const actionPrototype = actionStache.match(/(<li[\s\S]*?li>)/gm)[2];
      const detailPrototype = detailStache.match(/(<li[\s\S]*?li>)/gm)[2];

      TD.mustaches['text/hotlink_action.mustache'] = TD.mustaches['text/favorite_action.mustache']
        .replace(/Favorite/g, 'Hotlinked')
        .replace(/Unlike/g, 'Unlink')
        .replace(/Like/g, 'Hotlink');

      insertedActions += actionPrototype.replace(/Like/g, 'Hotlink')
        .replace(/icon-favorite/g, 'icon-link')
        .replace(/icon-heart/g, 'icon-link')
        .replace(/Favorited/g, 'Hotlinked')
        .replace(/favorite/g, 'hotlink')
        .replace(/href="#"/g, 'href="#" data-btd-action="hotlink-media"')
        .replace(/tweet-action/g, 'btd-tweet-action tweet-action')
        .replace(/tweet-action-item/g, 'btd-tweet-action-item tweet-action-item');
      insertedDetails += detailPrototype.replace(/Like/g, 'Hotlink')
        .replace(/icon-favorite/g, 'icon-link')
        .replace(/icon-heart/g, 'icon-link')
        .replace(/Favorited/g, 'Hotlinked')
        .replace(/favorite/g, 'hotlink')
        .replace(/href="#"/g, 'href="#" data-btd-action="hotlink-media"')
        .replace(/tweet-detail-action/g, 'btd-tweet-detail-action tweet-detail-action')
        .replace(/tweet-detail-action-item/g, 'btd-tweet-action-item tweet-detail-action-item')
        .replace(/<li class/, '<li style="width: 20%;" class');

      const insertActionPosition = actionStache.lastIndexOf('<li class="tweet-action-item position-rel');
      TD.mustaches['status/tweet_single_actions.mustache'] = actionStache.substring(0, insertActionPosition)
        + insertedActions
        + actionStache.substring(insertActionPosition);

      const insertDetailPosition = detailStache.lastIndexOf('<li class="tweet-detail-action-item position-rel');
      TD.mustaches['status/tweet_detail_actions.mustache'] = (detailStache.substring(0, insertDetailPosition)
      + insertedDetails
      + detailStache.substring(insertDetailPosition))
        .replace(/<li class/g, '<li style="width: 20%;" class');
    }

    // Adds the Favstar.fm item in menus and adds mute action for each hashtag
    TD.mustaches['menus/actions.mustache'] = TD.mustaches['menus/actions.mustache'].replace('{{/chirp}} </ul>', `
      {{/chirp}}
      {{#chirp}}
        ${settings.mute_hashtags ? `{{#entities.hashtags}}
          <li class="is-selectable">
            <a href="#" data-btd-action="mute-hashtag" data-btd-hashtag="{{text}}">Mute #{{text}}</a>
          </li>
        {{/entities.hashtags}}` : ''}
        ${settings.favstar_item ? `<li class="drp-h-divider"></li>
        <li class="btd-action-menu-item is-selectable"><a href="https://favstar.fm/users/{{user.screenName}}/status/{{chirp.id}}" target="_blank" data-action="favstar">{{_i}}Show on Favstar{{/i}}</a></li>` : ''}
      {{/chirp}}
      </ul>
    `);

    UsernamesTemplates(TD.mustaches, settings.nm_disp);
  },
  BTDC_showTDBanner: (ev, data) => {
    const { banner } = data;
    bannerID += 1;

    $(document).trigger('dataMessage', {
      message: {
        id: bannerID,
        text: TD.i(banner.text),
        colors: {
          background: banner.bg || '#b2d5ed',
          foreground: banner.fg || '#555',
        },
        actions: [{
          id: `btd-banner-${bannerID}`,
          action: banner.action || 'url-ext',
          label: TD.i(banner.label),
          url: banner.url,
          event: banner.event ? banner.event : undefined,
        }],
      },
    });
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

  proxyEvent('gotChirpForColumn', { chirp: decorateChirp(chirp), colKey });
};

document.addEventListener('DOMNodeInserted', handleInsertedNode);

// TD Events
$(document).on('dataColumns', (ev, data) => {
  const cols = data.columns.filter(col => col.model.state.settings).map(col => ({
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
  }
});

$(document).on('openBtdSettings', (ev, data) => {
  window.open(data.url);
});

document.addEventListener('paste', (ev) => {
  if (ev.clipboardData) {
    const items = ev.clipboardData.items;

    if (!items) {
      return;
    }

    const files = [];

    [...items].forEach((item) => {
      if (item.type.indexOf('image') < 0) {
        return;
      }
      const blob = item.getAsFile();

      files.push(blob);
    });

    if (files.length === 0) {
      return;
    }

    const canPopout = $('.js-inline-compose-pop, .js-reply-popout').length > 0 && !$('.js-app-content').hasClass('is-open');

    if (canPopout) {
      $('.js-inline-compose-pop, .js-reply-popout').first().trigger('click');
      setTimeout(() => {
        $(document).trigger('uiFilesAdded', {
          files,
        });
      }, 0);
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
  const isMediaModal = document.querySelector('.js-modal-panel .js-media-preview-container, .js-modal-panel iframe, .js-modal-panel .btd-embed-container');

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
  }
});

// http://stackoverflow.com/a/2091331
const getQueryVariable = (str, variable) => {
  const vars = str.substring(1).split('&');
  for (let i = 0; i < vars.length; i += 1) {
    const pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
};

const setClipboard = (text) => {
  const tc = $('.compose-text-container .js-compose-text');
  const orig = tc.val();
  const active = document.activeElement;
  tc.val(text);
  tc[0].focus();
  tc[0].setSelectionRange(0, text.length);
  document.execCommand('copy');
  tc.val(orig);
  active.focus();
};

const cleanMediaUrl = (str) => {
  return str
    .replace(/url\(/g, '')
    .replace(/["')]/g, '')
    .replace(/:(thumb|small|medium|large|orig)$/, '')
    .replace(/^none$/, '');
};

const getMediaFromEmbed = (embed) => {
  const iframeSrc = $(embed).find('iframe').attr('src');
  if (iframeSrc && iframeSrc.length) {
    return getQueryVariable(iframeSrc, 'video_url');
  }
  return '';
};

const getMedia = (elem) => {
  const media = [];

  // check the obscure case of being in a modal
  const modalContainer = $(elem).parents('.js-modal-panel');

  $(modalContainer).find('.js-embeditem').each((i, embed) => {
    const iframeSrc = getMediaFromEmbed(embed);
    if (iframeSrc.length) {
      media.push(iframeSrc);
    }
  });
  if (media.length) return media;

  // we want to be sure this modal is a gif
  $(modalContainer).parents('[data-btd-provider="gif"]')
    .find('.btd-embed-container video').each((i, link) => {
      const vidSrc = $(link).attr('src');
      if (vidSrc.length) {
        media.push(vidSrc);
      }
    });
  if (media.length) return media;

  // check the most typical case of a stream item
  const normalContainer = $(elem).parents('article');

  $(normalContainer).find('.quoted-tweet').each((i, link) => {
    const tweetID = $(link).data('tweet-id');
    const fullURI = `${$(link).find('.account-link').attr('href')}/status/${tweetID}`;
    if (fullURI.length) {
      media.push(fullURI);
    }
  });
  if (media.length) return media;

  $(normalContainer).find('.tweet-detail-media .js-media iframe').parent().each((i, embed) => {
    const iframeSrc = getMediaFromEmbed(embed);
    if (iframeSrc.length) {
      media.push(iframeSrc);
    }
  });
  if (media.length) return media;

  $(normalContainer).find('.is-video .js-media-image-link').each((i, link) => {
    const oTarget = $(link).attr('target');
    const oSrc = $(link).attr('src');
    $(link).attr('target', '');
    $(link).attr('src', '#');
    $(link).click();

    const embeds = $('.js-embeditem');
    $(embeds).each((j, embed) => {
      const iframeSrc = getMediaFromEmbed(embed);
      if (iframeSrc.length) {
        media.push(iframeSrc);
      }
      $('.mdl-dismiss .icon-close').click();
    });

    $(link).attr('target', oTarget);
    $(link).attr('src', oSrc);
  });
  if (media.length) return media;

  $(normalContainer).find('video.js-media-gif').each((i, link) => {
    const vidSrc = $(link).attr('src');
    if (vidSrc.length) {
      media.push(vidSrc);
    }
  });
  if (media.length) return media;

  $(normalContainer).find('.js-media ')
    .find('.med-link, .media-image')
    .each((i, link) => {
      const imgSrc = cleanMediaUrl($(link).css('background-image'));

      if (imgSrc && imgSrc.length) {
        media.push(imgSrc);
      }
    });

  // these rules work in all contexts
  const all = $()
    .add($(normalContainer))
    .add($(modalContainer));

  $(all).find('img.media-img').each((i, link) => {
    const imgSrc = cleanMediaUrl($(link).attr('src'));

    if (imgSrc.length) {
      media.push(imgSrc);
    }
  });

  return media;
};

$('body').on('click', '[data-btd-action="hotlink-media"]', (ev) => {
  ev.preventDefault();
  const foundMedia = getMedia($(ev.target));
  setClipboard(foundMedia.join('\n'));
});

$('body').on('click', '[data-btd-action="mute-hashtag"]', (ev) => {
  ev.preventDefault();
  const hashtag = $(ev.target).data('btd-hashtag');

  TD.controller.filterManager.addFilter('phrase', `#${hashtag}`);
});


const defaultTitle = 'TweetDeck';
const unreadTitle = '[*] TweetDeck';
const countTitle = count => `[${count}] TweetDeck`;

// This event triggers everytime the "read" change of a column changes in TweetDeck
$(document).on('uiReadStateChange uiMessageUnreadCount', (ev, data) => {
  // If we didn't enable the option, we stop here
  if (!SETTINGS || !SETTINGS.update_title_on_notifications) {
    return;
  }

  // We get the "read" flag from the event's payload

  const { read, count } = data;

  if (Number(count) > 0 && document.title === defaultTitle && document.title !== countTitle(count)) {
    document.title = countTitle(count);
  }

  if (read === false && document.title === defaultTitle) {
    document.title = unreadTitle;
  }

  if (document.title !== defaultTitle && $('.is-new, .js-unread-count.is-visible').length === 0) {
    document.title = defaultTitle;
  }
});

const isVisible = (elem) => {
  if (!(elem instanceof Element)) {
    throw Error('not an element');
  }

  const style = getComputedStyle(elem);
  const boundRect = elem.getBoundingClientRect();

  // If a single top/bottom/left/right value is negative then the element is partially out of the window
  const isCompletelyVisible = ['left', 'right', 'top', 'bottom'].every(i => boundRect[i] > 0);

  return style.display !== 'none' &&
        style.visibility === 'visible' && isCompletelyVisible;
};

window.addEventListener('focus', (ev) => {
  // Don't do anything if we don't focus the window
  if (!(ev.target instanceof Window)) {
    return;
  }

  const active = document.activeElement;
  if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
    return;
  }
  const widget = [
    document.querySelector('textarea.compose-text'),
  ].find(elem => elem && isVisible(elem));
  if (widget) {
    widget.focus();
  }
}, true);
