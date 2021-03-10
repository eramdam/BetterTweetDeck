import {css} from '@emotion/css';
import {DateTime} from 'luxon';
import React, {Fragment, ReactNode} from 'react';

import {BTDScrollbarsMode} from '../../features/changeScrollbars';
import {BTDTimestampFormats} from '../../features/changeTimestampFormat';
import {BTDTweetActionsPosition} from '../../features/changeTweetActions';
import {BetterTweetDeckThemes} from '../../features/themeTweaks';
import {BTDUsernameFormat} from '../../features/usernameDisplay';
import {HandlerOf, Renderer} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {AvatarsShape} from './components/avatarsShape';
import {BooleanSettingsRow} from './components/booleanSettingRow';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {CustomAccentColor} from './components/customAccentColor';
import {BTDRadioSelectSettingsRow} from './components/radioSelectSettingsRow';
import {SettingsButton} from './components/settingsButton';
import {SettingsCssEditor} from './components/settingsCssEditor';
import {SettingsRow, SettingsRowTitle} from './components/settingsRow';
import {SettingsSeparator} from './components/settingsSeparator';
import {SettingsTextInput} from './components/settingsTextInput';
import {SettingsTimeFormatInput} from './components/settingsTimeFormatInput';
import {ThemeSelector} from './components/themeSelector';

interface MenuItem {
  id: string;
  label: ReactNode;
  render: Renderer;
}

export const makeSettingsMenu = (
  settings: BTDSettings,
  makeOnSettingsChange: <T extends keyof BTDSettings>(key: T) => (val: BTDSettings[T]) => void,
  setEditorHasErrors: HandlerOf<boolean>
): readonly MenuItem[] => {
  return [
    {
      id: 'general',
      label: getTransString('settings_general'),
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              settingsKey="useOriginalAspectRatioForSingleImages"
              initialValue={settings.useOriginalAspectRatioForSingleImages}
              alignToTheLeft
              onChange={makeOnSettingsChange('useOriginalAspectRatioForSingleImages')}>
              <Trans id="settings_use_original_aspect_ratio_images" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="showCardsInsideColumns"
              initialValue={settings.showCardsInsideColumns}
              alignToTheLeft
              onChange={makeOnSettingsChange('showCardsInsideColumns')}>
              <Trans id="settings_show_cards_inside_columns" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="badgesOnTopOfAvatars"
              initialValue={settings.badgesOnTopOfAvatars}
              alignToTheLeft
              onChange={makeOnSettingsChange('badgesOnTopOfAvatars')}>
              <Trans id="settings_show_profile_badges_on_top_of_avatars" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="collapseReadDms"
              initialValue={settings.collapseReadDms}
              alignToTheLeft
              onChange={makeOnSettingsChange('collapseReadDms')}>
              <Trans id="settings_collapse_read_dms" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="disableGifsInProfilePictures"
              initialValue={settings.disableGifsInProfilePictures}
              alignToTheLeft
              onChange={makeOnSettingsChange('disableGifsInProfilePictures')}>
              <Trans id="settings_freeze_gifs_in_profile_pictures" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="removeRedirectionOnLinks"
              initialValue={settings.removeRedirectionOnLinks}
              alignToTheLeft
              onChange={makeOnSettingsChange('removeRedirectionOnLinks')}>
              <Trans id="settings_remove_t_co_redirection_on_links" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="smallComposerButtons"
              initialValue={settings.smallComposerButtons}
              alignToTheLeft
              onChange={makeOnSettingsChange('smallComposerButtons')}>
              <Trans id="settings_make_buttons_smaller_in_the_composer" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              settingsKey="updateTabTitleOnActivity"
              initialValue={settings.updateTabTitleOnActivity}
              alignToTheLeft
              onChange={makeOnSettingsChange('updateTabTitleOnActivity')}>
              <Trans id="settings_reflect_new_tweets_and_dms_in_the_tabs_title" />
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'theme-tweaks',
      label: getTransString('settings_theme'),
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
                  label: getTransString('settings_switch_to_light_theme_when_os_is_in_light_mode'),
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
                {
                  label: getTransString('settings_scrollbar_default'),
                  value: BTDScrollbarsMode.DEFAULT,
                },
                {label: getTransString('settings_scrollbar_thin'), value: BTDScrollbarsMode.SLIM},
                {
                  label: getTransString('settings_scrollbar_hidden'),
                  value: BTDScrollbarsMode.HIDDEN,
                },
              ]}>
              <Trans id="settings_style_of_scrollbars" />
            </BTDRadioSelectSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'columns',
      label: <Trans id="settings_columns" />,
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="hideColumnIcons"
              initialValue={settings.hideColumnIcons}
              onChange={makeOnSettingsChange('hideColumnIcons')}>
              <Trans id="settings_hide_icons_on_top_of_columns" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showClearButtonInColumnsHeader"
              initialValue={settings.showClearButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showClearButtonInColumnsHeader')}>
              <Trans id="settings_show_and_quot_clear_and_quot_button_in_columns_and_apos_header" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showCollapseButtonInColumnsHeader"
              initialValue={settings.showCollapseButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showCollapseButtonInColumnsHeader')}>
              <Trans id="settings_show_collapse_button_in_columns_header" />
            </BooleanSettingsRow>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showRemoveButtonInColumnsHeader"
              initialValue={settings.showRemoveButtonInColumnsHeader}
              onChange={makeOnSettingsChange('showRemoveButtonInColumnsHeader')}>
              <Trans id="settings_show_delete_button_in_columns_header" />
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'tweets-display',
      label: <Trans id="settings_tweets_display" />,
      render: () => {
        return (
          <Fragment>
            <BooleanSettingsRow
              alignToTheLeft
              settingsKey="showLegacyReplies"
              initialValue={settings.showLegacyReplies}
              onChange={makeOnSettingsChange('showLegacyReplies')}>
              <Trans id="settings_use_old_style_of_replies" />
            </BooleanSettingsRow>
            <SettingsSeparator></SettingsSeparator>
            <BTDRadioSelectSettingsRow
              settingsKey="timestampStyle"
              initialValue={settings.timestampStyle}
              onChange={makeOnSettingsChange('timestampStyle')}
              fields={[
                {
                  label: getTransString('settings_timestamp_relative'),
                  value: BTDTimestampFormats.RELATIVE,
                },
                {
                  label: getTransString('settings_timestamp_custom'),
                  value: BTDTimestampFormats.CUSTOM,
                },
              ]}>
              <Trans id="settings_date_format" />
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
              <Trans id="settings_short_time_after_24h" />
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
              <SettingsRowTitle>
                <Trans id="settings_timestamp_presets" />
              </SettingsRowTitle>
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
                  <Trans id="settings_timestamp_preset_absolute" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('timestampStyle')(BTDTimestampFormats.CUSTOM);
                    makeOnSettingsChange('fullTimestampAfterDay')(true);
                    makeOnSettingsChange('timestampShortFormat')('hh:mm');
                    makeOnSettingsChange('timestampFullFormat')('MM/dd/yy hh:mm');
                  }}>
                  <Trans id="settings_timestamp_preset_absolute_us" />
                </SettingsButton>
              </div>
            </SettingsRow>
            <SettingsSeparator></SettingsSeparator>
            <BTDRadioSelectSettingsRow
              settingsKey="usernamesFormat"
              initialValue={settings.usernamesFormat}
              onChange={makeOnSettingsChange('usernamesFormat')}
              fields={[
                {
                  label: <Trans id="settings_fullname_username" />,
                  value: BTDUsernameFormat.DEFAULT,
                },
                {
                  label: <Trans id="settings_username_fullname" />,
                  value: BTDUsernameFormat.USER_FULL,
                },
                {label: <Trans id="settings_username" />, value: BTDUsernameFormat.USER},
                {label: <Trans id="settings_fullname" />, value: BTDUsernameFormat.FULL},
              ]}>
              <Trans id="settings_name_display_style" />
            </BTDRadioSelectSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'tweet-actions',
      label: <Trans id="settings_tweet_actions" />,
      render: () => {
        return (
          <Fragment>
            <BTDRadioSelectSettingsRow
              settingsKey="showTweetActionsOnHover"
              initialValue={settings.showTweetActionsOnHover}
              onChange={makeOnSettingsChange('showTweetActionsOnHover')}
              fields={[
                {label: getTransString('settings_actions_visibility_always'), value: false},
                {label: getTransString('settings_actions_visibility_on_hover'), value: true},
              ]}>
              <Trans id="settings_actions_visibility" />
            </BTDRadioSelectSettingsRow>
            <BTDRadioSelectSettingsRow
              settingsKey="tweetActionsPosition"
              initialValue={settings.tweetActionsPosition}
              onChange={makeOnSettingsChange('tweetActionsPosition')}
              fields={[
                {
                  label: getTransString('settings_actions_position_left'),
                  value: BTDTweetActionsPosition.LEFT,
                },
                {
                  label: getTransString('settings_actions_position_right'),
                  value: BTDTweetActionsPosition.RIGHT,
                },
              ]}>
              <Trans id="settings_position_of_actions" />
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
                  label: getTransString('settings_action_block_author'),
                },
                {
                  initialValue: settings.tweetActions.addMuteAction,
                  key: 'addMuteAction',
                  label: getTransString('settings_action_mute_author'),
                },
                {
                  initialValue: settings.tweetActions.addCopyMediaLinksAction,
                  key: 'addCopyMediaLinksAction',
                  label: getTransString('settings_action_copy_media_links'),
                },
                {
                  initialValue: settings.tweetActions.addDownloadMediaLinksAction,
                  key: 'addDownloadMediaLinksAction',
                  label: getTransString('settings_action_download_media'),
                },
              ]}>
              <Trans id="settings_additional_actions" />
            </CheckboxSelectSettingsRow>
            <SettingsRow
              disabled={!settings.tweetActions.addDownloadMediaLinksAction}
              className={css`
                grid-template-columns: 150px 1fr;

                input {
                  width: 80%;
                }
              `}>
              <SettingsRowTitle>
                <Trans id="settings_downloaded_filename_format" />
              </SettingsRowTitle>
              <SettingsTextInput
                value={settings.downloadFilenameFormat}
                onChange={makeOnSettingsChange('downloadFilenameFormat')}></SettingsTextInput>
            </SettingsRow>
            <SettingsRow
              disabled={!settings.tweetActions.addDownloadMediaLinksAction}
              className={css`
                align-items: flex-start;
              `}>
              <SettingsRowTitle>
                <Trans id="settings_filename_format_tokens" />
              </SettingsRowTitle>
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
                  <Trans id="settings_token_username_without" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{tweetId}}'
                    );
                  }}>
                  <Trans id="settings_token_tweet_id" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{fileName}}'
                    );
                  }}>
                  <Trans id="settings_token_filename" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{fileExtension}}'
                    );
                  }}>
                  <Trans id="settings_token_file_extension" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{year}}'
                    );
                  }}>
                  <Trans id="settings_token_year" /> ({formatDateTime('yyyy')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{day}}'
                    );
                  }}>
                  <Trans id="settings_token_day" /> ({formatDateTime('dd')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{month}}'
                    );
                  }}>
                  <Trans id="settings_token_month" /> ({formatDateTime('MM')})
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{minutes}}'
                    );
                  }}>
                  <Trans id="settings_token_minutes" />
                </SettingsButton>
                <SettingsButton
                  onClick={() => {
                    makeOnSettingsChange('downloadFilenameFormat')(
                      settings.downloadFilenameFormat + '{{seconds}}'
                    );
                  }}>
                  <Trans id="settings_token_seconds" />
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
                  label: getTransString('settings_menu_item_mute_hashtags'),
                },
                {
                  initialValue: settings.tweetMenuItems.addMuteSourceMenuItem,
                  key: 'addMuteSourceMenuItem',
                  label: getTransString('settings_menu_item_mute_source'),
                },
                {
                  initialValue: settings.tweetMenuItems.addRedraftMenuItem,
                  key: 'addRedraftMenuItem',
                  label: getTransString('settings_menu_item_redraft'),
                },
              ]}>
              <Trans id="settings_additional_tweet_menu_items" />
            </CheckboxSelectSettingsRow>
            <SettingsSeparator></SettingsSeparator>
            <BooleanSettingsRow
              settingsKey="replaceHeartsByStars"
              initialValue={settings.replaceHeartsByStars}
              onChange={makeOnSettingsChange('replaceHeartsByStars')}>
              <Trans id="settings_replace_hearts_by_stars" />
            </BooleanSettingsRow>
          </Fragment>
        );
      },
    },
    {
      id: 'custom-css',
      label: <Trans id="settings_custom_css" />,
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
};

function formatDateTime(format: string) {
  return DateTime.local().toFormat(format, {
    locale: 'en',
  });
}
