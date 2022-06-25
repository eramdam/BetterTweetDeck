import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const maybeRenderCardsInColumnsNatively = makeBTDModule((options) => {
  const {mR, settings, jq} = options;

  if (settings.showCardsInsideColumns) {
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

  featureFlagModule.setValueForFeatureFlag('tweetdeck_horizon_web_cards_enabled', []);
  jq(document).on('click', 'article .js-card-container [data-testid="card"]', (ev) => {
    ev.stopPropagation();
  });
});
