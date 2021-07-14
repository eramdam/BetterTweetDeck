import './renderCardsInColumns.css';

import {makeBTDModule} from '../types/btdCommonTypes';

const allowedCardNames = [
  'amplify',
  'app',
  'appplayer',
  'audio',
  '745291183405076480:broadcast',
  'direct_store_link_app',
  '2586390716:image_direct_message',
  '745291183405076480:live_event',
  '2586390716:message_me',
  '3260518932:moment',
  '3691233323:periscope_broadcast',
  'player',
  'poll2choice_text_only',
  'poll3choice_text_only',
  'poll4choice_text_only',
  'poll2choice_image',
  'poll3choice_image',
  'poll4choice_image',
  'poll2choice_video',
  'poll3choice_video',
  'poll4choice_video',
  'promo_image_app',
  'promo_image_convo',
  'promo_video_convo',
  '2586390716:promo_video_website',
  'promo_website',
  'summary',
  'summary_large_image',
  'unified_card',
  '2586390716:video_direct_message',
];

export const maybeRenderCardsInColumnsNatively = makeBTDModule((options) => {
  const {mR, settings} = options;

  if (!settings.showCardsInsideColumns) {
    return;
  }

  const featureFlagModule = mR.findFunction('setValueForFeatureFlag')[0];

  if (!featureFlagModule) {
    return;
  }

  featureFlagModule.setValueForFeatureFlag('tweetdeck_horizon_web_cards_enabled', allowedCardNames);
});
