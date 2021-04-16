import React, {FC} from 'react';

import {BTDSettings} from '../../../types/btdSettingsTypes';
import {getTransString} from '../../trans';
import {SettingsMenuSectionProps} from '../settingsComponents';
import {useSettingsSearch} from '../settingsContext';
import {SettingsCssEditor} from './settingsCssEditor';

export const SettingsCss: FC<SettingsMenuSectionProps> = (props) => {
  const {makeOnSettingsChange, setEditorHasErrors} = props;
  const {renderAndAddtoIndex} = useSettingsSearch();
  const renderEditor = (newSettings: BTDSettings) => (
    <SettingsCssEditor
      onChange={(val) => makeOnSettingsChange('customCss')(val)}
      onErrorChange={setEditorHasErrors}
      value={newSettings.customCss}></SettingsCssEditor>
  );

  return (
    <>
      {renderAndAddtoIndex({
        key: 'custom_css',
        keywords: [getTransString('settings_custom_css')],
        render: renderEditor,
      })}
    </>
  );
};
