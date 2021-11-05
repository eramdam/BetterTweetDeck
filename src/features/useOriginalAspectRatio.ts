import {makeBTDModule} from '../types/btdCommonTypes';

export const useOriginalAspectRatio = makeBTDModule(({skyla, settings}) => {
  if (!settings.useOriginalAspectRatioForSingleImages) {
    return;
  }

  skyla.updateFeatureSwitches({
    media_minimal_image_crop_enabled: {value: true},
    media_minimal_image_crop_maximum_aspect_ratio: {value: 4},
    media_minimal_image_crop_minimum_aspect_ratio: {value: 0.2},
  });
});
