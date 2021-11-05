import {isTweetEntity, isUserEntity, TweetDeckEntitiesType} from 'skyla';

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
    if (hasProperty(res, 'type') && res.type === TweetDeckEntitiesType.TWEET) {
      const displayNameNode = res.node.querySelector('[role=link] [id] [dir=auto] .css-901oao');
      const entity = skyla.getEntityById(res.id, TweetDeckEntitiesType.TWEET);

      if (!isTweetEntity(entity)) {
        return;
      }

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

      if (entity.retweeted_status) {
        const sourceUser = skyla.getEntityById(entity.user, TweetDeckEntitiesType.USER);

        if (!isUserEntity(sourceUser)) {
          return;
        }

        const sourceUserNodeTarget = res.node.querySelector<HTMLSpanElement>(
          '[data-testid="socialContext"] > span > span'
        );

        if (!sourceUserNodeTarget) {
          return;
        }

        if (
          settings.usernamesFormat === BTDUsernameFormat.USER ||
          settings.usernamesFormat === BTDUsernameFormat.USER_FULL
        ) {
          sourceUserNodeTarget.innerText = sourceUser.screen_name;
        }
      }
    }
  });
});
