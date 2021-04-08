import {isEmpty} from 'lodash';
import React, {FC, useEffect, useState} from 'react';
import {render} from 'react-dom';

import {SettingsSearchProvider} from './components/settings/settingsContext';
import {SettingsModal} from './components/settings/settingsModal';
import {minifyCss, prettifyCss} from './helpers/cssHelpers';
import {ExtensionSettings} from './helpers/webExtensionHelpers';
import {getValidatedSettings} from './services/backgroundSettings';
import {BTDSettings} from './types/btdSettingsTypes';

const App: FC = () => {
  const [settings, setSettings] = useState<BTDSettings>({} as any);

  useEffect(() => {
    getValidatedSettings().then((newSettings) => {
      setSettings({
        ...newSettings,
        customCss: prettifyCss(newSettings.customCss),
      });
    });
  }, []);

  if (isEmpty(settings)) {
    return null;
  }

  return (
    <SettingsSearchProvider>
      <SettingsModal
        onSettingsUpdate={async (newSettings) => {
          const compressedCss = minifyCss(newSettings.customCss);
          await ExtensionSettings.set({
            ...newSettings,
            customCss: compressedCss,
          });
        }}
        btdSettings={settings}></SettingsModal>
    </SettingsSearchProvider>
  );
};

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(<App></App>, root);
