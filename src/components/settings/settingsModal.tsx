import './settingsModal.css';

import {css} from 'emotion';
import {isEqual} from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';

import {HandlerOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {BadgesOnTopOfAvatars} from './components/badgesOnTopOfAvatars';

export const settingsRowTitle = css`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;

  padding: 20px;
`;

export const settingsRow = css`
  display: flex;
  padding-top: 20px;
`;

interface SettingsModalProps {
  settings: BTDSettings;
  onSettingsUpdate: HandlerOf<BTDSettings>;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.settings);

  const onSettingsChange = useCallback(
    <T extends keyof BTDSettings>(key: T, val: BTDSettings[T]) => {
      setSettings((currentSettings) => {
        return {
          ...currentSettings,
          [key]: val,
        };
      });
    },
    []
  );

  const updateSettings = useCallback(() => {
    onSettingsUpdate(settings);
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(() => !isEqual(props.settings, settings), [props.settings, settings]);

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Better TweetDeck Settings</header>
      <aside className="btd-settings-sidebar">
        {/* <ul>
          {menu.map((item, index) => {
            return (
              <li
                key={item.id}
                className={(selectedIndex === index && 'active') || ''}
                onClick={() => {
                  setSelectedIndex(index);
                }}>
                <div className="icon"></div>
                <div className="text">{item.id}</div>
              </li>
            );
          })}
        </ul> */}
      </aside>
      <section className="btd-settings-content">
        <AvatarsShape
          initialValue={settings.avatarsShape}
          onChange={(val) => onSettingsChange('avatarsShape', val)}></AvatarsShape>
        <BadgesOnTopOfAvatars
          initialValue={settings.badgesOnTopOfAvatars}
          onChange={(val) => onSettingsChange('badgesOnTopOfAvatars', val)}></BadgesOnTopOfAvatars>
      </section>
      <footer className="btd-settings-footer">
        <button
          className="btd-settings-button primary"
          onClick={updateSettings}
          disabled={!canSave}>
          Save
        </button>
      </footer>
    </div>
  );
};
