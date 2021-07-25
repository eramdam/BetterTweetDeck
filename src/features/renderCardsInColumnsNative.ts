import './renderCardsInColumns.css';

import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
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

  const featureFlagModule = mR.findModule('setValueForFeatureFlag')[0];
  const isFeatureFlagModule = makeIsModuleRaidModule<{
    setValueForFeatureFlag: (flag: string, value: any) => void;
  }>((mod) => hasProperty(mod, 'setValueForFeatureFlag'));

  if (!isFeatureFlagModule(featureFlagModule)) {
    return;
  }

  // Monkey-patch the `getIFrameUrl` method in order to not send bogus id for actions
  mR.findModule((mod) => {
    if (hasProperty(mod, 'getIFrameUrl') && mod.getIFrameUrl) {
      mod.getIFrameUrl = (id: string) => {
        const splits = id.split('_');
        const actualId = splits[splits.length - 1] || id;

        return 'https://cards-frame.twitter.com/i/cards/tfw/v1/uc/' + actualId;
      };

      return true;
    }

    return false;
  });

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
    } else if (baseTweet.targetTweet && baseTweet.targetTweet.card && baseTweet.isAboutYou()) {
      const urlFromCard = baseTweet.targetTweet.card.url;
      const isUrlInHtml = baseTweet.targetTweet.htmlText.includes(urlFromCard);

      if (!isUrlInHtml) {
        const entityForUrl = baseTweet.targetTweet.entities.urls.find((u) => u.url === urlFromCard);
        if (entityForUrl) {
          baseTweet.targetTweet.htmlText +=
            '\n\n' + TD.util.createUrlAnchor({...entityForUrl, isUrlForAttachment: false});
        }
      }
    }

    return baseTweet;
  };

  featureFlagModule.setValueForFeatureFlag('tweetdeck_horizon_web_cards_enabled', allowedCardNames);
});
