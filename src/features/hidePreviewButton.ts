import {hasProperty, makeIsModuleRaidModule} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const hidePreviewButton = makeBTDModule(({mR, settings}) => {
  const featureFlagModule = mR.findModule('setValueForFeatureFlag')[0];
  const isFeatureFlagModule = makeIsModuleRaidModule<{
    setValueForFeatureFlag: (flag: string, value: any) => void;
  }>((mod) => hasProperty(mod, 'setValueForFeatureFlag'));

  if (!isFeatureFlagModule(featureFlagModule) || !settings.hidePreviewButton) {
    return;
  }

  featureFlagModule.setValueForFeatureFlag('tweetdeck_gryphon_beta_enabled', false);
  featureFlagModule.setValueForFeatureFlag('tweetdeck_gryphon_beta_bypass_enabled', false);
});
