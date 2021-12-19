import {css, cx} from '@emotion/css';
import {saveAs} from 'file-saver';
import _ from 'lodash';
import {DateTime} from 'luxon';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useVirtual} from 'react-virtual';

import {
  decodeMuteReasonKey,
  encodeMuteReasonKey,
  formatMuteReason,
  MuteCatch,
  MuteReason,
} from '../features/mutesCatcher';
import {isHTMLElement} from '../helpers/domHelpers';
import {Handler} from '../helpers/typeHelpers';

const baseHeight = 60;

enum ExportTypes {
  SCREEN_NAME_LIST = 'SCREEN_NAME_LIST',
  ID_LIST = 'ID_LIST',
  TWITTER_BLOCK_CHAIN_EXPORT = 'TWITTER_BLOCK_CHAIN_EXPORT',
}
const exportTypes = [
  ExportTypes.TWITTER_BLOCK_CHAIN_EXPORT,
  ExportTypes.SCREEN_NAME_LIST,
  ExportTypes.ID_LIST,
];
const prettyExportTypes = {
  [ExportTypes.SCREEN_NAME_LIST]: 'Screen names (one per line)',
  [ExportTypes.ID_LIST]: 'User IDs (one per line)',
  [ExportTypes.TWITTER_BLOCK_CHAIN_EXPORT]: '"Twitter Block Chain" format',
};

function runExport(catches: ReadonlyArray<MuteCatch>, type: ExportTypes) {
  return {
    users: catches.map((caught) => {
      return {
        id: String(caught.user.id),
        name: caught.user.screenName,
      };
    }),
  };
}

interface MuteCatchesModalProps {
  onRequestClose: Handler;
  catches: ReadonlyArray<MuteCatch>;
  muteReasons: ReadonlyArray<MuteReason>;
}

export const MuteCatchesModal = (props: MuteCatchesModalProps) => {
  const [selectedMuteReason, setMuteReason] = useState<MuteReason | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExportType, setExportType] = useState<ExportTypes>(exportTypes[0]);
  const users = useMemo(() => {
    return props.catches
      .filter((caught) => {
        if (!selectedMuteReason) {
          return true;
        }

        return (
          caught.value === selectedMuteReason.value &&
          caught.filterType === selectedMuteReason.filterType
        );
      })
      .filter((caught) => {
        if (!searchQuery) {
          return true;
        }

        return (
          caught.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          caught.user.screenName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  }, [props.catches, searchQuery, selectedMuteReason]);
  const muteReasons = useMemo(() => props.muteReasons, [props.muteReasons]);
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
          <p>This is the list of accounts that were caught by the different mutes you set.</p>
          <div
            className={css`
              display: grid;
              align-items: center;
              grid-auto-flow: column;
              grid-template-columns: auto 1fr;
              grid-column-gap: 10px;
              margin: 20px 0;
            `}>
            <span>Reason:</span>
            <select
              name="mute-type"
              id="mute-type"
              onChange={(e) => {
                if (e.target.value === '') {
                  setMuteReason(undefined);
                } else {
                  setMuteReason(decodeMuteReasonKey(e.target.value));
                }
              }}
              defaultValue={(selectedMuteReason && encodeMuteReasonKey(selectedMuteReason)) || ''}>
              <option value="">All</option>
              {muteReasons.map((reason) => {
                return (
                  <option key={encodeMuteReasonKey(reason)} value={encodeMuteReasonKey(reason)}>
                    {formatMuteReason(reason)}
                  </option>
                );
              })}
            </select>

            <span>Search:</span>
            <input
              type="text"
              className="js-app-search-input search-input"
              placeholder="Search"
              defaultValue={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}></input>
          </div>
          <p
            className={css`
              margin-bottom: 10px !important;
            `}>
            {selectedMuteReason
              ? `Showing ${users.length} out of ${props.catches.length} ${
                  props.catches.length > 1 ? 'users' : 'user'
                }`
              : `Showing ${users.length} ${users.length > 1 ? 'users' : 'user'}`}
          </p>

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

                            &:hover {
                              color: inherit;
                            }

                            em {
                              font-style: normal;
                            }

                            strong {
                              margin-right: 4px;
                            }
                          }
                        `}>
                        <a
                          className="account-link"
                          href={`https://twitter.com/${caught.user.screenName}`}
                          target={'_blank'}
                          rel="noreferrer noopener">
                          <strong>{caught.user.name}</strong>
                          <span className="txt-mute">@{caught.user.screenName}</span>
                        </a>
                      </span>
                      <span className="filter">
                        <span className="">Reason: </span>
                        <span className="txt-mute">{formatMuteReason(caught)}</span>
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
            <div
              className={css`
                display: grid;
                align-items: center;
                grid-auto-flow: column;
                grid-template-columns: auto 1fr;
                grid-column-gap: 10px;
                margin: 20px 0;
              `}>
              <span>Export as:</span>
              <select
                name="export-type"
                id="export-type"
                onChange={(e) => {
                  setExportType(e.target.value as ExportTypes);
                }}
                defaultValue={selectedExportType}>
                {exportTypes.map((exportType) => {
                  return (
                    <option key={exportType} value={exportType}>
                      {prettyExportTypes[exportType]}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <button
                className="Button--primary"
                onClick={() => {
                  if (confirm(`Okay to export ${users.length} users?`)) {
                    saveAs(
                      new Blob([JSON.stringify(runExport(users, selectedExportType), null, 2)], {
                        type: 'application/json',
                      }),
                      `${_.kebabCase(selectedExportType)}-${DateTime.local().toFormat(
                        'y-LL-dd_HH.mm.ss'
                      )}.json`,
                      {
                        autoBom: true,
                      }
                    );
                  }
                }}>
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
