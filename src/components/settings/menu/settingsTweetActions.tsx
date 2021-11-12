import {css} from '@emotion/css';
import React, {FC, Fragment} from 'react';

import {BTDTweetActionsPosition} from '../../../features/changeTweetActions';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {getTransString, Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {BTDRadioSelectSettingsRow} from '../components/radioSelectSettingsRow';
import {SettingsButton} from '../components/settingsButton';
import {SettingsRow, SettingsRowTitle} from '../components/settingsRow';
import {SettingsTextInput} from '../components/settingsTextInput';
import {SettingsTextInputWithAnnotation} from '../components/settingsTimeFormatInput';
import {formatDateTime, SettingsMenuSectionProps} from '../settingsComponents';
import {translationLanguages} from '../settingsTypes';

export const SettingsTweetActions: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;
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
          {
            initialValue: settings.requireConfirmationForTweetAction,
            key: 'requireConfirmationForTweetAction',
            label: getTransString('settings_require_confirmation_for_block_and_mute_actions'),
          },
        ]}>
        <Trans id="settings_additional_actions" />
      </CheckboxSelectSettingsRow>
      <SettingsRow
        disabled={!settings.tweetActions.addDownloadMediaLinksAction}
        className={css`
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
      <SettingsRow disabled={!settings.tweetActions.addDownloadMediaLinksAction}>
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
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            initialValue: settings.addFollowAction,
            key: 'addFollowAction',
            label: <Trans id="settings_action_follow_author" />,
          },
          {
            initialValue: settings.showAccountChoiceOnFollow,
            isDisabled: !settings.addFollowAction,
            key: 'showAccountChoiceOnFollow',
            label: <Trans id="settings_show_account_picker_follow" />,
          },
          {
            initialValue: settings.showFollowersCount,
            isDisabled: !settings.addFollowAction,
            key: 'showFollowersCount',
            label: <Trans id="settings_show_followers_count" />,
          },
        ]}>
        <Trans id="settings_follow_actions" />
      </CheckboxSelectSettingsRow>
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
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            introducedIn: '4',
            initialValue: settings.showAccountChoiceOnFavorite,
            key: 'showAccountChoiceOnFavorite',
            label: <Trans id="settings_show_account_picker_like" />,
            extraContent: (newSettings) => {
              return (
                newSettings && (
                  <SettingsTextInputWithAnnotation
                    isDisabled={!newSettings.showAccountChoiceOnFavorite}
                    value={newSettings.accountChoiceAllowList}
                    onChange={makeOnSettingsChange('accountChoiceAllowList')}
                    annotation={
                      <Trans id="settings_usernames_like_picker_allowlist" />
                    }></SettingsTextInputWithAnnotation>
                )
              );
            },
          },
          {
            initialValue: settings.replaceHeartsByStars,
            key: 'replaceHeartsByStars',
            label: <Trans id="settings_replace_hearts_by_stars" />,
          },
          {
            initialValue: settings.showLikeRTDogears,
            key: 'showLikeRTDogears',
            label: <Trans id="settings_show_like_rt_indicators_on_top_of_tweets" />,
          },
          {
            initialValue: settings.overrideTranslationLanguage,
            key: 'overrideTranslationLanguage',
            label: <Trans id="settings_override_translation_language" />,
            introducedIn: '4.1.0',
            extraContent: (newSettings) => {
              return (
                newSettings && (
                  <select
                    name="customTranslationLanguage"
                    value={newSettings.customTranslationLanguage}
                    disabled={!newSettings.overrideTranslationLanguage}
                    className={css`
                      width: 300px;
                    `}
                    onChange={(e) =>
                      makeOnSettingsChange('customTranslationLanguage')(e.target.value)
                    }>
                    <option value={''}>
                      {getTransString('settings_default_browsers_language')}
                    </option>
                    {translationLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                )
              );
            },
          },
        ]}>
        <Trans id="settings_misc" />
      </CheckboxSelectSettingsRow>
    </Fragment>
  );
};
