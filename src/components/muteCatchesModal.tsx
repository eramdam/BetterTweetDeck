import {css, cx} from '@emotion/css';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useVirtual} from 'react-virtual';

import {isHTMLElement} from '../helpers/domHelpers';
import {MuteCatch} from '../helpers/muteHelpers';
import {Handler} from '../helpers/typeHelpers';

const baseHeight = 60;

export const MuteCatchesModal = (props: {
  onRequestClose: Handler;
  catches: ReadonlyArray<MuteCatch>;
  filtersKind: ReadonlyArray<string>;
}) => {
  const [selectedFilter, setFilter] = useState<string>('');
  const users = useMemo(() => {
    return props.catches.filter((caught) =>
      selectedFilter === '' ? true : caught.filterType === selectedFilter
    );
  }, [props.catches, selectedFilter]);
  const filterTypes = useMemo(() => props.filtersKind, [props.filtersKind]);
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtual({
    size: users.length,
    parentRef,
    estimateSize: useCallback(() => baseHeight, []),
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
            height: auto !important;
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
              display: flex;
              margin: 20px 0;
              align-items: center;
            `}>
            <span
              className={css`
                flex-grow: 1;
                flex-shrink: 0;
                margin-right: 10px;
              `}>
              Mute type:
            </span>
            <select
              name="mute-type"
              id="mute-type"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              defaultValue={selectedFilter}>
              <option value="">All</option>
              {filterTypes.map((filter) => {
                return (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                );
              })}
            </select>
          </div>

          <div
            className={css`
              flex: 1;
              flex-basis: 500px;
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
                        box-sizing: border-box;
                        padding: 8px 0;
                        border-radius: 10px;
                        padding-right: 8px;
                        display: grid;
                        grid-template-areas: 'avatar . header' 'avatar . filter';
                        grid-template-columns: auto 10px 1fr;
                        grid-template-rows: auto;
                        align-items: center;
                        border-top: 1px solid #ccd6dd;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        .dark & {
                          border-top: 1px solid #000;
                        }

                        img {
                          grid-area: avatar;
                          height: 100%;
                          border-radius: 50%;
                        }

                        .header {
                          grid-area: header;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                        .filter {
                          grid-area: filter;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        }
                      `}
                      style={{
                        height: baseHeight,
                      }}>
                      <img src={caught.user.avatar} alt="" />
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
          <div
            className={css`
              padding-top: 10px;
            `}>
            <button>Export</button>
          </div>
        </div>
      </div>
    </div>
  );
};
