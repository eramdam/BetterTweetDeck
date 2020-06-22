import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const updateTabTitle = makeBTDModule(({$}) => {
  const countTitle = (count: number) => `(${count}) TweetDeck`;
  const defaultTitle = 'TweetDeck';
  const unreadTitle = '(*) TweetDeck';

  $(document).on('uiReadStateChange uiMessageUnreadCount', (ev, data) => {
    const {read, count} = data;

    if (
      Number(count) > 0 &&
      document.title === defaultTitle &&
      document.title !== countTitle(count)
    ) {
      document.title = countTitle(count);
    }

    if (read === false && document.title === defaultTitle) {
      document.title = unreadTitle;
    }

    if (document.title !== defaultTitle && $('.is-new, .js-unread-count.is-visible').length === 0) {
      document.title = defaultTitle;
    }
  });
});
