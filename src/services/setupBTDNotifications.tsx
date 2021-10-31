import {css, cx} from '@emotion/css';
import {AnimatePresence, motion} from 'framer-motion';
import _, {uniqBy} from 'lodash';
import React, {ReactNode, useLayoutEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import * as Icon from 'react-feather';

import {listenToInternalBTDMessage, sendInternalBTDMessage} from '../helpers/communicationHelpers';
import {Handler} from '../helpers/typeHelpers';
import {getExtensionVersion} from '../helpers/webExtensionHelpers';
import {BTDMessageOriginsEnum, BTDMessages, BTDNotificationTypes} from '../types/btdMessageTypes';

const notificationTextStyle = css`
  color: white;
  text-shadow: rgba(0, 0, 0, 0.28) 0px 2px 2px;
`;

const notificationStyles = css`
  display: grid;
  grid-template-areas:
    'icon . body'
    '. . buttons';
  grid-template-columns: auto 10px 1fr;
  grid-auto-rows: auto;
  padding: 14px 18px;
  background-image: none;
  color: black;
  border-radius: 10px;
  background-image: linear-gradient(0deg, rgb(0, 160, 251) 47%, rgb(0, 203, 252) 100%);
  box-shadow: rgba(0, 0, 0, 0.38) 0 2px 14px;
  grid-row-gap: 16px;
  width: 370px;
`;

const notificationIcon = css`
  grid-area: icon;
  color: white;
  filter: drop-shadow(rgba(0, 0, 0, 0.28) 0px 2px 2px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  > svg {
    width: 20px;
    height: 20px;
    margin-top: 3px;
  }
`;

const notificationBody = css`
  grid-area: body;
  font-size: 14px;
  line-height: 22px;
`;

const notificationButton = css`
  border-radius: 100px;
  font-size: 11px;
  font-weight: 500;
  outline: none;
  border: 1px solid;
  padding: 3px 10px;
  cursor: pointer;
  text-decoration: none !important;
  color: white;
  text-transform: uppercase;

  &.primary {
    background-color: white;
    border-color: white;
    color: #1da1f2;

    &:hover {
      background-color: rgba(255, 255, 255, 0.8);
      border-color: rgba(255, 255, 255, 0.8);
      color: #1da1f2;
      text-decoration: none;
    }
  }

  &.secondary {
    background-color: transparent;
    border-color: transparent;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const notificationsButtonGroup = css`
  display: flex;
  grid-area: buttons;
`;

interface NotificationState {
  type: BTDNotificationTypes;
}

interface NotificationProps {
  type: BTDNotificationTypes;
  icon: ReactNode;
  title: string;
  body: string;
  actions: {
    dismissLabel: string;
    actionLabel: string;
    onAction?: Handler;
    href?: string;
  };
}

const Notifications = () => {
  const [btdNotifications, setNotifications] = useState<ReadonlyArray<NotificationState>>([]);

  const addNotification = (notif: NotificationState) => {
    setNotifications((prev) => uniqBy([notif, ...prev], (n) => n.type));
  };
  const removeNotification = (type: BTDNotificationTypes) => {
    setNotifications((prev) => {
      return prev.filter((n) => n.type !== type);
    });
  };

  useLayoutEffect(() => {
    listenToInternalBTDMessage(
      BTDMessages.NOTIFICATION,
      BTDMessageOriginsEnum.CONTENT,
      async (ev) => {
        if (ev.data.name !== BTDMessages.NOTIFICATION) {
          return;
        }

        addNotification({type: ev.data.payload.type});
      }
    );
  }, []);

  function getNotificationProps(notification: NotificationState): NotificationProps | undefined {
    if (notification.type === BTDNotificationTypes.FOLLOW_PROMPT) {
      return {
        type: notification.type,
        title: 'Follow @BetterTDeck',
        body: 'Do you want to follow Better TweetDeck on Twitter for news, support and tips?',
        actions: {
          dismissLabel: 'No thanks',
          actionLabel: 'Sure!',
          onAction: () => {
            sendInternalBTDMessage({
              name: BTDMessages.PROMPT_FOLLOW,
              origin: BTDMessageOriginsEnum.CONTENT,
              isReponse: false,
              payload: {},
            });
          },
        },
        icon: <Icon.UserPlus />,
      };
    }

    if (notification.type === BTDNotificationTypes.UPDATE) {
      return {
        type: notification.type,
        title: 'Update',
        body: `Better TweetDeck has been updated to ${getExtensionVersion()}!`,
        actions: {
          dismissLabel: 'Got it',
          actionLabel: 'See changes',
          href: `https://github.com/eramdam/BetterTweetDeck/releases/tag/${getExtensionVersion()}`,
        },
        icon: <Icon.Bell />,
      };
    }

    return undefined;
  }

  return (
    <div
      className={css`
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20px;
        z-index: 999;
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
      `}>
      <AnimatePresence>
        {_(btdNotifications)
          .map((notification) => getNotificationProps(notification))
          .compact()
          .map((notification) => {
            return (
              <motion.div
                layout
                className={notificationStyles}
                initial={{opacity: 0, translateY: '100%'}}
                animate={{opacity: 1, translateY: 0}}
                exit={{opacity: 0}}
                key={notification.type}>
                <div className={notificationIcon}>{notification.icon}</div>
                <div
                  style={{gridArea: 'body'}}
                  className={cx(notificationTextStyle, notificationBody)}>
                  {notification.body}
                </div>
                <div className={notificationsButtonGroup}>
                  <a
                    className={cx(notificationButton, 'primary')}
                    href={notification.actions.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(ev) => {
                      if (notification.actions.onAction) {
                        ev.preventDefault();
                        notification.actions.onAction();
                      }
                      removeNotification(notification.type);
                    }}>
                    {notification.actions.actionLabel}
                  </a>
                  <div
                    className={cx(notificationButton, 'secondary')}
                    onClick={() => removeNotification(notification.type)}>
                    {notification.actions.dismissLabel}
                  </div>
                </div>
              </motion.div>
            );
          })
          .value()}
      </AnimatePresence>
    </div>
  );
};

export function setupBTDNotifications() {
  ReactDOM.render(<Notifications />, document.getElementById('btd-notifications-root'));
}
