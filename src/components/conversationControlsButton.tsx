import {css, cx} from '@emotion/css';
import React, {FC, ReactNode, useCallback, useEffect, useRef, useState} from 'react';

import {TweetDeckClientGetter, TwitterConversationModes} from '../types/tweetdeckTypes';

export const ConversationControlsButton: FC<{
  jq: JQueryStatic;
  getClient: TweetDeckClientGetter;
  setValueForFeatureFlag: (flag: string, val: any) => void;
  graphqlRequest: (opts: any) => Promise<void>;
}> = (props) => {
  const {jq, getClient, setValueForFeatureFlag, graphqlRequest} = props;
  const [conversationMode, setConversationMode] = useState<TwitterConversationModes>(
    TwitterConversationModes.EVERYONE
  );
  const [hoveredItem, setHoveredItem] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const onTweetSent = useCallback(
    (_e: any, data: any) => {
      const accountKey = data.request.accountKey;
      const tweetId = data.response.id_str;
      const client = getClient(accountKey);
      const isReplyingToATweet = Boolean(data.response.in_reply_to_status_id_str);

      if (!client || conversationMode === TwitterConversationModes.EVERYONE || isReplyingToATweet) {
        return;
      }

      const accountState = client.oauth.account;
      setValueForFeatureFlag('graphql_detailed_url_format_enabled', false);
      graphqlRequest({
        queryId: 'hb1elGcj6769uT8qVYqtjw',
        operationName: 'ConversationControlChange',
        variables: {
          tweet_id: tweetId,
          mode: conversationMode,
        },
        account: accountState,
      }).then(() => {
        setValueForFeatureFlag('graphql_detailed_url_format_enabled', true);
      });
    },
    [conversationMode, getClient, graphqlRequest, setValueForFeatureFlag]
  );

  const onAppClick = (e: JQuery.ClickEvent<Document, undefined, any, any>) => {
    if (rootRef.current?.contains(e.target)) {
      return false;
    }

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    jq(document).on('dataTweetSent', onTweetSent);
    jq(document).on('click', '.js-app', onAppClick);

    return () => {
      jq(document).off('dataTweetSent', onTweetSent);
      jq(document).off('click', '.js-app', onAppClick);
    };
  }, [conversationMode, getClient, graphqlRequest, jq, onTweetSent, setValueForFeatureFlag]);

  return (
    <>
      <div
        ref={rootRef}
        className={cx(
          css`
            cursor: pointer;
            bottom: 6px;
            left: 50px;
            font-size: 12px;
            position: absolute;
            display: inline-block;
            color: #8899a6;

            &:hover {
              color: #616161 !important;
            }

            .-gif-hidden & {
              left: 13px;
            }

            .js-inline-reply &,
            .js-in-reply-to:not(.is-hidden) ~ .compose-text-container &,
            .js-compose-message-recipient-container:not(.is-hidden) ~ .compose-text-container & {
              display: none !important;
            }
          `,
          'js-show-tip'
        )}
        data-original-title={tipTextRenderer[conversationMode]}
        onClick={() => setIsDropdownOpen(true)}>
        {iconRenderer[conversationMode]}
      </div>
      {isDropdownOpen && (
        <div
          className={cx(
            'js-dropdown dropdown-menu br--6 padding-v--9 pos-r',
            css`
              left: 3.6% !important;
              margin-top: 31px !important;

              .caret {
                left: 59px !important;
              }

              .-gif-hidden & .caret {
                left: 22px !important;
              }
            `
          )}>
          <div className="caret">
            <span className="caret-outer"></span> <span className="caret-inner"></span>
          </div>
          <div className="js-dropdown-content">
            <ul
              className={css`
                & > li > a[data-action] {
                  display: grid !important;
                  grid-template-columns: auto 1fr auto !important;
                  grid-column-gap: 6px !important;
                  align-items: center !important;
                  padding: 8px 12px !important;
                }
                & > li.is-selected .icon-check {
                  color: white !important;
                }
              `}>
              <li>
                <b
                  className={cx(
                    'non-selectable-item',
                    css`
                      display: inline-block !important;
                      white-space: pre;
                    `
                  )}>
                  {`Choose who can reply to this Tweet.\nAnyone mentioned can always reply.`}
                </b>
              </li>
              <li className="drp-h-divider"></li>
              {Object.entries(TwitterConversationModes).map(([key, mode], index) => {
                return (
                  <li
                    key={key}
                    className={cx('is-selectable', {
                      'is-selected': hoveredItem === index + 1,
                    })}
                    onMouseEnter={() => setHoveredItem(index + 1)}
                    onMouseLeave={() => setHoveredItem(0)}
                    onClick={() => {
                      setConversationMode(mode);
                    }}>
                    <a href="#" data-action>
                      {iconRenderer[mode]}
                      {dropdownTextRenderer[mode]}
                      {conversationMode === mode && (
                        <i className="icon icon-check color-twitter-blue"></i>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

const iconRenderer: {[k in TwitterConversationModes]: ReactNode} = {
  [TwitterConversationModes.EVERYONE]: <i className="icon icon-earth"></i>,
  [TwitterConversationModes.FOLLOW]: <i className="icon icon-user-check"></i>,
  [TwitterConversationModes.MENTION]: <i className="icon icon-mention"></i>,
};
const dropdownTextRenderer: {[k in TwitterConversationModes]: ReactNode} = {
  [TwitterConversationModes.EVERYONE]: 'Everyone',
  [TwitterConversationModes.FOLLOW]: 'People you follow',
  [TwitterConversationModes.MENTION]: 'Only people you mention',
};
const tipTextRenderer: {[k in TwitterConversationModes]: string} = {
  [TwitterConversationModes.EVERYONE]: 'Everyone can reply',
  [TwitterConversationModes.FOLLOW]: 'People you follow can reply',
  [TwitterConversationModes.MENTION]: 'Only people you mention can reply',
};
