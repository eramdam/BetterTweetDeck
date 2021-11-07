import {Skyla, waitForTweetDeckToBeReady} from 'skyla';

import {applyCustomAccentColor} from './features/customAccentColor';
import {fixBaseLinks} from './features/fixBaseLinks';
import {maybeRemoveRedirection} from './features/removeRedirection';
import {useOriginalAspectRatio} from './features/useOriginalAspectRatio';
import {BTDUsernameFormat, maybeChangeUsernameFormat} from './features/usernameDisplay';
import {BTDModuleOptions, BTDSettingsAttribute} from './types/btdCommonTypes';
import {BTDSettings} from './types/btdSettingsTypes';

declare global {
  interface Window {
    Skyla: Skyla;
  }
}

(async () => {
  await waitForTweetDeckToBeReady(window);

  const skyla = new Skyla(window);
  window.Skyla = skyla;

  skyla.setupEntityObserver();

  const settings = getBTDSettings();

  if (!settings) {
    return;
  }

  const btdModuleOptions: BTDModuleOptions = {
    skyla,
    settings: {
      ...settings,
      useOriginalAspectRatioForSingleImages: true,
      usernamesFormat: BTDUsernameFormat.USER_FULL,
      removeRedirectionOnLinks: true,
    },
  };

  applyCustomAccentColor(btdModuleOptions);
  maybeChangeUsernameFormat(btdModuleOptions);
  useOriginalAspectRatio(btdModuleOptions);
  maybeRemoveRedirection(btdModuleOptions);
  fixBaseLinks(btdModuleOptions);
})();

/** Parses and returns the settings from the <script> tag as an object. */
function getBTDSettings() {
  const scriptElement = document.querySelector(`[${BTDSettingsAttribute}]`);
  const settingsAttribute = scriptElement && scriptElement.getAttribute(BTDSettingsAttribute);

  try {
    const raw = settingsAttribute && JSON.parse(settingsAttribute);
    return raw as BTDSettings;
  } catch (e) {
    return undefined;
  }
}
