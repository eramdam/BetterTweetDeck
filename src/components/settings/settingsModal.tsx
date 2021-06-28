import './settingsModal.css';

import {css, cx} from '@emotion/css';
import {isEqual} from 'lodash';
import React, {Fragment, useCallback, useMemo, useState} from 'react';
import {browser} from 'webextension-polyfill-ts';

import {isFirefox} from '../../helpers/browserHelpers';
import {getExtensionUrl, getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {OnSettingsUpdate} from '../../services/setupSettings';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {NewFeatureBadge} from './components/newFeatureBadge';
import {SettingsButton} from './components/settingsButton';
import {
  SettingsContent,
  SettingsFooter,
  SettingsHeader,
  SettingsModalWrapper,
  SettingsSidebar,
} from './components/settingsModalComponents';
import {SettingsTextInput} from './components/settingsTextInput';
import {SettingsSearchProvider} from './settingsContext';
import {makeSettingsMenu, MenuItem, SettingsMenuSectionsEnum} from './settingsMenu';
import {SettingsModalSearchContent} from './settingsModalContent';

interface SettingsModalProps {
  btdSettings: BTDSettings;
  onSettingsUpdate: OnSettingsUpdate;
}

const topbarIcon = getExtensionUrl('build/assets/icons/icon-32.png');
const topbarVersion = getExtensionVersion();

const defaultMenuSection = SettingsMenuSectionsEnum.GENERAL;

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.btdSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedId, setSelectedId] = useState<SettingsMenuSectionsEnum>(() => {
    try {
      const selectedIdFromUrl = new URL(window.location.href).searchParams.get('selectedId');
      const validSelectedId = Object.values(SettingsMenuSectionsEnum).find(
        (v) => selectedIdFromUrl
      );

      return validSelectedId || defaultMenuSection;
    } catch (e) {
      return defaultMenuSection;
    }
  });
  const [editorHasErrors, setEditorHasErrors] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const onSearchQueryChange = (newQuery: string) => {
    if (!newQuery) {
      setSelectedId(defaultMenuSection);
    } else {
      setSelectedId(SettingsMenuSectionsEnum.BLANK);
    }
    setSearchQuery(newQuery);
  };

  const makeOnSettingsChange = <T extends keyof BTDSettings>(key: T) => {
    return (val: BTDSettings[T]) => {
      setSettings((currentSettings) => {
        return {
          ...currentSettings,
          [key]: val,
        };
      });
      setIsDirty(true);
      setSaveError('');
    };
  };

  const updateSettings = useCallback(async () => {
    try {
      await onSettingsUpdate(settings);
      setIsDirty(false);
      maybeAskForTabsPermissions(settings);
    } catch (e) {
      setSaveError(String(e));
    }
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(
    () => !editorHasErrors && isDirty && !saveError,
    [editorHasErrors, isDirty, saveError]
  );

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

  const showSettingsLabel = useMemo(
    () => !isEqual(props.btdSettings, settings) || isDirty,
    [isDirty, props.btdSettings, settings]
  );

  const renderSearchIndex = () => {
    return renderMenuInInvisibleContainer(menu);
  };

  return (
    <SettingsSearchProvider settings={settings}>
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
                            setSearchQuery('');
                          }}>
                          <div className="text">
                            {item.label}{' '}
                            {item.badgeProps && <NewFeatureBadge {...item.badgeProps} />}
                          </div>
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
          <SettingsModalSearchContent
            selectedId={selectedId}
            menu={menu}
            searchQuery={searchQuery}
            settings={settings}
          />
        </SettingsContent>
        <SettingsFooter
          className={cx({
            visible: Boolean(canSave || showSettingsLabel || saveError),
          })}>
          <div>
            {saveError && (
              <div className="btd-settings-footer-label" style={{color: 'red'}}>
                {saveError}
              </div>
            )}
            {showSettingsLabel && !saveError && (
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
    </SettingsSearchProvider>
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
