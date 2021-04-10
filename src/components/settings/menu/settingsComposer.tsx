import React, {FC, Fragment} from 'react';

import {BTDSettings} from '../../../types/btdSettingsTypes';
import {Trans} from '../../trans';
import {CheckboxSelectSettingsRow} from '../components/checkboxSelectSettingsRow';
import {SettingsMenuSectionProps} from '../settingsComponents';

export const SettingsComposer: FC<SettingsMenuSectionProps> = (props) => {
  const {settings, makeOnSettingsChange} = props;
  return (
    <Fragment>
      <CheckboxSelectSettingsRow
        onChange={(key, value) => {
          makeOnSettingsChange(key as keyof BTDSettings)(value);
        }}
        fields={[
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
            initialValue: settings.showEmojiPicker,
            key: 'showEmojiPicker',
            label: <Trans id="settings_show_the_emoji_picker" />,
          },
          {
            initialValue: settings.enableEmojiCompletion,
            key: 'enableEmojiCompletion',
            label: <Trans id="settings_enable_emoji_autocompletion" />,
          },
          {
            initialValue: settings.showGifPicker,
            key: 'showGifPicker',
            label: <Trans id="settings_enable_the_gif_button" />,
          },
        ]}>
        <Trans id="settings_tweet_composer"></Trans>
      </CheckboxSelectSettingsRow>
    </Fragment>
  );
};
