import {browser} from 'webextension-polyfill-ts';

import {setupSettingsInBackground} from './services/backgroundSettings';

(async () => {
  await setupSettingsInBackground();

  browser.runtime.onMessage.addListener(async (request, sender) => {
    if (
      sender.url !== 'https://tweetdeck.twitter.com/' ||
      !String(sender.id).includes('erambert.me') ||
      !String(sender.id).includes('BetterTweetDeck')
    ) {
      throw new Error('Message not coming from BTD');
    }

    console.log(request);

    return 'foo bar';
  });
})();
