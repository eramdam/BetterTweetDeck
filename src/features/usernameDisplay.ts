import {TweetDeckEntitiesType} from 'skyla';

import {hasProperty} from '../helpers/typeHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDUsernameFormat {
  /** `Fullname @username` (default) */
  DEFAULT = 'both',
  /** `@username Fullname` */
  USER_FULL = 'inverted',
  /** `@username` */
  USER = 'username',
  /** `Fullname */
  FULL = 'fullname',
}

export const maybeChangeUsernameFormat = makeBTDModule(({skyla, settings}) => {
  if (settings.usernamesFormat === BTDUsernameFormat.DEFAULT) {
    return;
  }

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

      switch (settings.usernamesFormat) {
        case BTDUsernameFormat.USER_FULL: {
          displayNameNode.innerHTML = usernameHtml.replace('@', '');
          usernameNode.innerHTML = displayNameHtml;
          break;
        }
        case BTDUsernameFormat.USER: {
          displayNameNode.innerHTML = usernameHtml.replace('@', '');
          usernameNode.innerHTML = '';
          break;
        }

        case BTDUsernameFormat.FULL: {
          usernameNode.innerHTML = '';
        }
      }
    }
  });
});
