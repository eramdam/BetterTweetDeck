import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {TwitterActionEnum} from '../types/tweetdeckTypes';

export const addActionUsername = makeBTDModule(({TD, settings}) => {
  if (!settings.addActionUsername) {
    return;
  }

  onChirpAdded((payload) => {
    const chirpNode = document.querySelector(makeBtdUuidSelector('data-btd-uuid', payload.uuid));

    if (!chirpNode) {
      return;
    }

    const actionUserAnchor = chirpNode.querySelector('.nbfc > a');

    if (!actionUserAnchor) {
      return;
    }

    let screenName;
    const action = payload.chirpExtra.action;
    if (action === TwitterActionEnum.FOLLOW) {
      screenName = payload.chirp.following?.screenName;
    } else if (
      action === TwitterActionEnum.RETWEET ||
      action === TwitterActionEnum.RETWEETED_RETWEET ||
      action === TwitterActionEnum.RETWEETED_MENTION ||
      action === TwitterActionEnum.RETWEETED_MEDIA ||
      action === TwitterActionEnum.FAVORITE ||
      action === TwitterActionEnum.FAVORITED_RETWEET ||
      action === TwitterActionEnum.FAVORITED_MENTION ||
      action === TwitterActionEnum.FAVORITED_MEDIA
    ) {
      screenName = payload.chirp.sourceUser?.screenName;
    } else {
      screenName = payload.chirp.user?.screenName;
    }

    if (!screenName) {
      return;
    }

    actionUserAnchor.appendChild(document.createTextNode(` (@${screenName})`));
  });
});
