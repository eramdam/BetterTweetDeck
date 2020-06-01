import {Twitter} from 'twit';

import {TweetDeckChirp} from '../types/tweetdeck';
import {TweetDeckObject} from '../types/tweetdeckTypes';

/**
 * Finds a mustache template whose content matches the query.
 * NOTE: as of October 12th 2019, TweetDeck has some of its templates as components so this methods might not find everything.
 */
export const findMustache = (TD: TweetDeckObject, query: string) =>
  Object.keys(TD.mustaches).filter((i) =>
    TD.mustaches[i].toLowerCase().includes(query.toLowerCase())
  );

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
export const getChirpFromElement = (
  TD: TweetDeckObject,
  element: HTMLElement | Element
): TweetDeckChirp | null => {
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

  chirp._btd = {
    chirpKey,
    columnKey: colKey,
  };
  // `chirpType` lives on the prototype of `chirp`, so it obviously won't carry on when serialized
  // eslint-disable-next-line no-self-assign
  chirp.chirpType = chirp.chirpType;
  return chirp;
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
