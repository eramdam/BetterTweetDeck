import './settingsModal.css';

import {isEqual} from 'lodash';
import React, {useCallback, useMemo, useState} from 'react';

import {HandlerOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {ScrollbarsMode} from './components/scrollbarsMode';

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
      <aside className="btd-settings-sidebar"></aside>
      <section className="btd-settings-content">
        <AvatarsShape
          initialValue={settings.avatarsShape}
          onChange={(val) => onSettingsChange('avatarsShape', val)}></AvatarsShape>
        <BooleanSettingsRow
          id="badgesOnTopOfAvatars"
          initialValue={settings.badgesOnTopOfAvatars}
          onChange={(val) => onSettingsChange('badgesOnTopOfAvatars', val)}>
          Show badges on top of avatars:
        </BooleanSettingsRow>
        <BooleanSettingsRow
          id="collapseReadDms"
          initialValue={settings.collapseReadDms}
          onChange={(val) => onSettingsChange('collapseReadDms', val)}>
          Collapse read DMs:
        </BooleanSettingsRow>
        <BooleanSettingsRow
          id="disableGifsInProfilePictures"
          initialValue={settings.disableGifsInProfilePictures}
          onChange={(val) => onSettingsChange('disableGifsInProfilePictures', val)}>
          Freeze GIFs in profile pictures:
        </BooleanSettingsRow>
        <BooleanSettingsRow
          id="replaceHeartsByStars"
          initialValue={settings.replaceHeartsByStars}
          onChange={(val) => onSettingsChange('replaceHeartsByStars', val)}>
          Replace hearts by stars:
        </BooleanSettingsRow>
        <ScrollbarsMode></ScrollbarsMode>
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
