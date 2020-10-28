import React from 'react';

import {BaseSettingsProps} from '../settingsTypes';
import {BooleanSettingsRow} from './booleanSettingRow';

interface CollapseReadDmsProps extends BaseSettingsProps<'collapseReadDms'> {}

export function CollapseReadDms(props: CollapseReadDmsProps) {
  return (
    <BooleanSettingsRow
      id="collapseReadDms"
      initialValue={props.initialValue}
      onChange={props.onChange}>
      Collapse read DMs:
    </BooleanSettingsRow>
  );
}
