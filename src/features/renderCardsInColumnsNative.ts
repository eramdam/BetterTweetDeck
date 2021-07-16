import './renderCardsInColumns.css';

import {makeBTDModule} from '../types/btdCommonTypes';
import {TwitterStatus} from '../types/tweetdeckTypes';

const allowedCardNames = [
  '3260518932:moment',
  'poll2choice_text_only',
  'poll3choice_text_only',
  'poll4choice_text_only',
  'summary',
  'summary_large_image',
  '3691233323:periscope_broadcast',
  'audio',
  'player',
  '745291183405076480:live_event',
  '745291183405076480:live_video',
];

export const maybeRenderCardsInColumnsNatively = makeBTDModule((options) => {
  const {mR, settings, TD} = options;

  if (!settings.showCardsInsideColumns) {
    return;
  }

  const featureFlagModule = mR.findFunction('setValueForFeatureFlag')[0];

  if (!featureFlagModule) {
    return;
  }

  TD.services.TwitterAction.prototype.OGFromJSON =
    TD.services.TwitterAction.prototype.fromJSONObject;

  TD.services.TwitterAction.prototype.fromJSONObject = function fromJSONObject(...args: any[]) {
    var baseTweet = this.OGFromJSON(...args) as TwitterStatus;

    if (baseTweet.card) {
      if (
        (baseTweet.targetTweet && !baseTweet.targetTweet.card) ||
        (baseTweet.quotedTweet && !baseTweet.quotedTweet.card) ||
        (baseTweet.retweetedStatus && !baseTweet.retweetedStatus.card)
      ) {
        baseTweet.card = undefined;
      }
    }

    return baseTweet;
  };

  featureFlagModule.setValueForFeatureFlag('tweetdeck_horizon_web_cards_enabled', allowedCardNames);
});
