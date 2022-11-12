/* eslint-disable react/jsx-key */
import {css} from '@emotion/css';
import React, {FC, Fragment} from 'react';

import clownIcon from '../../../assets/clown-icon.svg';
import crookedIcon from '../../../assets/crooked-icon.svg';
import dollarIcon from '../../../assets/dollar-icon.svg';
import heartIcon from '../../../assets/heart-icon.svg';
import arrowsIcon from '../../../assets/mutual-icon.svg';
import nerdIcon from '../../../assets/nerd-checkmark.svg';
import translatorIcon from '../../../assets/translator-icon.svg';
import twitterBlueIcon from '../../../assets/twitter-blue.svg';
import verifiedIcon from '../../../assets/verified-icon.svg';
import {isFirefox, isSafari} from '../../../helpers/browserHelpers';
import {BTDMutualBadges, BTDVerifiedBlueBadges} from '../../../types/btdSettingsEnums';
import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {SettingsRadioSettingSelect} from '../components/settingsRadioSelect';
import {SettingsTextInputWithAnnotation} from '../components/settingsTextInputWithAnnotation';
import {SettingsMenuSectionProps, SettingsSmallText} from '../settingsComponents';
import {settingsIndent} from '../settingsStyles';

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
          width: 1.4em;
          height: 1.4em;
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
                  className={settingsIndent}
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
            initialValue: settings.disableGifsInProfilePictures,
            key: 'disableGifsInProfilePictures',
            label: <Trans id="settings_freeze_gifs_in_profile_pictures" />,
          },
          {
            initialValue: settings.updateTabTitleOnActivity,
            key: 'updateTabTitleOnActivity',
            label: <Trans id="settings_reflect_new_tweets_and_dms_in_the_tabs_title" />,
          },
          {
            initialValue: settings.hidePreviewButton,
            key: 'hidePreviewButton',
            introducedIn: '4.5',
            label: <Trans id="settings_hide_the_try_tweetdeck_preview_button" />,
          },
          {
            initialValue: settings.muteNftAvatars,
            key: 'muteNftAvatars',
            label: <Trans id="settings_mute_nfts_accounts" />,
          },
          {
            initialValue: settings.collapseReadDms,
            key: 'collapseReadDms',
            label: <Trans id="settings_collapse_read_dms" />,
          },
          {
            initialValue: settings.collapseAllDms,
            key: 'collapseAllDms',
            shouldIndent: true,
            label: <Trans id="settings_collapse_unread_dms" />,
            isDisabled: !settings.collapseReadDms,
          },
          {
            initialValue: settings.muteCircleTweets,
            key: 'muteCircleTweets',
            label: <Trans id="settings_mute_circle_tweets" />,
          },
          {
            initialValue: settings.showCircleTweetsBorder,
            key: 'showCircleTweetsBorder',
            label: <Trans id="settings_show_circle_tweets_border" />,
            isDisabled: settings.muteCircleTweets,
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
            initialValue: settings.verifiedBlueBadges,
            key: 'verifiedBlueBadges',
            label: 'Show badges for accounts paying for Twitter Blue',
            introducedIn: '4.9',
            extraContent: (newSettings) => {
              return (
                <SettingsRadioSettingSelect<BTDSettings, 'verifiedBlueBadgeVariation'>
                  fields={[
                    {
                      label: (
                        <>
                          <Trans id="settings_use_the_twitter_blue_icon" />{' '}
                          <BadgeIcon icon={twitterBlueIcon} />
                        </>
                      ),
                      value: BTDVerifiedBlueBadges.BLUE,
                    },
                    {
                      label: (
                        <>
                          <Trans id="settings_use_a_verified_icon" />{' '}
                          <BadgeIcon icon={crookedIcon} />
                        </>
                      ),
                      value: BTDVerifiedBlueBadges.CROOKED,
                    },
                    {
                      label: (
                        <>
                          <Trans id="settings_use_a_dollar_icon" /> <BadgeIcon icon={dollarIcon} />
                        </>
                      ),
                      value: BTDVerifiedBlueBadges.DOLLAR,
                    },
                    {
                      label: (
                        <>
                          <Trans id="settings_use_a_clown_icon" /> <BadgeIcon icon={clownIcon} />
                        </>
                      ),
                      value: BTDVerifiedBlueBadges.CLOWN,
                    },
                    {
                      label: (
                        <>
                          <Trans id="settings_use_a_nerd_icon" /> <BadgeIcon icon={nerdIcon} />
                        </>
                      ),
                      value: BTDVerifiedBlueBadges.NERD,
                    },
                  ]}
                  className={css`
                    padding-left: 25px;
                  `}
                  isDisabled={!newSettings.verifiedBlueBadges}
                  settingsKey="verifiedBlueBadgeVariation"
                  onChange={makeOnSettingsChange('verifiedBlueBadgeVariation')}
                  initialValue={
                    newSettings.verifiedBlueBadgeVariation
                  }></SettingsRadioSettingSelect>
              );
            },
          },
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
                  className={css`
                    padding-left: 25px;
                  `}
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
              shouldIndent: true,
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
