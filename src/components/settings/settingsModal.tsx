import './settingsModal.css';

import {isEqual} from 'lodash';
import React, {Fragment, useCallback, useMemo, useState} from 'react';

import {getExtensionUrl, getExtensionVersion} from '../../helpers/webExtensionHelpers';
import {OnSettingsUpdate} from '../../inject/setupSettings';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {SettingsButton} from './components/settingsButton';
import {
  SettingsContent,
  SettingsFooter,
  SettingsHeader,
  SettingsModalWrapper,
  SettingsSidebar,
} from './components/settingsModalComponents';
import {makeSettingsMenu} from './settingsMenu';

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
  const [selectedId, setSelectedId] = useState('general');
  const [editorHasErrors, setEditorHasErrors] = useState(false);

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
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(() => !editorHasErrors && isDirty, [editorHasErrors, isDirty]);

  const menu = makeSettingsMenu(
    settings,
    makeOnSettingsChange,
    (newSettings) => {
      setSettings(newSettings);
      setIsDirty(true);
    },
    setEditorHasErrors
  );

  const renderSelectedPage = () => {
    const menuSection = menu
      .find((s) => s.items.find((s) => s.id === selectedId))
      ?.items.find((s) => s.id === selectedId);

    return menuSection?.render();
  };

  const showSettingsLabel = useMemo(() => !isEqual(props.btdSettings, settings), [
    props.btdSettings,
    settings,
  ]);

  return (
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
        {menu.map((section) => {
          return (
            <div key={section.id}>
              <div className="section-title">{section.title}</div>
              <ul>
                {section.items.map((item, index) => {
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
              <a href="https://twitter.com/@BetterTDeck" target="_blank" rel="noopener noreferrer">
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
          </ul>
        </div>
      </SettingsSidebar>
      <SettingsContent>{renderSelectedPage()}</SettingsContent>
      <SettingsFooter>
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
  );
};
