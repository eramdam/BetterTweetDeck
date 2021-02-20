import './settingsModal.css';

import {css} from '@emotion/css';
import {DateTime} from 'luxon';
import React, {Fragment, ReactNode, useCallback, useMemo, useState} from 'react';

import {BTDScrollbarsMode} from '../../features/changeScrollbars';
import {BTDTimestampFormats} from '../../features/changeTimestampFormat';
import {BTDTweetActionsPosition} from '../../features/changeTweetActions';
import {BetterTweetDeckThemes} from '../../features/themeTweaks';
import {BTDUsernameFormat} from '../../features/usernameDisplay';
import {Renderer} from '../../helpers/typeHelpers';
import {OnSettingsUpdate} from '../../inject/setupSettings';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {Trans} from '../trans';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {CustomAccentColor} from './components/customAccentColor';
import {BTDRadioSelectSettingsRow} from './components/radioSelectSettingsRow';
import {SettingsButton} from './components/settingsButton';
import {SettingsCssEditor} from './components/settingsCssEditor';
import {
  SettingsContent,
  SettingsFooter,
  SettingsHeader,
  SettingsModalWrapper,
  SettingsSidebar,
} from './components/settingsModalComponents';
import {SettingsRow, SettingsRowTitle} from './components/settingsRow';
import {SettingsSeperator} from './components/settingsSeperator';
import {SettingsTextInput} from './components/settingsTextInput';
import {SettingsTimeFormatInput} from './components/settingsTimeFormatInput';
import {ThemeSelector} from './components/themeSelector';

interface SettingsModalProps {
  btdSettings: BTDSettings;
  onSettingsUpdate: OnSettingsUpdate;
}

interface MenuItem {
  id: string;
  label: ReactNode;
  render: Renderer;
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

  const menu: readonly MenuItem[] = [
    {
      id: 'general',
      label: 'General',
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="badgesOnTopOfAvatars"
              initialValue={settings.badgesOnTopOfAvatars}
              alignToTheLeft
              onChange={makeOnSettingsChange('badgesOnTopOfAvatars')}>
              Show profile badges on top of avatars
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="collapseReadDms"
              initialValue={settings.collapseReadDms}
              alignToTheLeft
              onChange={makeOnSettingsChange('collapseReadDms')}>
              Collapse read DMs
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="disableGifsInProfilePictures"
              initialValue={settings.disableGifsInProfilePictures}
              alignToTheLeft
              onChange={makeOnSettingsChange('disableGifsInProfilePictures')}>
              Freeze GIFs in profile pictures
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="removeRedirectionOnLinks"
              initialValue={settings.removeRedirectionOnLinks}
              alignToTheLeft
              onChange={makeOnSettingsChange('removeRedirectionOnLinks')}>
              Remove t.co redirection on links
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="smallComposerButtons"
              initialValue={settings.smallComposerButtons}
              alignToTheLeft
              onChange={makeOnSettingsChange('smallComposerButtons')}>
              Make buttons smaller in the composer
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="updateTabTitleOnActivity"
              initialValue={settings.updateTabTitleOnActivity}
              alignToTheLeft
              onChange={makeOnSettingsChange('updateTabTitleOnActivity')}>
              Reflect new tweets and DMs in the tab&apos;s title
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'theme-tweaks',
      label: 'Theme',
      render: () => {
        return (
          <Fragment>
            <CustomAccentColor
              initialValue={settings.customAccentColor}
              onChange={makeOnSettingsChange('customAccentColor')}></CustomAccentColor>
            <ThemeSelector
              initialValue={settings.theme}
              onChange={(value) => {
                if (value === 'light') {
                  makeOnSettingsChange('theme')(BetterTweetDeckThemes.LIGHT);
                } else {
                  makeOnSettingsChange('theme')(value);
                }
              }}></ThemeSelector>
            <CheckboxSelectSettingsRow
              onChange={(_key, value) => {
                makeOnSettingsChange('enableAutoThemeSwitch')(value);
              }}
              disabled={settings.theme === BetterTweetDeckThemes.LIGHT}
              fields={[
                {
                  initialValue: settings.enableAutoThemeSwitch,
                  key: 'enableAutoThemeSwitch',
                  label: 'Switch to light theme when OS is in light mode',
                },
              ]}></CheckboxSelectSettingsRow>
            <AvatarsShape
              initialValue={settings.avatarsShape}
              onChange={makeOnSettingsChange('avatarsShape')}></AvatarsShape>
            <BTDRadioSelectSettingsRow
              settingsKey="scrollbarsMode"
              initialValue={settings.scrollbarsMode}
              onChange={makeOnSettingsChange('scrollbarsMode')}
              fields={[
                {label: 'Default', value: BTDScrollbarsMode.DEFAULT},
                {label: 'Thin', value: BTDScrollbarsMode.SLIM},
                {label: 'Hidden', value: BTDScrollbarsMode.HIDDEN},
              ]}>
              Style of scrollbars
            </BTDRadioSelectSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'columns',
      label: 'Columns',
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="hideColumnIcons"
              initialValue={settings.hideColumnIcons}
              onChange={makeOnSettingsChange('hideColumnIcons')}>
              Hide icons on top of columns
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showClearButtonInColumnsHeader"
              initialValue={settings.showClearButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showClearButtonInColumnsHeader')}>
              Show &quot;Clear&quot; button in columns&apos; header
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showCollapseButtonInColumnsHeader"
              initialValue={settings.showCollapseButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showCollapseButtonInColumnsHeader')}>
              Show &quot;Collapse&quot; button in columns&apos; header
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'tweets-display',
      label: 'Tweets display',
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showLegacyReplies"
              initialValue={settings.showLegacyReplies}
              onChange={makeOnSettingsChange('showLegacyReplies')}>
              Use old style of replies (inline @mentions)
            </BooleanSettingsRow>
            <SettingsSeperator></SettingsSeperator>
            <BTDRadioSelectSettingsRow
              settingsKey="timestampStyle"
              initialValue={settings.timestampStyle}
              onChange={makeOnSettingsChange('timestampStyle')}
              fields={[
                {label: 'Relative', value: BTDTimestampFormats.RELATIVE},
                {label: 'Custom', value: BTDTimestampFormats.CUSTOM},
              ]}>
              Date format
            </BTDRadioSelectSettingsRow>
            <SettingsRow disabled={settings.timestampStyle === BTDTimestampFormats.RELATIVE}>
              <span></span>
              <SettingsTimeFormatInput
                value={settings.timestampShortFormat}
                onChange={makeOnSettingsChange('timestampShortFormat')}
                preview={formatDateTime(settings.timestampShortFormat)}></SettingsTimeFormatInput>
            </SettingsRow>
            <BooleanSettingsRow
              disabled={settings.timestampStyle === BTDTimestampFormats.RELATIVE}
              alignToTheLeft
              settingsKey="fullTimestampAfterDay"
              initialValue={settings.fullTimestampAfterDay}
              onChange={makeOnSettingsChange('fullTimestampAfterDay')}>
              Use a different date format after 24h
            </BooleanSettingsRow>
            <SettingsRow
              disabled={
                settings.timestampStyle === BTDTimestampFormats.RELATIVE ||
                !settings.fullTimestampAfterDay
              }>
              <span></span>
              <SettingsTimeFormatInput
                value={settings.timestampFullFormat}
                onChange={makeOnSettingsChange('timestampFullFormat')}
                preview={formatDateTime(settings.timestampFullFormat)}></SettingsTimeFormatInput>
            </SettingsRow>
            <SettingsRow
              className={css`
                align-items: flex-start;
              `}>
              <SettingsRowTitle>Presets</SettingsRowTitle>
              <div
                className={css`
                  display: inline-block;
                  margin-left: -10px;

                  > button {
                    margin-bottom: 10px;
                    margin-left: 10px;
                  }
                `}>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('timestampStyle')(BTDTimestampFormats.CUSTOM);
                    makeOnSettingsChange('fullTimestampAfterDay')(true);
                    makeOnSettingsChange('timestampShortFormat')('HH:mm');
                    makeOnSettingsChange('timestampFullFormat')('dd/MM/yy HH:mm');
                  }}>
                  Absolute
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('timestampStyle')(BTDTimestampFormats.CUSTOM);
                    makeOnSettingsChange('fullTimestampAfterDay')(true);
                    makeOnSettingsChange('timestampShortFormat')('hh:mm');
                    makeOnSettingsChange('timestampFullFormat')('MM/dd/yy hh:mm');
                  }}>
                  Absolute (U.S. style)
                </SettingsButton>
              </div>
            </SettingsRow>
            <SettingsSeperator></SettingsSeperator>
            <BTDRadioSelectSettingsRow
              settingsKey="usernamesFormat"
              initialValue={settings.usernamesFormat}
              onChange={makeOnSettingsChange('usernamesFormat')}
              fields={[
                {label: 'Fullname @username', value: BTDUsernameFormat.DEFAULT},
                {label: '@username fullname', value: BTDUsernameFormat.USER_FULL},
                {label: '@username', value: BTDUsernameFormat.USER},
                {label: 'Fullname', value: BTDUsernameFormat.FULL},
              ]}>
              Name display style
            </BTDRadioSelectSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'tweet-actions',
      label: 'Tweet actions',
      render: () => {
        return (
          <Fragment>
            <BTDRadioSelectSettingsRow
              settingsKey="showTweetActionsOnHover"
              initialValue={settings.showTweetActionsOnHover}
              onChange={makeOnSettingsChange('showTweetActionsOnHover')}
              fields={[
                {label: 'Always', value: false},
                {label: 'On hover', value: true},
              ]}>
              Actions visibility
            </BTDRadioSelectSettingsRow>
            <BTDRadioSelectSettingsRow
              settingsKey="tweetActionsPosition"
              initialValue={settings.tweetActionsPosition}
              onChange={makeOnSettingsChange('tweetActionsPosition')}
              fields={[
                {label: 'Left', value: BTDTweetActionsPosition.LEFT},
                {label: 'Right', value: BTDTweetActionsPosition.RIGHT},
              ]}>
              Position of actions
            </BTDRadioSelectSettingsRow>
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
            <SettingsRow
              disabled={!settings.tweetActions.addDownloadMediaLinksAction}
              className={css`
                grid-template-columns: 150px 1fr;

                input {
                  width: 80%;
                }
              `}>
              <SettingsRowTitle>Downloaded filename format</SettingsRowTitle>
              <SettingsTextInput
                value={settings.downloadFilenameFormat}
                onChange={makeOnSettingsChange('downloadFilenameFormat')}></SettingsTextInput>
            </SettingsRow>
            <SettingsRow
              disabled={!settings.tweetActions.addDownloadMediaLinksAction}
              className={css`
                align-items: flex-start;
              `}>
              <SettingsRowTitle>Filename format tokens</SettingsRowTitle>
              <div
                className={css`
                  display: inline-block;
                  margin-left: -10px;

                  > button {
                    margin-bottom: 10px;
                    margin-left: 10px;
                  }
                `}>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{postedUser}}'
                    );
                  }}>
                  username (without @)
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{tweetId}}'
                    );
                  }}>
                  Tweet ID
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{fileName}}'
                    );
                  }}>
                  Filename
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{fileExtension}}'
                    );
                  }}>
                  File extension
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{year}}'
                    );
                  }}>
                  Year ({formatDateTime('yyyy')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{day}}'
                    );
                  }}>
                  Day ({formatDateTime('dd')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{month}}'
                    );
                  }}>
                  Month ({formatDateTime('MM')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{minutes}}'
                    );
                  }}>
                  Minutes
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{seconds}}'
                    );
                  }}>
                  Seconds
                </SettingsButton>
              </div>
            </SettingsRow>
            <CheckboxSelectSettingsRow
              onChange={(key, value) => {
                makeOnSettingsChange('tweetMenuItems')({
                  ...settings.tweetMenuItems,
                  [key]: value,
                });
              }}
              fields={[
                {
                  initialValue: settings.tweetMenuItems.addMuteHashtagsMenuItems,
                  key: 'addMuteHashtagsMenuItems',
                  label: 'Mute #hashtags',
                },
                {
                  initialValue: settings.tweetMenuItems.addMuteSourceMenuItem,
                  key: 'addMuteSourceMenuItem',
                  label: "Mute tweet's source",
                },
                {
                  initialValue: settings.tweetMenuItems.addRedraftMenuItem,
                  key: 'addRedraftMenuItem',
                  label: 'Re-draft',
                },
              ]}>
              Additional tweet menu items
            </CheckboxSelectSettingsRow>
            <SettingsSeperator></SettingsSeperator>
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
      id: 'custom-css',
      label: 'Custom CSS',
      render: () => {
        return (
          <SettingsCssEditor
            onChange={makeOnSettingsChange('customCss')}
            onErrorChange={setEditorHasErrors}
            value={settings.customCss}></SettingsCssEditor>
        );
      },
    },
  ];

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
            Save
          </SettingsButton>
        </div>
      </SettingsFooter>
    </SettingsModalWrapper>
  );
};

function formatDateTime(format: string) {
  return DateTime.local().toFormat(format, {
    locale: 'en',
  });
}
