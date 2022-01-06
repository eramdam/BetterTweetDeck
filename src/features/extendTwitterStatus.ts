import {makeBTDModule} from '../types/btdCommonTypes';
import {TwitterActionEnum, TwitterStatus} from '../types/tweetdeckTypes';

export const extendTwitterStatus = makeBTDModule(({TD, settings}) => {
  TD.services.TwitterAction.prototype.OGFromJSON =
    TD.services.TwitterAction.prototype.fromJSONObject;

  const notificationActionTypes = [
    TwitterActionEnum.FAVORITE,
    TwitterActionEnum.FAVORITED_MEDIA,
    TwitterActionEnum.FAVORITED_MENTION,
    TwitterActionEnum.FAVORITED_RETWEET,
    TwitterActionEnum.RETWEETED_MEDIA,
    TwitterActionEnum.RETWEETED_MENTION,
    TwitterActionEnum.RETWEETED_RETWEET,
    TwitterActionEnum.RETWEET,
  ];

  TD.services.TwitterAction.prototype.fromJSONObject = function fromJSONObject(...args: any[]) {
    var baseTweet = this.OGFromJSON(...args) as TwitterStatus;

    if (baseTweet.card) {
      if (
        (baseTweet.targetTweet && !baseTweet.targetTweet.card) ||
        (baseTweet.quotedTweet && !baseTweet.quotedTweet.card) ||
        (baseTweet.retweetedStatus && !baseTweet.retweetedStatus.card)
      ) {
        baseTweet.card = undefined;
      } else if (baseTweet.targetTweet && baseTweet.targetTweet.card) {
        baseTweet.card = baseTweet.targetTweet.card;
      }
    } else if (baseTweet.targetTweet && baseTweet.targetTweet.card && baseTweet.isAboutYou()) {
      const urlFromCard = baseTweet.targetTweet.card.url;

      if (baseTweet.action && notificationActionTypes.includes(baseTweet.action)) {
        const isUrlInHtml = baseTweet.targetTweet.htmlText.includes(urlFromCard);

        if (!isUrlInHtml) {
          const entityForUrl = baseTweet.targetTweet.entities.urls.find(
            (u) => u.url === urlFromCard
          );
          if (entityForUrl) {
            baseTweet.targetTweet.htmlText += TD.util.createUrlAnchor({
              ...entityForUrl,
              isUrlForAttachment: false,
            });
          }
        }
      } else {
        const isUrlInHtml = baseTweet.targetTweet.text.includes(urlFromCard);

        if (!isUrlInHtml) {
          const entityForUrl = baseTweet.targetTweet.entities.urls.find(
            (u) => u.url === urlFromCard
          );
          if (entityForUrl) {
            baseTweet.targetTweet.htmlText +=
              '\n\n' + TD.util.createUrlAnchor({...entityForUrl, isUrlForAttachment: false});
          }
        }
      }
    }

    return baseTweet;
  };
  TD.services.TwitterStatus.prototype.OGFromJSON =
    TD.services.TwitterStatus.prototype.fromJSONObject;

  TD.services.TwitterStatus.prototype.fromJSONObject = function fromJSONObject(blob: any) {
    var baseTweet = this.OGFromJSON(blob) as TwitterStatus;

    // @ts-expect-error
    baseTweet.conversationControl = blob.conversation_control;
    // @ts-expect-error
    baseTweet.limitedActions = blob.limited_actions;
    // @ts-expect-error
    baseTweet.cannotBeRepliedTo = blob.limited_actions === 'limited_replies';

    return baseTweet;
  };
});
