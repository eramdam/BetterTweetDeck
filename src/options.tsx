import {isEmpty} from 'lodash';
import React, {FC, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';

import {SettingsModal} from './components/settings/settingsModal';
import {ExtensionSettings} from './helpers/webExtensionHelpers';
import {getValidatedSettings} from './services/backgroundSettings';
import {BTDSettings} from './types/btdSettingsTypes';

const Options: FC = () => {
  const [settings, setSettings] = useState<BTDSettings>({} as any);

  useEffect(() => {
    getValidatedSettings().then(setSettings);
  }, []);

  if (isEmpty(settings)) {
    return null;
  }

  return (
    <SettingsModal
      onSettingsUpdate={async (newSettings) => {
        return ExtensionSettings.set({
          ...newSettings,
        });
      }}
      btdSettings={settings}></SettingsModal>
  );
};

const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Options></Options>);
