import {Skyla, TweetDeckEntitiesType, waitForTweetDeckToBeReady} from 'skyla';

import {hasProperty} from './helpers/typeHelpers';

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
  skyla.onEntityAdded((res) => {
    if (hasProperty(res, 'node') && res.type === TweetDeckEntitiesType.TWEET) {
      const displayNameNode = res.node.querySelector('[role=link] [id] [dir=auto] .css-901oao');

      if (!displayNameNode) {
        return;
      }

      const profileLinkNode = displayNameNode.closest('[id^="id_"]');

      if (!profileLinkNode) {
        return;
      }

      const profileLinkId = profileLinkNode.getAttribute('id');

      if (!profileLinkId) {
        return;
      }

      const usernameNode = res.node.querySelector(
        `[id="${profileLinkId}"] > div:last-child > [dir]`
      );
      if (!usernameNode) {
        return;
      }

      const displayNameHtml = String(displayNameNode.innerHTML);
      const usernameHtml = String(usernameNode.innerHTML);

      displayNameNode.innerHTML = usernameHtml.replace('@', '');
      usernameNode.innerHTML = displayNameHtml;
    }
  });
})();
