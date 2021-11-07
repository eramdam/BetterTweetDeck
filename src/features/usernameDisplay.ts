import _ from 'lodash';
import {
  isEntityFinderPositiveResult,
  isNotificationEntity,
  isTweetEntity,
  isUserEntity,
  TweetDeckEntitiesType,
} from 'skyla';

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
    if (!isEntityFinderPositiveResult(res)) {
      return;
    }

    if (res.type === TweetDeckEntitiesType.TWEET) {
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
      } else if (entity.quoted_status) {
        const quotedTweet = skyla.getTweetById(entity.quoted_status);
        if (!isTweetEntity(quotedTweet)) {
          return;
        }

        const quotedUser = skyla.getEntityById(quotedTweet.user, TweetDeckEntitiesType.USER);

        if (!isUserEntity(quotedUser)) {
          return;
        }

        const quotedUsernameNode = Array.from(
          res.node.querySelectorAll<HTMLSpanElement>('[dir] span')
        ).find((span) => {
          return span.innerText === `@${quotedUser.screen_name}`;
        });

        if (!quotedUsernameNode) {
          return;
        }

        const quotedUserDisplayNameNode = quotedUsernameNode
          .closest('[dir]')
          ?.parentElement?.previousElementSibling?.querySelector<HTMLSpanElement>(
            '[dir=auto] > span > span'
          );

        if (!quotedUserDisplayNameNode) {
          return;
        }

        const quotedDisplayNameHtml = String(quotedUserDisplayNameNode.innerHTML);
        const quotedUsernameHtml = String(quotedUsernameNode.innerHTML);

        switch (settings.usernamesFormat) {
          case BTDUsernameFormat.USER_FULL: {
            quotedUserDisplayNameNode.innerHTML = quotedUsernameHtml.replace('@', '');
            quotedUsernameNode.innerHTML = quotedDisplayNameHtml;
            break;
          }
          case BTDUsernameFormat.USER: {
            quotedUserDisplayNameNode.innerHTML = quotedUsernameHtml.replace('@', '');
            quotedUsernameNode.innerHTML = '';
            break;
          }

          case BTDUsernameFormat.FULL: {
            quotedUsernameNode.innerHTML = '';
          }
        }
      }
    } else if (res.type === TweetDeckEntitiesType.NOTIFICATION) {
      const entity = skyla.getEntityById(res.id, TweetDeckEntitiesType.NOTIFICATION);

      if (!isNotificationEntity(entity)) {
        return;
      }

      const sourceUserEntities = entity.message.entities.filter((e) => e.ref.user);
      const sourceUsers = _(sourceUserEntities)
        .map((e) => skyla.getEntityById(e.ref.user.id, TweetDeckEntitiesType.USER))
        .compact()
        .map((e) => isUserEntity(e) && e)
        .compact()
        .value();

      if (
        settings.usernamesFormat === BTDUsernameFormat.FULL ||
        settings.usernamesFormat === BTDUsernameFormat.DEFAULT
      ) {
        return;
      }

      sourceUsers.forEach((user) => {
        const textNode = res.node.querySelector<HTMLSpanElement>(
          `a[role="link"][href="/${user.screen_name}"] > span > span`
        );

        if (!textNode) {
          return;
        }

        textNode.innerText = user.screen_name;
      });
    }
  });
});
