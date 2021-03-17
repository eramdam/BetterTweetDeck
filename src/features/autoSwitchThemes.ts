import {buildURLWithSearchParams} from '../helpers/networkHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {tweakTweetDeckTheme} from './themeTweaks';

export const setupThemeAutoSwitch = makeBTDModule((opts) => {
  const {jq, TD, settings} = opts;
  if (!settings.enableAutoThemeSwitch) {
    return;
  }

  jq(document).one('dataColumnsLoaded', () => {
    const html = document.querySelector('html');

    function applyTheme(matches: boolean) {
      if (!html) {
        return;
      }

      if (matches) {
        html.classList.add('dark');
        TD.storage.clientController.client.dictSet('settings', 'theme', 'dark');
      } else {
        html.classList.remove('dark');
        TD.storage.clientController.client.dictSet('settings', 'theme', 'light');
      }
      tweakTweetDeckTheme(opts);

      Array.from(document.querySelectorAll<HTMLIFrameElement>('.js-card-container iframe')).forEach(
        (cardIframe) => {
          const currentIframeUrl = cardIframe.src;

          const newCardIframeUrl = buildURLWithSearchParams(currentIframeUrl, {
            theme: matches ? 'tweetdeck-dark' : 'tweetdeck-light',
          });

          cardIframe.src = newCardIframeUrl;
        }
      );
    }

    const darkSchemeQl = window.matchMedia('(prefers-color-scheme: dark)');

    darkSchemeQl.addEventListener('change', (ev) => applyTheme(ev.matches));

    applyTheme(darkSchemeQl.matches);
  });
});
