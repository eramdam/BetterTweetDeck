import './badgesOnTopOfAvatars.css';

import {DateTime} from 'luxon';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {
  ChirpBaseTypeEnum,
  TweetDeckControllerClient,
  TweetDeckControllerRelationshipResult,
  TweetDeckUser,
  TwitterActionEnum,
} from '../types/tweetdeckTypes';

export enum BTDMutualBadges {
  HEART = 'heart',
  ARROWS = 'arrows',
}

export const putBadgesOnTopOfAvatars = makeBTDModule(({TD, settings}) => {
  if (!settings.badgesOnTopOfAvatars) {
    return;
  }
  document.body.setAttribute('btd-badges-top-avatar', String(settings.badgesOnTopOfAvatars));

  onChirpAdded((addedChirp) => {
    const {chirp, chirpExtra} = addedChirp;
    const actionOrType = chirpExtra.action || chirpExtra.chirpType;
    let userForBadge: TweetDeckUser | undefined;
    const classesToAdd = ['btd-badge'];
    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', addedChirp.uuid));

    if (!chirpNode) {
      return;
    }

    switch (actionOrType) {
      case TwitterActionEnum.RETWEET:
      case TwitterActionEnum.RETWEETED_RETWEET:
      case TwitterActionEnum.RETWEETED_MEDIA:
      case TwitterActionEnum.RETWEETED_MENTION:
      case TwitterActionEnum.FAVORITE:
      case TwitterActionEnum.FAVORITED_MEDIA:
      case TwitterActionEnum.FAVORITED_MENTION:
      case TwitterActionEnum.FAVORITED_RETWEET:
        if (chirpNode.querySelector('.has-source-avatar')) {
          userForBadge = chirp.sourceUser;
          classesToAdd.push('btd-mini-badge');
        } else {
          userForBadge = chirp.targetTweet?.user;
        }

        break;

      case TwitterActionEnum.MENTION:
      case TwitterActionEnum.QUOTED_TWEET:
      case TwitterActionEnum.QUOTE:
        userForBadge = chirp.sourceUser;
        break;

      case TwitterActionEnum.LIST_MEMBER_ADDED:
      case TwitterActionEnum.LIST_MEMBER_REMOVED:
        userForBadge = chirp.owner;
        classesToAdd.push('btd-mini-badge');
        break;

      case ChirpBaseTypeEnum.MESSAGE_THREAD:
        if (chirp.participants.length > 1) {
          break;
        }

        userForBadge = chirp.participants[0];
        break;

      case ChirpBaseTypeEnum.TWEET:
        userForBadge = chirp.retweetedStatus ? chirp.retweetedStatus.user : chirp.user;
        break;

      case ChirpBaseTypeEnum.MESSAGE:
        userForBadge = chirp.sender;
        break;

      default:
        break;
    }

    if (!userForBadge || !chirpNode) {
      return;
    }

    if (userForBadge.isVerified && settings.verifiedBadges) {
      chirpNode.classList.add(...classesToAdd, 'btd-verified-badge');
    } else if (userForBadge.isTranslator && settings.translatorBadges) {
      chirpNode.classList.add(...classesToAdd, 'btd-translator-badge');
    } else if (userForBadge.following && settings.mutualBadges) {
      getFollowerStatus(userForBadge).then((result) => {
        if (!result) {
          return;
        }

        if (result.relationship.target.followed_by && result.relationship.target.following) {
          chirpNode.classList.add(...classesToAdd, 'btd-mutual-badge');
          if (settings.mutualBadgeVariation === BTDMutualBadges.HEART) {
            chirpNode.classList.add('btd-mutual-heart');
          } else {
            chirpNode.classList.add('btd-mutual-arrows');
          }
        }
      });
    }
  });

  type CachedRelationship = TweetDeckControllerRelationshipResult & {
    requested_date: number;
  };

  const relationshipCache = JSON.parse(localStorage.getItem('btd-relationship-cache') || '{}') as {
    [k: string]: CachedRelationship | undefined;
  };

  window.addEventListener('beforeunload', () => {
    localStorage.setItem('btd-relationship-cache', JSON.stringify(relationshipCache));
  });

  async function getRelationForUserAndClient(
    client: TweetDeckControllerClient,
    user: TweetDeckUser
  ): Promise<CachedRelationship | undefined> {
    // Computing a cache key
    const cacheKey = `${client.oauth.account.state.userId}-${user.id}`;
    // Looking into our cache
    const fromCache = relationshipCache[cacheKey];
    const now = DateTime.local();

    if (fromCache) {
      const requestDate = DateTime.fromMillis(fromCache.requested_date);
      const diff = requestDate.diff(now, 'days');

      // If our cache is less than a day old, take from it.
      if (diff.days <= 1) {
        return relationshipCache[cacheKey];
      }
    }

    return new Promise<CachedRelationship>((resolve) => {
      client.showFriendship(client.oauth.account.state.userId, null, user.screenName, (result) => {
        const toCache = {...result, requested_date: Date.now()};
        resolve(toCache);
        relationshipCache[cacheKey] = toCache;
      });
    });
  }

  async function getFollowerStatus(user: TweetDeckUser) {
    const client = TD.controller.clients.getClient(user.account.privateState.key);

    if (!client) {
      return;
    }

    return getRelationForUserAndClient(client, user);
  }
});
