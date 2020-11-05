import './settingsModal.css';

import {isEqual} from 'lodash';
import React, {Fragment, useCallback, useMemo, useState} from 'react';

import {BTDScrollbarsMode} from '../../features/changeScrollbars';
import {BTDTweetActionsPosition} from '../../features/changeTweetActions';
import {Handler, HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {ColumnSettingsPreview} from './components/columnSettingsPreview';
import {CustomAccentColor} from './components/customAccentColor';
import {CustomDarkTheme} from './components/customDarkTheme';
import {RadioSelectSettingsRow} from './components/radioSelectSettingsRow';

interface SettingsModalProps {
  onOpenTDSettings: Handler;
  settings: BTDSettings;
  onSettingsUpdate: HandlerOf<BTDSettings>;
}

interface MenuItem {
  id: string;
  label: string;
  renderContent: Renderer;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate, onOpenTDSettings} = props;
  const [settings, setSettings] = useState<BTDSettings>(props.settings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const makeOnSettingsChange = useCallback(
    <T extends keyof BTDSettings>(key: T) => {
      return (val: BTDSettings[T]) => {
        setSettings((currentSettings) => {
          return {
            ...currentSettings,
            [key]: val,
          };
        });
        setIsDirty(true);
      };
    },
    [setSettings, setIsDirty]
  );

  const updateSettings = useCallback(() => {
    onSettingsUpdate(settings);
    setIsDirty(false);
  }, [onSettingsUpdate, settings]);

  const canSave = useMemo(() => !isEqual(props.settings, settings) && isDirty, [
    isDirty,
    props.settings,
    settings,
  ]);

  const menu: readonly MenuItem[] = [
    {
      id: 'interface',
      label: 'Interface',
      renderContent: () => {
        return (
          <Fragment>
            <AvatarsShape
              initialValue={settings.avatarsShape}
              onChange={makeOnSettingsChange('avatarsShape')}></AvatarsShape>
            <BooleanSettingsRow
              settingsKey="badgesOnTopOfAvatars"
              initialValue={settings.badgesOnTopOfAvatars}
              onChange={makeOnSettingsChange('badgesOnTopOfAvatars')}>
              Show badges on top of avatars
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="collapseReadDms"
              initialValue={settings.collapseReadDms}
              onChange={makeOnSettingsChange('collapseReadDms')}>
              Collapse read DMs
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="disableGifsInProfilePictures"
              initialValue={settings.disableGifsInProfilePictures}
              onChange={makeOnSettingsChange('disableGifsInProfilePictures')}>
              Freeze GIFs in profile pictures
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="replaceHeartsByStars"
              initialValue={settings.replaceHeartsByStars}
              onChange={makeOnSettingsChange('replaceHeartsByStars')}>
              Replace hearts by stars
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'theme-tweaks',
      label: 'Theme tweaks',
      renderContent: () => (
        <Fragment>
          <CustomAccentColor
            initialValue={settings.customAccentColor}
            onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
          <CustomDarkTheme
            initialValue={settings.customDarkTheme}
            onChange={makeOnSettingsChange('customDarkTheme')}></CustomDarkTheme>
          <RadioSelectSettingsRow
            settingsKey="scrollbarsMode"
            initialValue={settings.scrollbarsMode}
            onChange={makeOnSettingsChange('scrollbarsMode')}
            fields={[
              {label: 'Default', value: BTDScrollbarsMode.DEFAULT},
              {label: 'Thin', value: BTDScrollbarsMode.SLIM},
              {label: 'Hidden', value: BTDScrollbarsMode.HIDDEN},
            ]}>
            Style of scrollbars
          </RadioSelectSettingsRow>
        </Fragment>
      ),
    },
    {
      id: 'columns',
      label: 'Column tweaks',
      renderContent: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="hideColumnIcons"
              initialValue={settings.hideColumnIcons}
              onChange={makeOnSettingsChange('hideColumnIcons')}>
              Hide icons on top of columns
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showClearButtonInColumnsHeader"
              initialValue={settings.showClearButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showClearButtonInColumnsHeader')}>
              Show &quot;Clear&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showCollapseButtonInColumnsHeader"
              initialValue={settings.showCollapseButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showCollapseButtonInColumnsHeader')}>
              Show &quot;Collapse&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <ColumnSettingsPreview settings={settings}></ColumnSettingsPreview>
          </Fragment>
        );
      },
    },
    {
      id: 'tweet-actions',
      label: 'Tweet actions',
      renderContent: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="showTweetActionsOnHover"
              initialValue={settings.showTweetActionsOnHover}
              onChange={makeOnSettingsChange('showTweetActionsOnHover')}>
              Show tweet actions only on hover
            </BooleanSettingsRow>
            <RadioSelectSettingsRow
              settingsKey="tweetActionsPosition"
              initialValue={settings.tweetActionsPosition}
              onChange={makeOnSettingsChange('tweetActionsPosition')}
              fields={[
                {label: 'Left', value: BTDTweetActionsPosition.LEFT},
                {label: 'Right', value: BTDTweetActionsPosition.RIGHT},
              ]}>
              Position of actions
            </RadioSelectSettingsRow>
            <CheckboxSelectSettingsRow
              onChange={(key, value) => {
                makeOnSettingsChange('tweetActions')({
                  ...settings.tweetActions,
                  [key]: value,
                });
              }}
              fields={[
                {
                  initialValue: settings.tweetActions.addBlockAction,
                  key: 'addBlockAction',
                  label: 'Block author',
                },
                {
                  initialValue: settings.tweetActions.addMuteAction,
                  key: 'addMuteAction',
                  label: 'Mute author',
                },
                {
                  initialValue: settings.tweetActions.addCopyMediaLinksAction,
                  key: 'addCopyMediaLinksAction',
                  label: 'Copy media links',
                },
                {
                  initialValue: settings.tweetActions.addDownloadMediaLinksAction,
                  key: 'addDownloadMediaLinksAction',
                  label: 'Download media',
                },
              ]}>
              Additional actions
            </CheckboxSelectSettingsRow>
          </Fragment>
        );
      },
    },
  ];

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Better TweetDeck Settings</header>
      <aside className="btd-settings-sidebar">
        <ul>
          {menu.map((item, index) => {
            return (
              <li
                key={item.id}
                className={(selectedIndex === index && 'active') || ''}
                onClick={() => {
                  setSelectedIndex(index);
                }}>
                <div className="icon"></div>
                <div className="text">{item.label}</div>
              </li>
            );
          })}
        </ul>
      </aside>
      <section className="btd-settings-content">{menu[selectedIndex].renderContent()}</section>
      <footer className="btd-settings-footer">
        <button className="btd-settings-button secondary" onClick={onOpenTDSettings}>
          Open TweetDeck settings
        </button>
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
