import {useLayoutEffect, useState} from 'react';
import {Twitter} from 'twit';

import {TweetDeckChirp, TweetDeckColumn, TweetdeckMediaEntity} from '../types/tweetdeckTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';
import {HandlerOf} from './typeHelpers';

/**
 * Finds a mustache template whose content matches the query.
 * NOTE: as of October 12th 2019, TweetDeck has some of its templates as components so this methods might not find everything.
 */
export const findMustache = (TD: TweetDeckObject, query: string) =>
  Object.keys(TD.mustaches).filter((i) =>
    TD.mustaches[i].toLowerCase().includes(query.toLowerCase())
  );

export const getChirpFromKeyAlone = (TD: TweetDeckObject, key: string) => {
  const chirpNode = document.querySelector(`[data-key="${key}"]`);

  if (!chirpNode) {
    return undefined;
  }

  return getChirpFromElement(TD, chirpNode);
};

/** Finds a chirp inside TweetDeck given a key and a column key. */
export const getChirpFromKey = (
  TD: TweetDeckObject,
  key: string,
  colKey: string
): TweetDeckChirp | null => {
  const column = TD.controller.columnManager.get(colKey);

  if (!column) {
    return null;
  }

  const directChirp = column.updateIndex[key];
  if (directChirp && directChirp.id === String(key)) {
    return directChirp;
  }

  const chirpsArray: TweetDeckChirp[] = [];
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
    if (column.detailViewComponent.chirp) {
      chirpsArray.push(column.detailViewComponent.chirp);
    }

    if (column.detailViewComponent.mainChirp) {
      chirpsArray.push(column.detailViewComponent.mainChirp);
    }

    if (column.detailViewComponent.repliesTo && column.detailViewComponent.repliesTo.repliesTo) {
      chirpsArray.push(...column.detailViewComponent.repliesTo.repliesTo);
    }

    if (column.detailViewComponent.replies && column.detailViewComponent.replies.replies) {
      chirpsArray.push(...column.detailViewComponent.replies.replies);
    }
  }

  const chirp = chirpsArray.find((c) => c.id === String(key));

  if (!chirp) {
    console.log(`did not find chirp ${key} within ${colKey}`);
    return null;
  }

  return chirp;
};

/** finds the chirp corresponding to an element in the DOM. */
export const getChirpFromElement = (TD: TweetDeckObject, element: HTMLElement | Element) => {
  const chirpElm = element.closest('[data-key]');
  if (!chirpElm) {
    throw new Error('Not a chirp');
  }

  const chirpKey = chirpElm.getAttribute('data-key') as string;

  let col: Element | undefined | null = chirpElm.closest('[data-column]');

  if (!col) {
    col = document.querySelector(`[data-column] [data-key="${chirpKey}"]`);
    if (!col || !col.parentNode) {
      throw new Error('Chirp has no column');
    } else {
      col = col.parentElement;
    }
  }

  if (!col) {
    return null;
  }

  const colKey = col.getAttribute('data-column') as string;
  const chirp = getChirpFromKey(TD, chirpKey, colKey);

  if (!chirp) {
    return null;
  }

  return {
    chirp: chirp,
    extra: {
      chirpType: chirp.chirpType,
      action: chirp.action,
      columnKey: colKey,
    },
  };
};

/** Finds all the URLs (attachments, links, etc) in a chirp. */
export const getURLsFromChirp = (chirp: TweetDeckChirp) => {
  let chirpURLs: Twitter.UrlEntity[] = [];

  if (!chirp) {
    console.log(chirp);
    return [];
  }

  if (chirp.entities) {
    chirpURLs = [...chirp.entities.urls, ...chirp.entities.media];
  } else if (chirp.targetTweet && chirp.targetTweet.entities) {
    // If it got targetTweet it's an activity on a tweet
    chirpURLs = [...chirp.targetTweet.entities.urls, ...chirp.targetTweet.entities.media];
  } else if (chirp.retweet && chirp.retweet.entities) {
    chirpURLs = [...chirp.retweet.entities.urls, ...chirp.retweet.entities.media];
  } else if (chirp.retweetedStatus && chirp.retweetedStatus.entities) {
    chirpURLs = [...chirp.retweetedStatus.entities.urls, ...chirp.retweetedStatus.entities.media];
  }

  return chirpURLs;
};

// Might not be useful anymore
export const createSelectorForChirp = (chirp: TweetDeckChirp, colKey: string) =>
  `[data-column=${colKey}] [data-key="${chirp.id}"]`;

export function onComposerShown(callback: HandlerOf<boolean>) {
  const drawer = document.querySelector('.drawer[data-drawer="compose"]');

  const onChange = () => {
    const tweetCompose = drawer?.querySelector('textarea.js-compose-text');

    if (!tweetCompose) {
      callback(false);
      return;
    }

    callback(true);
  };

  const composerObserver = new MutationObserver(onChange);

  composerObserver.observe(drawer!, {
    childList: true,
  });

  onChange();

  return () => {
    composerObserver.disconnect();
  };
}

export function useIsComposerVisible(onVisibleChange?: HandlerOf<boolean>) {
  const [isVisible, setIsVisible] = useState(false);

  useLayoutEffect(() => {
    onComposerShown((bool) => {
      setIsVisible(bool);
      if (onVisibleChange) {
        onVisibleChange(bool);
      }
    });

    return () => {};
  }, [onVisibleChange]);

  return isVisible;
}

// From http://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
function insertAtCursor(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  if (input.selectionStart || input.selectionStart === 0) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    input.value =
      input.value.substring(0, startPos) +
      value +
      input.value.substring(endPos || 0, input.value.length);
  } else {
    input.value += value;
  }
}

export function insertInsideComposer(string: string) {
  const tweetCompose = document.querySelector<HTMLTextAreaElement>('textarea.js-compose-text');

  if (!tweetCompose) {
    console.error('[BTD] No composer present');
    return;
  }

  insertAtCursor(tweetCompose, string);
  tweetCompose.dispatchEvent(new KeyboardEvent('input'));
  tweetCompose.dispatchEvent(new Event('change'));
}

export function getCurrentTheme() {
  return document.querySelector<HTMLElement>('html')!.classList.contains('dark') ? 'dark' : 'light';
}

export function onThemeChange(callback: HandlerOf<'light' | 'dark'>) {
  const root = document.querySelector<HTMLElement>('html');

  if (!root) {
    return;
  }

  const onChange = () => {
    const theme = root.classList.contains('dark') ? 'dark' : 'light';
    callback(theme);
  };

  const observer = new MutationObserver(onChange);

  onChange();

  observer.observe(root, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

export const getMediaFromChirp = (chirp: TweetDeckChirp) => {
  const urls: string[] = [];

  chirp.entities.media.forEach((item) => {
    switch (item.type) {
      case 'video':
      case 'animated_gif':
        urls.push(findBiggestBitrate(item.video_info.variants).url.split('?')[0]);
        break;
      case 'photo':
        urls.push(`${item.media_url_https}:orig`);
        break;
      default:
        throw new Error(`unsupported media type: ${item.type}`);
    }
  });

  return urls;
};

const findBiggestBitrate = (videos: TweetdeckMediaEntity['video_info']['variants']) => {
  return videos.reduce((max, x) => {
    return (x.bitrate || -1) > (max.bitrate || -1) ? x : max;
  });
};

export const getFilenameDownloadData = (chirp: TweetDeckChirp, url: string) => {
  const chirpCreated = new Date(chirp.created);
  return {
    fileExtension: url
      .replace(/:[a-z]+$/, '')
      .split('.')
      .pop(),
    fileName: url.split('/').pop()!.split('.')[0],
    postedUser: chirp.retweetedStatus
      ? chirp.retweetedStatus.user.screenName
      : chirp.user.screenName,
    tweetId: chirp.retweetedStatus ? chirp.retweetedStatus.id : chirp.id,
    year: chirpCreated.getFullYear(),
    month: (chirpCreated.getMonth() + 1).toString().padStart(2, '0'),
    day: chirpCreated.getDate().toString().padStart(2, '0'),
    hours: chirpCreated.getHours().toString().padStart(2, '0'),
    minutes: chirpCreated.getMinutes().toString().padStart(2, '0'),
    seconds: chirpCreated.getSeconds().toString().padStart(2, '0'),
  };
};

let bannerId = 0;

interface TweetDeckBannerDataActionBase {
  action: 'url-ext' | 'trigger-event';
  label: string;
  class?: string;
}

interface TweetDeckBannerDataActionWithEvent extends TweetDeckBannerDataActionBase {
  action: 'trigger-event';
  event: {
    type: string;
    data: object;
  };
}

interface TweetDeckBannerDataActionWithUrl extends TweetDeckBannerDataActionBase {
  action: 'url-ext';
  url: string;
}

type TweetDeckBannerDataAction =
  | TweetDeckBannerDataActionWithEvent
  | TweetDeckBannerDataActionWithUrl;

interface TweetDeckBannerData {
  bannerClasses?: string;
  message: {
    text: string;
    colors?: {
      background?: string;
      foreground?: string;
    };
    isUnDismissable?: boolean;
    actions?: TweetDeckBannerDataAction[];
  };
}

export const displayTweetDeckBanner = (jq: JQueryStatic, data: TweetDeckBannerData) => {
  bannerId++;
  jq(document).trigger('dataMessage', {
    ...data,
    bannerClasses: `${data.bannerClasses} btd-banner`,
    message: {
      ...data.message,
      id: `btd-${bannerId}`,
      colors: {
        foreground: 'white',
        background: '#009eff',
      },
      actions: (data.message.actions || []).map((a, index) => ({
        ...a,
        actionId: `action-${bannerId}`,
        id: `action-${bannerId}`,
        class: `btd-banner-button ${a.class}`,
      })),
    },
  });
};

export function reloadColumn(column: TweetDeckColumn) {
  column.model.setClearedTimestamp(0);
  if (column.reloadTweets) {
    column.reloadTweets();
  }
}
