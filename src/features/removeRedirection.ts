import _ from 'lodash';
import {isEntityFinderPositiveResult, TweetDeckEntitiesType} from 'skyla';

import {getCompleteTweetById} from '../helpers/skylaHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeRemoveRedirection = makeBTDModule(({settings, skyla}) => {
  if (!settings.removeRedirectionOnLinks) {
    return;
  }

  skyla.onEntityAdded((res) => {
    if (!isEntityFinderPositiveResult(res)) {
      return;
    }

    if (res.type !== TweetDeckEntitiesType.TWEET) {
      return;
    }

    const completeTweet = getCompleteTweetById(skyla, res.id);

    if (!completeTweet) {
      return;
    }

    const urlEntities = _([
      completeTweet.tweet.entities.urls,
      completeTweet.quotedTweet?.entities.urls,
      completeTweet.retweetedTweet?.entities.urls,
    ])
      .compact()
      .flatten()
      .value();
    const tcoUrls = urlEntities.map((e) => e.url);

    Array.from(res.node.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .filter((anchor) => {
        return tcoUrls.includes(cleanUrl(anchor.href));
      })
      .map((anchor) => {
        return {
          node: anchor,
          url: cleanUrl(anchor.href),
        };
      })
      .forEach(({node, url}) => {
        const correspondingUrl = urlEntities.find((entity) => {
          return entity.url === url;
        });

        if (!correspondingUrl) {
          return;
        }

        node.setAttribute('href', correspondingUrl.expanded_url);
      });
  });
});

function cleanUrl(href: string) {
  const url = new URL(href);

  [...url.searchParams.keys()].forEach((k) => {
    url.searchParams.delete(k);
  });

  return url.toString();
}
