import {css, cx} from '@emotion/css';
import React, {useCallback, useRef} from 'react';
import {useVirtual} from 'react-virtual';

import {isHTMLElement} from '../helpers/domHelpers';
import {MuteCatch} from '../helpers/muteHelpers';
import {Handler} from '../helpers/typeHelpers';

export const MuteCatchesModal = (props: {
  onRequestClose: Handler;
  catches: ReadonlyArray<MuteCatch>;
}) => {
  const users = props.catches;
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: users.length,
    parentRef,
    estimateSize: useCallback(() => 90, []),
  });

  return (
    <div
      className="ovl"
      style={{display: 'block'}}
      onClick={(e) => {
        if (isHTMLElement(e.target) && e.target.closest('.mdl')) {
          return;
        }

        props.onRequestClose();
      }}>
      <div
        className={cx(
          'mdl',
          css`
            padding: 20px !important;
          `
        )}>
        <div
          className={css`
            height: 100% !important;
            display: flex;
            flex-direction: column;
          `}>
          <p>This is the list of users that were caught by the different mutes you set</p>

          <div
            className={css`
              flex: 1;
              height: 500px;
              overflow: auto;
            `}
            ref={parentRef}>
            <div
              style={{
                height: `${rowVirtualizer.totalSize}px`,
                position: 'relative',
              }}>
              {rowVirtualizer.virtualItems.map((virtualRow) => {
                const caught = users[virtualRow.index];
                return (
                  <div
                    className={css`
                      padding: 10px 0;
                    `}
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}>
                    <div
                      className={css`
                        height: 70px;
                        border-radius: 10px;
                        padding: 0 8px;
                        display: grid;
                        grid-template-areas: 'avatar . header' 'avatar . filter';
                        grid-template-columns: auto 10px 1fr;
                        grid-template-rows: auto;
                        align-items: center;
                        box-shadow: inset 0 0 0 1px #ccd6dd;

                        .dark & {
                          box-shadow: inset 0 0 0 1px #000;
                        }

                        img {
                          grid-area: avatar;
                        }

                        .header {
                          grid-area: header;
                        }
                        .filter {
                          grid-area: filter;
                        }
                      `}>
                      <img src={caught.user.avatar} className="tweet-avatar" alt="" />
                      <span
                        className={css`
                          grid-area: header;

                          a {
                            color: inherit;

                            em {
                              font-style: normal;
                            }

                            strong {
                              margin-right: 4px;
                            }
                          }
                        `}>
                        <a
                          href={`https://twitter.com/${caught.user.screenName}`}
                          target={'_blank'}
                          rel="noreferrer noopener">
                          <strong>{caught.user.name}</strong>@{caught.user.screenName}
                        </a>{' '}
                        (id: {caught.user.id})
                      </span>
                      <span className="filter">
                        {caught.filterType} {caught.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
