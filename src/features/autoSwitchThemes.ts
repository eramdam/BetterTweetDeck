import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {tweakTweetDeckTheme} from './themeTweaks';

export const setupThemeAutoSwitch = makeBTDModule((opts) => {
  const {TD, settings} = opts;
  if (!settings.enableAutoThemeSwitch) {
    return;
  }
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
  }

  const darkSchemeQl = window.matchMedia('(prefers-color-scheme: dark)');

  darkSchemeQl.addListener((ev) => applyTheme(ev.matches));

  applyTheme(darkSchemeQl.matches);
});