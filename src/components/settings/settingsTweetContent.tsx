import React, {FC, Fragment} from 'react';

import {BTDSettings} from '../../types/btdSettingsTypes';
import {getTransString, Trans} from '../trans';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {SettingsCheckboxSelectProps} from './components/settingsCheckboxSelect';
import {SettingsTextareaWithAnnotation} from './components/settingsTextInputWithAnnotation';
import {SettingsMenuSectionProps, SettingsSmallText} from './settingsComponents';
import {settingsIndent} from './settingsStyles';

export const SettingsTweetContent: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;

  const onChange: SettingsCheckboxSelectProps['onChange'] = (key, value) => {
    makeOnSettingsChange(key as keyof BTDSettings)(value);
  };

  return (
    <Fragment>
      <CheckboxSelectSettingsRow
        onChange={onChange}
        fields={[
          {
            introducedIn: '4',
            initialValue: settings.useModernFullscreenImage,
            key: 'useModernFullscreenImage',
            label: <Trans id="settings_display_modern_fullscreen_images" />,
          },
          {
            introducedIn: '4',
            initialValue: settings.useOriginalAspectRatioForSingleImages,
            key: 'useOriginalAspectRatioForSingleImages',
            label: <Trans id="settings_use_original_aspect_ratio_images" />,
          },
          {
            introducedIn: '4.0.1',
            shouldIndent: true,
            initialValue: settings.useOriginalAspectRatioForSingleImagesInQuotedTweets,
            key: 'useOriginalAspectRatioForSingleImagesInQuotedTweets',
            label: <Trans id="settings_do_the_same_for_single_images_in_quoted_tweets" />,
            isDisabled: !settings.useOriginalAspectRatioForSingleImages,
          },
        ]}>
        <Trans id="settings_images" />
      </CheckboxSelectSettingsRow>
      <CheckboxSelectSettingsRow
        onChange={onChange}
        fields={[
          {
            initialValue: settings.removeRedirectionOnLinks,
            key: 'removeRedirectionOnLinks',
            label: <Trans id="settings_remove_t_co_redirection_on_links" />,
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
            shouldIndent: true,
          },
        ]}>
        <Trans id="settings_links"></Trans>
      </CheckboxSelectSettingsRow>
      <CheckboxSelectSettingsRow
        onChange={onChange}
        fields={[
          {
            initialValue: settings.detectContentWarnings,
            key: 'detectContentWarnings',
            introducedIn: '4.3',
            label: <Trans id="settings_show_content_warnings" />,
            extraContent: () => (
              <SettingsSmallText>
                <Trans id="settings_content_warning_hint" />
              </SettingsSmallText>
            ),
          },
          {
            initialValue: settings.detectContentWarningsWithoutKeywords,
            isDisabled: !settings.detectContentWarnings,
            key: 'detectContentWarningsWithoutKeywords',
            introducedIn: '4.8',
            label: <Trans id="settings_detect_content_warnings_without_the_keyword" />,
            extraContent: (newSettings) => {
              return (
                newSettings && (
                  <>
                    <SettingsSmallText>
                      {getTransString('settings_will_match_patterns_like_food_lorem_ipsum')}
                    </SettingsSmallText>
                    <SettingsTextareaWithAnnotation
                      className={settingsIndent}
                      isDisabled={!newSettings.detectContentWarningsWithoutKeywords}
                      value={newSettings.singleWordContentWarnings}
                      onChange={makeOnSettingsChange('singleWordContentWarnings')}
                      annotation={getTransString(
                        'settings_comma_separated_keywords_matched_by_order_in_the_list'
                      )}></SettingsTextareaWithAnnotation>
                  </>
                )
              );
            },
          },
          {
            initialValue: settings.detectSpoilers,
            key: 'detectSpoilers',
            introducedIn: '4.8',
            label: <Trans id="settings_collapse_tweets_who_match_one_of_the_following_keywords" />,
            extraContent: (newSettings) => {
              return (
                newSettings && (
                  <>
                    <SettingsSmallText>
                      <Trans id="settings_you_can_use_this_to_hide_spoilers" />
                    </SettingsSmallText>
                    <SettingsTextareaWithAnnotation
                      className={settingsIndent}
                      isDisabled={!newSettings.detectSpoilers}
                      value={newSettings.spoilerKeywords}
                      onChange={makeOnSettingsChange('spoilerKeywords')}
                      annotation={getTransString(
                        'settings_comma_separated_keywords_matched_by_order_in_the_list'
                      )}></SettingsTextareaWithAnnotation>
                  </>
                )
              );
            },
          },
          {
            initialValue: settings.showMediaWarnings,
            key: 'showMediaWarnings',
            introducedIn: '4.7',
            label: <Trans id="settings_show_twitters_warnings_on_media" />,
            extraContent: () => {
              return (
                <SettingsSmallText>
                  <Trans id="settings_twitter_added_feature_in_january_2022" />
                </SettingsSmallText>
              );
            },
          },
          {
            shouldIndent: true,
            initialValue: settings.showWarningsForAdultContent,
            isDisabled: !settings.showMediaWarnings,
            key: 'showWarningsForAdultContent',
            introducedIn: '4.8',
            label: <Trans id="settings_show_warnings_for_adult_content" />,
          },
          {
            shouldIndent: true,
            initialValue: settings.showWarningsForGraphicViolence,
            isDisabled: !settings.showMediaWarnings,
            key: 'showWarningsForGraphicViolence',
            introducedIn: '4.8',
            label: <Trans id="settings_show_warnings_for_graphic_violence" />,
          },
          {
            shouldIndent: true,
            initialValue: settings.showWarningsForOther,
            isDisabled: !settings.showMediaWarnings,
            key: 'showWarningsForOther',
            introducedIn: '4.8',
            label: <Trans id="settings_show_warnings_for_sensitive_contents" />,
          },
        ]}>
        <Trans id="settings_warnings" />
      </CheckboxSelectSettingsRow>
      <CheckboxSelectSettingsRow
        onChange={onChange}
        fields={[
          {
            initialValue: settings.showLegacyReplies,
            key: 'showLegacyReplies',
            label: <Trans id="settings_use_old_style_of_replies" />,
          },
          {
            initialValue: settings.biggerEmoji,
            key: 'biggerEmoji',
            label: <Trans id="settings_make_emoji_bigger_in_tweets" />,
          },
          {
            initialValue: settings.showProfileLabels,
            introducedIn: '4.5',
            key: 'showProfileLabels',
            label: <Trans id="settings_show_profile_labels_in_tweets_and_profile_modals" />,
          },
          {
            initialValue: settings.extractAndShowPronouns,
            introducedIn: '4.5',
            key: 'extractAndShowPronouns',
            label: <Trans id="settings_extract_pronouns" />,
            extraContent: () => {
              return (
                <SettingsSmallText>
                  <Trans id="settings_pronouns_extra" />
                </SettingsSmallText>
              );
            },
          },
          {
            initialValue: settings.dontShowPronounsOnOwnAccounts,
            introducedIn: '4.8.6',
            key: 'dontShowPronounsOnOwnAccounts',
            label: <Trans id="settings_dont_show_pronouns_for_your_own_accounts" />,
          },
          {
            initialValue: settings.mastodonLink,
            introducedIn: '4.9.1',
            key: 'mastodonLink',
            label: <Trans id="settings_show_mastodon_icon" />,
          },
        ]}>
        <Trans id="settings_misc" />
      </CheckboxSelectSettingsRow>
    </Fragment>
  );
};
