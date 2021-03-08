import './settingsModal.css';

import React, {useCallback, useMemo, useState} from 'react';

import {OnSettingsUpdate} from '../../inject/setupSettings';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {Trans} from '../trans';
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

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.btdSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
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

  const menu = makeSettingsMenu(settings, makeOnSettingsChange, setEditorHasErrors);

  return (
    <SettingsModalWrapper>
      <SettingsHeader>
        <Trans id="settings_title"></Trans>
      </SettingsHeader>
      <SettingsSidebar>
        <ul>
          {menu.map((item, index) => {
            return (
              <li
                key={item.id}
                className={(selectedIndex === index && 'active') || ''}
                onClick={() => {
                  setSelectedIndex(index);
                }}>
                <div className="text">{item.label}</div>
              </li>
            );
          })}
        </ul>
      </SettingsSidebar>
      <SettingsContent>{menu[selectedIndex].render()}</SettingsContent>
      <SettingsFooter>
        <div>
          <SettingsButton variant="primary" onClick={updateSettings} disabled={!canSave}>
            <Trans id="settings_save" />
          </SettingsButton>
        </div>
      </SettingsFooter>
    </SettingsModalWrapper>
  );
};
