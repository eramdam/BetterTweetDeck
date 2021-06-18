/* eslint-disable react/jsx-key */
import React, {FC, Fragment} from 'react';

import {isFirefox, isSafari} from '../../../helpers/browserHelpers';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {SettingsTextInputWithAnnotation} from '../components/settingsTimeFormatInput';
import {SettingsMenuSectionProps, SettingsSmallText} from '../settingsComponents';

export const SettingsGeneral: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;

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
            initialValue: settings.showClearAllButtonInSidebar,
            key: 'showClearAllButtonInSidebar',
            label: <Trans id="settings_show_a_clear_all_columns_button_in_the_sidebar" />,
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
          {
            initialValue: settings.useCustomColumnWidth,
            key: 'useCustomColumnWidth',
            label: <Trans id="settings_use_a_custom_width_for_columns" />,
            extraContent: (newSettings) =>
              newSettings && (
                <SettingsTextInputWithAnnotation
                  isDisabled={!newSettings.useCustomColumnWidth}
                  value={newSettings.customColumnWidthValue}
                  onChange={makeOnSettingsChange('customColumnWidthValue')}
                  annotation={
                    <Trans id="settings_width_any_valid_css_value" />
                  }></SettingsTextInputWithAnnotation>
              ),
          },
        ]}>
        <Trans id="settings_columns" />
      </CheckboxSelectSettingsRow>
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
            introducedIn: '4',
            initialValue: settings.showCardsInSmallMediaColumns,
            key: 'showCardsInSmallMediaColumns',
            isDisabled: !settings.showCardsInsideColumns,
            label: <Trans id="settings_also_show_cards_in_columns_with_small_media_size" />,
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
            initialValue: settings.disableGifsInProfilePictures,
            key: 'disableGifsInProfilePictures',
            label: <Trans id="settings_freeze_gifs_in_profile_pictures" />,
          },
          {
            initialValue: settings.updateTabTitleOnActivity,
            key: 'updateTabTitleOnActivity',
            label: <Trans id="settings_reflect_new_tweets_and_dms_in_the_tabs_title" />,
          },
        ]}>
        <Trans id="settings_misc" />
      </CheckboxSelectSettingsRow>
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
          {
            initialValue: settings.badgesOnTopOfAvatars,
            key: 'badgesOnTopOfAvatars',
            label: <Trans id="settings_show_profile_badges_on_top_of_avatars" />,
          },
          {
            isDisabled: !settings.badgesOnTopOfAvatars,
            initialValue: settings.verifiedBadges,
            key: 'verifiedBadges',
            label: <Trans id="settings_show_verified_badges" />,
          },
          {
            isDisabled: !settings.badgesOnTopOfAvatars,
            initialValue: settings.translatorBadges,
            key: 'translatorBadges',
            label: <Trans id="settings_show_translator_badges" />,
          },
          {
            isDisabled: !settings.badgesOnTopOfAvatars,
            initialValue: settings.mutualBadges,
            key: 'mutualBadges',
            label: <Trans id="settings_show_badges_on_mutuals" />,
            introducedIn: '4.2',
          },
        ]}>
        <Trans id="settings_badges" />
      </CheckboxSelectSettingsRow>
      {!isSafari && (
        <CheckboxSelectSettingsRow
          onChange={(key, value) => {
            makeOnSettingsChange(key as keyof BTDSettings)(value);
          }}
          fields={[
            {
              initialValue: settings.enableShareItem,
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
              initialValue: settings.shouldShortenSharedText,
              key: 'shouldShortenSharedText',
              isDisabled: !settings.enableShareItem,
              label: <Trans id="settings_shorten_the_shared_text" />,
            },
          ]}>
          <Trans id="settings_contextual_menu" />
        </CheckboxSelectSettingsRow>
      )}
    </Fragment>
  );
};
