import './badgesOnTopOfAvatars.css';

import {ChirpAddedPayload} from '../inject/chirpHandler';
import {makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {ChirpBaseTypeEnum, TweetDeckUser, TwitterActionEnum} from '../types/tweetdeckTypes';

export function putBadgesOnTopOfAvatars(settings: BTDSettings, addedChirp: ChirpAddedPayload) {
  document.body.setAttribute('btd-badges-top-avatar', String(settings.badgesOnTopOfAvatars));

  if (!settings.badgesOnTopOfAvatars) {
    return;
  }

  const {chirp, chirpExtra} = addedChirp;
  const actionOrType = chirpExtra.action || chirpExtra.chirpType;
  let userToVerify: TweetDeckUser | undefined;
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
        userToVerify = chirp.sourceUser;
        classesToAdd.push('btd-mini-badge');
      } else {
        userToVerify = chirp.targetTweet?.user;
      }

      break;

    case TwitterActionEnum.MENTION:
    case TwitterActionEnum.QUOTED_TWEET:
    case TwitterActionEnum.QUOTE:
      userToVerify = chirp.sourceUser;
      break;

    case TwitterActionEnum.LIST_MEMBER_ADDED:
    case TwitterActionEnum.LIST_MEMBER_REMOVED:
      userToVerify = chirp.owner;
      classesToAdd.push('btd-mini-badge');
      break;

    case ChirpBaseTypeEnum.MESSAGE_THREAD:
      if (chirp.participants.length > 1) {
        break;
      }

      userToVerify = chirp.participants[0];
      break;

    case ChirpBaseTypeEnum.TWEET:
      userToVerify = chirp.retweetedStatus ? chirp.retweetedStatus.user : chirp.user;
      break;

    case ChirpBaseTypeEnum.MESSAGE:
      userToVerify = chirp.sender;
      break;

    default:
      break;
  }

  if (!userToVerify || !chirpNode) {
    return;
  }

  if (userToVerify.isVerified) {
    chirpNode.classList.add(...classesToAdd, 'btd-verified-badge');
  } else if (userToVerify.isTranslator) {
    chirpNode.classList.add(...classesToAdd, 'btd-translator-badge');
  }
}
