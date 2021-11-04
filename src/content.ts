import {injectInTD} from './services/injectInTD';

(async () => {
  const hasNewTweetDeck = document.querySelectorAll('script[src*="tweetdeck-web"]').length === 0;

  if (!hasNewTweetDeck) {
    console.debug('Better TweetDeck aborted loading on legacy TweetDeck');
    return;
  }

  // Inject some scripts.
  injectInTD();
})();
