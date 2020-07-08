import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const setupThemeAutoSwitch = makeBTDModule(({TD}) => {
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
  }

  const darkSchemeQl = window.matchMedia('(prefers-color-scheme: dark)');

  darkSchemeQl.addListener((ev) => applyTheme(ev.matches));

  applyTheme(darkSchemeQl.matches);
});
