/* eslint-disable react/jsx-key */
import {css} from '@emotion/css';
import React, {FC, Fragment} from 'react';

import heartIcon from '../../../assets/heart-icon.svg';
import arrowsIcon from '../../../assets/mutual-icon.svg';
import translatorIcon from '../../../assets/translator-icon.svg';
import verifiedIcon from '../../../assets/verified-icon.svg';
import {BTDMutualBadges} from '../../../features/badgesOnTopOfAvatars';
import {isFirefox, isSafari} from '../../../helpers/browserHelpers';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {SettingsRadioSettingSelect} from '../components/settingsRadioSelect';
import {SettingsTextInputWithAnnotation} from '../components/settingsTimeFormatInput';
import {SettingsMenuSectionProps, SettingsSmallText} from '../settingsComponents';

const BadgeIcon = ({icon}: {icon: string}) => {
  return (
    <span
      className={css`
        background: #151f2a;
        padding: 4px;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        margin-left: 8px;
        vertical-align: bottom;
      `}>
      <img
        className={css`
          width: 1em;
          height: 1em;
        `}
        src={icon}
      />
    </span>
  );
};

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
            initialValue: settings.showAvatarsOnTopOfColumns,
            key: 'showAvatarsOnTopOfColumns',
            introducedIn: '4.3',
            label: <Trans id="settings_show_account_avatars_on_top_of_columns" />,
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
            initialValue: settings.collapseReadDms,
            key: 'collapseReadDms',
            label: <Trans id="settings_collapse_read_dms" />,
          },
          {
            initialValue: settings.collapseAllDms,
            key: 'collapseAllDms',
            label: <Trans id="settings_collapse_unread_dms" />,
            isDisabled: !settings.collapseReadDms,
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
            label: (
              <>
                <Trans id="settings_show_verified_badges" />
                <BadgeIcon icon={verifiedIcon} />
              </>
            ),
          },
          {
            isDisabled: !settings.badgesOnTopOfAvatars,
            initialValue: settings.translatorBadges,
            key: 'translatorBadges',
            label: (
              <>
                <Trans id="settings_show_translator_badges" />
                <BadgeIcon icon={translatorIcon} />
              </>
            ),
          },
          {
            isDisabled: !settings.badgesOnTopOfAvatars,
            initialValue: settings.mutualBadges,
            key: 'mutualBadges',
            label: <Trans id="settings_show_badges_on_mutuals" />,
            introducedIn: '4.2',
            extraContent: (newSettings) => {
              return (
                <SettingsRadioSettingSelect<BTDSettings, 'mutualBadgeVariation'>
                  fields={[
                    {
                      label: (
                        <>
                          <Trans id="settings_mutual_badge_use_a_heart" />{' '}
                          <BadgeIcon icon={heartIcon} />
                        </>
                      ),
                      value: BTDMutualBadges.HEART,
                    },
                    {
                      label: (
                        <>
                          <Trans id="settings_mutual_badge_use_double_arrows" />
                          <BadgeIcon icon={arrowsIcon} />
                        </>
                      ),
                      value: BTDMutualBadges.ARROWS,
                    },
                  ]}
                  isDisabled={!newSettings.mutualBadges || !newSettings.badgesOnTopOfAvatars}
                  settingsKey="mutualBadgeVariation"
                  onChange={makeOnSettingsChange('mutualBadgeVariation')}
                  initialValue={newSettings.mutualBadgeVariation}></SettingsRadioSettingSelect>
              );
            },
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
