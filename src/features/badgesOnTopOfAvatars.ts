import './badgesOnTopOfAvatars.css';

import {ChirpHandlerPayload} from '../inject/chirpHandler';
import {makeBtdUuidSelector} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckUser} from '../types/tweetdeckTypes';

export function putBadgesOnTopOfAvatars(settings: BTDSettings, addedChirp: ChirpHandlerPayload) {
  document.body.setAttribute('btd-badges-top-avatar', String(settings.badgesOnTopOfAvatars));

  if (!settings.badgesOnTopOfAvatars) {
    return;
  }

  const chirp = addedChirp.chirp;
  const actionOrType = chirp.action || chirp.chirpType;
  let userToVerify: TweetDeckUser | undefined;
  const classesToAdd = ['btd-badge'];
  const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', addedChirp.uuid));

  if (!chirpNode) {
    return;
  }

  switch (actionOrType) {
    case 'retweet':
    case 'retweeted_retweet':
    case 'favorite':
      if (chirpNode.querySelector('.has-source-avatar')) {
        userToVerify = chirp.sourceUser;
        classesToAdd.push('btd-mini-badge');
      } else {
        userToVerify = chirp.targetTweet?.user;
      }

      break;

    case 'mention':
    case 'quoted_tweet':
      userToVerify = chirp.sourceUser;
      break;

    case 'list_member_added':
      userToVerify = chirp.owner;
      classesToAdd.push('btd-mini-badge');
      break;

    case 'message_thread':
      if (chirp.participants.length > 1) {
        break;
      }

      userToVerify = chirp.participants[0];
      break;

    case 'tweet':
      userToVerify = chirp.retweetedStatus ? chirp.retweetedStatus.user : chirp.user;
      break;

    case 'message':
      userToVerify = chirp.sender;
      break;

    default:
      break;
  }

  const el = chirpNode;
  if (userToVerify && el) {
    if (userToVerify.isVerified) {
      el.classList.add(...classesToAdd, 'btd-verified-badge');
    } else if (userToVerify.isTranslator) {
      el.classList.add(...classesToAdd, 'btd-translator-badge');
    }
  }
}
