/* eslint-disable react/jsx-key */
import _ from 'lodash';
import React, {FC, Fragment} from 'react';

import {isFirefox, isSafari} from '../../../helpers/browserHelpers';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {BooleanSettingsRow} from '../components/booleanSettingRow';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {SettingsRow} from '../components/settingsRow';
import {SettingsTextInputWithAnnotation} from '../components/settingsTimeFormatInput';
import {SettingsMenuSectionProps, SettingsSmallText} from '../settingsComponents';
import {useSettingsSearch} from '../settingsContext';
import {reactElementToString} from '../settingsHelpers';

export const SettingsGeneral: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;
  const {renderAndAddtoIndex} = useSettingsSearch();
  const onBooleanCustomWidthChange = makeOnSettingsChange('useCustomColumnWidth');
  const customWidthField = (newSettings: BTDSettings) => (
    <Fragment>
      <BooleanSettingsRow
        alignToTheLeft
        ignoreInSearch
        settingsKey="useCustomColumnWidth"
        initialValue={newSettings.useCustomColumnWidth}
        onChange={onBooleanCustomWidthChange}>
        <Trans id="settings_use_a_custom_width_for_columns" />
      </BooleanSettingsRow>
      <SettingsRow disabled={!newSettings.useCustomColumnWidth}>
        <span></span>
        <SettingsTextInputWithAnnotation
          value={newSettings.customColumnWidthValue}
          onChange={makeOnSettingsChange('customColumnWidthValue')}
          annotation={
            <Trans id="settings_width_any_valid_css_value" />
          }></SettingsTextInputWithAnnotation>
      </SettingsRow>
    </Fragment>
  );

  const shareItem = (newSettings: BTDSettings) => (
    <CheckboxSelectSettingsRow
      ignoreSearch
      onChange={(key, value) => {
        makeOnSettingsChange(key as keyof BTDSettings)(value);
      }}
      fields={[
        {
          initialValue: newSettings.enableShareItem,
          key: 'enableShareItem',
          label: (
            <>
              <Trans id="settings_enable_share_item" />
              {isFirefox && (
                <SettingsSmallText>
                  <Trans id="settings_better_tweetdeck_ask_tabs" />
                </SettingsSmallText>
              )}
            </>
          ),
        },
        {
          initialValue: newSettings.shouldShortenSharedText,
          key: 'shouldShortenSharedText',
          isDisabled: !newSettings.enableShareItem,
          label: <Trans id="settings_shorten_the_shared_text" />,
        },
      ]}>
      <Trans id="settings_contextual_menu" />
    </CheckboxSelectSettingsRow>
  );

  return (
    <Fragment>
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            initialValue: settings.hideColumnIcons,
            key: 'hideColumnIcons',
            label: <Trans id="settings_hide_icons_on_top_of_columns" />,
          },
          {
            initialValue: settings.pauseColumnScrollingOnHover,
            key: 'pauseColumnScrollingOnHover',
            label: <Trans id="settings_pause_column_scrolling_on_hover" />,
          },
          {
            initialValue: settings.addSearchColumnsFirst,
            key: 'addSearchColumnsFirst',
            label: <Trans id="settings_add_search_columns_first_in_the_list" />,
          },
          {
            initialValue: settings.showClearButtonInColumnsHeader,
            key: 'showClearButtonInColumnsHeader',
            label: <Trans id="settings_show_clear_button_column" />,
          },
          {
            initialValue: settings.showCollapseButtonInColumnsHeader,
            key: 'showCollapseButtonInColumnsHeader',
            label: <Trans id="settings_show_collapse_button_in_columns_header" />,
          },
          {
            introducedIn: '4',
            initialValue: settings.showRemoveButtonInColumnsHeader,
            key: 'showRemoveButtonInColumnsHeader',
            label: <Trans id="settings_show_delete_button_in_columns_header" />,
          },
        ]}>
        <Trans id="settings_columns" />
      </CheckboxSelectSettingsRow>
      {renderAndAddtoIndex({
        keywords: [
          <Trans id="settings_use_a_custom_width_for_columns" />,
          <Trans id="settings_width_any_valid_css_value" />,
        ].map((t) => reactElementToString(t)),
        key: 'custom_width_column',
        render: customWidthField,
      })}
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            initialValue: settings.showLegacyReplies,
            key: 'showLegacyReplies',
            label: <Trans id="settings_use_old_style_of_replies" />,
          },
          {
            introducedIn: '4',
            initialValue: settings.useOriginalAspectRatioForSingleImages,
            key: 'useOriginalAspectRatioForSingleImages',
            label: <Trans id="settings_use_original_aspect_ratio_images" />,
          },
          {
            introducedIn: '4.0.1',
            initialValue: settings.useOriginalAspectRatioForSingleImagesInQuotedTweets,
            key: 'useOriginalAspectRatioForSingleImagesInQuotedTweets',
            label: <Trans id="settings_do_the_same_for_single_images_in_quoted_tweets" />,
            isDisabled: !settings.useOriginalAspectRatioForSingleImages,
          },
          {
            introducedIn: '4',
            initialValue: settings.useModernFullscreenImage,
            key: 'useModernFullscreenImage',
            label: <Trans id="settings_display_modern_fullscreen_images" />,
          },
          {
            introducedIn: '4',
            initialValue: settings.showCardsInsideColumns,
            key: 'showCardsInsideColumns',
            label: <Trans id="settings_show_cards_inside_columns" />,
          },
          {
            initialValue: settings.removeRedirectionOnLinks,
            key: 'removeRedirectionOnLinks',
            label: <Trans id="settings_remove_t_co_redirection_on_links" />,
          },
          {
            initialValue: settings.biggerEmoji,
            key: 'biggerEmoji',
            label: <Trans id="settings_make_emoji_bigger_in_tweets" />,
          },
        ]}>
        <Trans id="settings_tweet_content" />
      </CheckboxSelectSettingsRow>
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            initialValue: settings.collapseReadDms,
            key: 'collapseReadDms',
            label: <Trans id="settings_collapse_read_dms" />,
          },
          {
            initialValue: settings.badgesOnTopOfAvatars,
            key: 'badgesOnTopOfAvatars',
            label: <Trans id="settings_show_profile_badges_on_top_of_avatars" />,
          },
          {
            initialValue: settings.disableGifsInProfilePictures,
            key: 'disableGifsInProfilePictures',
            label: <Trans id="settings_freeze_gifs_in_profile_pictures" />,
          },
          {
            initialValue: settings.smallComposerButtons,
            key: 'smallComposerButtons',
            label: <Trans id="settings_make_buttons_smaller_in_the_composer" />,
          },
          {
            initialValue: settings.alwaysShowNumberOfCharactersLeft,
            key: 'alwaysShowNumberOfCharactersLeft',
            label: <Trans id="settings_always_characters_left" />,
          },
          {
            initialValue: settings.saveTweetedHashtags,
            key: 'saveTweetedHashtags',
            label: <Trans id="settings_save_tweeted_hashtags" />,
          },
          {
            initialValue: settings.updateTabTitleOnActivity,
            key: 'updateTabTitleOnActivity',
            label: <Trans id="settings_reflect_new_tweets_and_dms_in_the_tabs_title" />,
          },
        ]}>
        <Trans id="settings_misc" />
      </CheckboxSelectSettingsRow>
      {!isSafari &&
        renderAndAddtoIndex({
          keywords: _([
            <Trans id="settings_enable_share_item" />,
            isFirefox && <Trans id="settings_better_tweetdeck_ask_tabs" />,
            <Trans id="settings_shorten_the_shared_text" />,
            <Trans id="settings_contextual_menu" />,
          ])
            .compact()
            .map((t) => reactElementToString(t))
            .value(),
          key: 'share',
          render: shareItem,
        })}
    </Fragment>
  );
};
