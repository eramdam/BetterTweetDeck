import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
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
  '2586390716:video_direct_message',
];

export const maybeRenderCardsInColumnsNatively = makeBTDModule((options) => {
  const {mR, settings, jq} = options;

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

  featureFlagModule.setValueForFeatureFlag('tweetdeck_horizon_web_cards_enabled', allowedCardNames);
  jq(document).on('click', 'article .js-card-container [data-testid="card"]', (ev) => {
    ev.stopPropagation();
  });
});
