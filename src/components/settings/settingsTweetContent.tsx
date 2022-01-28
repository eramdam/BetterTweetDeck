import React, {FC, Fragment} from 'react';

import {BTDSettings} from '../../types/btdSettingsTypes';
import {Trans} from '../trans';
import {CheckboxSelectSettingsRow} from './components/checkboxSelectSettingsRow';
import {SettingsCheckboxSelectProps} from './components/settingsCheckboxSelect';
import {SettingsMenuSectionProps} from './settingsComponents';
import {SettingsSmall} from './settingsStyles';

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
        ]}>
        <Trans id="settings_links"></Trans>
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
            initialValue: settings.detectContentWarnings,
            key: 'detectContentWarnings',
            introducedIn: '4.3',
            label: <Trans id="settings_show_content_warnings" />,
            extraContent: () => (
              <small className={SettingsSmall}>
                <Trans id="settings_content_warning_hint" />
              </small>
            ),
          },
          {
            initialValue: settings.showMediaWarnings,
            key: 'showMediaWarnings',
            introducedIn: '4.7',
            label: <Trans id="settings_show_twitters_warnings_on_media" />,
            extraContent: () => {
              return <small className={SettingsSmall}>Twitter added feature in January 2022</small>;
            },
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
                <small className={SettingsSmall}>
                  <Trans id="settings_pronouns_extra" />
                </small>
              );
            },
          },
        ]}>
        <Trans id="settings_misc" />
      </CheckboxSelectSettingsRow>
    </Fragment>
  );
};
