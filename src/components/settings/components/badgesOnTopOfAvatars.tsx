import React from 'react';

import {BaseSettingsProps} from '../settingsTypes';
import {BooleanSettingsRow} from './booleanSettingRow';

interface BadgesOnTopOfAvatarsProps extends BaseSettingsProps<'badgesOnTopOfAvatars'> {}

export function BadgesOnTopOfAvatars(props: BadgesOnTopOfAvatarsProps) {
  return (
    <BooleanSettingsRow
      settingsKey="badgesOnTopOfAvatars"
      initialValue={props.initialValue}
      onChange={props.onChange}>
      Show badges on top of avatars:
    </BooleanSettingsRow>
  );
}
