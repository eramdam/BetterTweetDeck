import './settingsModal.css';

import {css, cx} from '@emotion/css';
import {isEqual, noop} from 'lodash';
import React, {Fragment, useCallback, useEffect, useMemo, useState} from 'react';
import {browser} from 'webextension-polyfill-ts';

import {isFirefox} from '../../helpers/browserHelpers';
import {getExtensionUrl, getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {OnSettingsUpdate} from '../../services/setupSettings';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {SettingsButton} from './components/settingsButton';
import {
  SettingsContent,
  SettingsFooter,
  SettingsHeader,
  SettingsModalWrapper,
  SettingsSidebar,
} from './components/settingsModalComponents';
import {SettingsRow, SettingsRowTitle} from './components/settingsRow';
import {SettingsTextInput} from './components/settingsTextInput';
import {SettingsSearchContext, useSettingsSearch} from './settingsContext';
import {makeSettingsMenu, MenuItem} from './settingsMenu';

interface SettingsModalProps {
  btdSettings: BTDSettings;
  onSettingsUpdate: OnSettingsUpdate;
}

const topbarIcon = getExtensionUrl('build/assets/icons/icon-32.png');
const topbarVersion = getExtensionVersion();

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.btdSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedId, setSelectedId] = useState(() => {
    try {
      const selectedIdFromUrl = new URL(window.location.href).searchParams.get('selectedId');

      return selectedIdFromUrl || 'general';
    } catch (e) {
      return 'general';
    }
  });
  const [editorHasErrors, setEditorHasErrors] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const {renderSearchResults, stopIndexing} = useSettingsSearch();

  const onSearchQueryChange = (newQuery: string) => {
    if (!newQuery) {
      setSelectedId('general');
    } else {
      setSelectedId('');
    }
    setSearchQuery(newQuery);
  };

  useEffect(() => {
    stopIndexing();
  }, [stopIndexing]);

  const makeOnSettingsChange = <T extends keyof BTDSettings>(key: T) => {
    return (val: BTDSettings[T]) => {
      setSettings((currentSettings) => {
        return {
          ...currentSettings,
          [key]: val,
        };
      });
      setIsDirty(true);
    };
  };

  const updateSettings = useCallback(() => {
    onSettingsUpdate(settings);
    setIsDirty(false);
    maybeAskForTabsPermissions(settings);
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(() => !editorHasErrors && isDirty, [editorHasErrors, isDirty]);

  const menu = useMemo(() => {
    return makeSettingsMenu(
      settings,
      makeOnSettingsChange,
      (newSettings) => {
        setSettings(newSettings);
        setIsDirty(true);
      },
      setEditorHasErrors
    );
  }, [settings]);

  const renderSelectedPage = () => {
    const menuSection = menu
      .find((s) => s.items.find((s) => s.id === selectedId))
      ?.items.find((s) => s.id === selectedId);

    return menuSection?.render();
  };

  const showSettingsLabel = useMemo(() => !isEqual(props.btdSettings, settings) || isDirty, [
    isDirty,
    props.btdSettings,
    settings,
  ]);

  const renderSettingsContent = () => {
    if (!searchQuery) {
      return renderSelectedPage();
    }

    return (
      <SettingsRow>
        <SettingsRowTitle
          className={css`
            font-size: 24px;
          `}>
          Search results
        </SettingsRowTitle>
        <div
          className={css`
            > div {
              padding-left: 20px;
            }
          `}>
          {renderSearchResults(searchQuery)}
        </div>
      </SettingsRow>
    );
  };

  const renderSearchIndex = () => {
    return renderMenuInInvisibleContainer(menu);
  };

  return (
    <>
      {renderSearchIndex()}
      <SettingsModalWrapper>
        <SettingsHeader>
          <span className="icon">
            <img src={topbarIcon} alt={getTransString('settings_title')} />
          </span>
          <span className="title">
            <Trans id="settings_title"></Trans>
          </span>
          <small className="version">{topbarVersion}</small>
        </SettingsHeader>
        <SettingsSidebar>
          <div>
            <div className="section-title">Search</div>
            <div
              style={{
                padding: '10px 16px',
                display: 'flex',
              }}>
              <SettingsTextInput
                className={css`
                  width: 100%;
                  --twitter-input-border-color: rgba(255, 255, 255, 0.2);
                `}
                placeholder="Search settings"
                onChange={onSearchQueryChange}
                value={searchQuery}></SettingsTextInput>
            </div>
          </div>
          {menu.map((section) => {
            return (
              <div key={section.id}>
                <div className="section-title">{section.title}</div>
                <ul>
                  {section.items.map((item) => {
                    return (
                      <Fragment key={section.id + '-' + item.id}>
                        <li
                          className={(selectedId === item.id && 'active') || ''}
                          onClick={() => {
                            setSelectedId(item.id);
                          }}>
                          <div className="text">{item.label}</div>
                        </li>
                      </Fragment>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <div>
            <div className="section-title">
              <Trans id="settings_links" />
            </div>
            <ul>
              <li>
                <a
                  href="https://twitter.com/@BetterTDeck"
                  target="_blank"
                  rel="noopener noreferrer">
                  @BetterTDeck
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/eramdam/BetterTweetDeck"
                  target="_blank"
                  rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://better.tw" target="_blank" rel="noopener noreferrer">
                  <Trans id="settings_website" />
                </a>
              </li>
              <li>
                <a href="https://better.tw/releases" target="_blank" rel="noopener noreferrer">
                  <Trans id="settings_changelog" />
                </a>
              </li>
            </ul>
          </div>
        </SettingsSidebar>
        <SettingsContent>
          <SettingsSearchContext.Provider
            value={{
              addToIndex: noop,
              stopIndexing: () => {},
              renderSearchResults: () => null,
            }}>
            {renderSettingsContent()}
          </SettingsSearchContext.Provider>
        </SettingsContent>
        <SettingsFooter
          className={cx({
            visible: canSave || showSettingsLabel,
          })}>
          <div>
            {showSettingsLabel && (
              <div className="btd-settings-footer-label">
                <Trans id="settings_footer_label" />
              </div>
            )}
            <SettingsButton variant="primary" onClick={updateSettings} disabled={!canSave}>
              <Trans id="settings_save" />
            </SettingsButton>
          </div>
        </SettingsFooter>
      </SettingsModalWrapper>
    </>
  );
};

async function maybeAskForTabsPermissions(newSettings: BTDSettings) {
  if (!newSettings.enableShareItem) {
    return;
  }
  if (!isFirefox) {
    return;
  }

  return browser.permissions.request({
    permissions: ['tabs'],
  });
}

function renderMenuInInvisibleContainer(menu: ReadonlyArray<MenuItem>) {
  return (
    <div
      id="Invisible"
      className={css`
        height: 1px;
        width: 1px;
        position: absolute;
        left: -100000px;
        opacity: 0;
        overflow: hidden;
        clip: rect(0 0 0 0);
      `}>
      {menu.map((section) => {
        return (
          <Fragment key={section.id}>
            {section.items.map((item) => {
              return <Fragment key={item.id}>{item.render()}</Fragment>;
            })}
          </Fragment>
        );
      })}
    </div>
  );
}
