import './settingsModal.css';

import {isEqual} from 'lodash';
import React, {Fragment, useCallback, useMemo, useState} from 'react';

import {BTDScrollbarsMode} from '../../features/changeScrollbars';
import {BTDTweetActionsPosition} from '../../features/changeTweetActions';
import {Handler, Renderer} from '../../helpers/typeHelpers';
import {OnSettingsUpdate} from '../../inject/setupSettings';
import {AbstractTweetDeckSettings} from '../../types/abstractTweetDeckSettings';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {CustomAccentColor} from './components/customAccentColor';
import {RadioSelectSettingsRow} from './components/radioSelectSettingsRow';
import {SettingsSeperator} from './components/settingsSeperator';
import {ThemeSelector} from './components/themeSelector';

interface SettingsModalProps {
  onOpenTDSettings: Handler;
  btdSettings: BTDSettings;
  tdSettings: AbstractTweetDeckSettings;
  onSettingsUpdate: OnSettingsUpdate;
}

interface MenuItem {
  id: string;
  label: string;
  renderContent: Renderer;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const {onSettingsUpdate, onOpenTDSettings} = props;
  const [btdSettings, setBtdSettings] = useState<BTDSettings>(props.btdSettings);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const makeOnSettingsChange = useCallback(
    <T extends keyof BTDSettings>(key: T) => {
      return (val: BTDSettings[T]) => {
        setBtdSettings((currentSettings) => {
          return {
            ...currentSettings,
            [key]: val,
          };
        });
        setIsDirty(true);
      };
    },
    [setBtdSettings, setIsDirty]
  );

  const updateSettings = useCallback(() => {
    onSettingsUpdate(btdSettings, {} as any);
    setIsDirty(false);
  }, [onSettingsUpdate, btdSettings]);

  const canSave = useMemo(() => !isEqual(props.btdSettings, btdSettings) && isDirty, [
    isDirty,
    props.btdSettings,
    btdSettings,
  ]);

  const menu: readonly MenuItem[] = [
    {
      id: 'general',
      label: 'General',
      renderContent: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="streamTweets"
              initialValue={true}
              alignToTheLeft
              onChange={console.log}>
              Stream Tweets in realtime
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showNotifications"
              initialValue={true}
              alignToTheLeft
              onChange={console.log}>
              Show notifications on startup
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="displaySensitiveMedia"
              initialValue={true}
              alignToTheLeft
              onChange={console.log}>
              Display media that may contain sensitive content
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="autoplayGifs"
              initialValue={true}
              alignToTheLeft
              onChange={console.log}>
              Autoplay GIFs
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="badgesOnTopOfAvatars"
              initialValue={btdSettings.badgesOnTopOfAvatars}
              alignToTheLeft
              onChange={makeOnSettingsChange('badgesOnTopOfAvatars')}>
              Show badges on top of avatars
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="collapseReadDms"
              initialValue={btdSettings.collapseReadDms}
              alignToTheLeft
              onChange={makeOnSettingsChange('collapseReadDms')}>
              Collapse read DMs
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="disableGifsInProfilePictures"
              initialValue={btdSettings.disableGifsInProfilePictures}
              alignToTheLeft
              onChange={makeOnSettingsChange('disableGifsInProfilePictures')}>
              Freeze GIFs in profile pictures
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'theme-tweaks',
      label: 'Interface',
      renderContent: () => (
        <Fragment>
          <CustomAccentColor
            initialValue={btdSettings.customAccentColor}
            onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
          <ThemeSelector
            initialValue={btdSettings.customDarkTheme}
            hasLightTheme={false}
            onChange={(value) => {
              if (value !== 'light') {
                makeOnSettingsChange('customDarkTheme')(value);
              } else {
                console.log('need to apply light theme');
              }
            }}></ThemeSelector>
          <AvatarsShape
            initialValue={btdSettings.avatarsShape}
            onChange={makeOnSettingsChange('avatarsShape')}></AvatarsShape>
          <RadioSelectSettingsRow
            settingsKey="scrollbarsMode"
            initialValue={btdSettings.scrollbarsMode}
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
      label: 'Columns',
      renderContent: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="hideColumnIcons"
              initialValue={btdSettings.hideColumnIcons}
              onChange={makeOnSettingsChange('hideColumnIcons')}>
              Hide icons on top of columns
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showClearButtonInColumnsHeader"
              initialValue={btdSettings.showClearButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showClearButtonInColumnsHeader')}>
              Show &quot;Clear&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showCollapseButtonInColumnsHeader"
              initialValue={btdSettings.showCollapseButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showCollapseButtonInColumnsHeader')}>
              Show &quot;Collapse&quot; button in columns&apos; header
            </BooleanSettingsRow>
            {/* <ColumnSettingsPreview settings={settings}></ColumnSettingsPreview> */}
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
            <RadioSelectSettingsRow
              settingsKey="tweetActionsPosition"
              initialValue={btdSettings.tweetActionsPosition}
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
                  ...btdSettings.tweetActions,
                  [key]: value,
                });
              }}
              fields={[
                {
                  initialValue: btdSettings.tweetActions.addBlockAction,
                  key: 'addBlockAction',
                  label: 'Block author',
                },
                {
                  initialValue: btdSettings.tweetActions.addMuteAction,
                  key: 'addMuteAction',
                  label: 'Mute author',
                },
                {
                  initialValue: btdSettings.tweetActions.addCopyMediaLinksAction,
                  key: 'addCopyMediaLinksAction',
                  label: 'Copy media links',
                },
                {
                  initialValue: btdSettings.tweetActions.addDownloadMediaLinksAction,
                  key: 'addDownloadMediaLinksAction',
                  label: 'Download media',
                },
              ]}>
              Additional actions
            </CheckboxSelectSettingsRow>
            <SettingsSeperator></SettingsSeperator>
            <BooleanSettingsRow
              settingsKey="showTweetActionsOnHover"
              initialValue={btdSettings.showTweetActionsOnHover}
              onChange={makeOnSettingsChange('showTweetActionsOnHover')}>
              Show tweet actions only on hover
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="replaceHeartsByStars"
              initialValue={btdSettings.replaceHeartsByStars}
              onChange={makeOnSettingsChange('replaceHeartsByStars')}>
              Replace hearts by stars
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
  ];

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Settings</header>
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
