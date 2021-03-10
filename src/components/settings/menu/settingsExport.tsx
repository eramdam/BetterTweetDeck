import {DateTime} from 'luxon';
import React, {FC, useState} from 'react';

import {isHTMLElement} from '../../../helpers/domHelpers';
import {HandlerOf} from '../../../helpers/typeHelpers';
import {getExtensionVersion} from '../../../helpers/webExtensionHelpers';
import {validateSettings} from '../../../services/backgroundSettings';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {settingsRegularText} from '../settingsStyles';

export const ExportSettings: FC<{settings: BTDSettings; onNewSettings: HandlerOf<BTDSettings>}> = (
  props
) => {
  const {settings, onNewSettings} = props;
  const href = URL.createObjectURL(
    new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    })
  );

  const downloadName = `better-tweetdeck-settings-${getExtensionVersion()}-${DateTime.local().toFormat(
    'y-LL-dd_HH.mm.ss'
  )}.json`;

  const [errorString, setErrorString] = useState('');

  return (
    <div className={settingsRegularText}>
      <div>
        <h3>Export settings</h3>
        <p>Export your settings by clicking the button below</p>
        <a download={downloadName} href={href} className="btd-settings-button secondary">
          Download settings
        </a>
      </div>
      <div>
        <h3>Import settings</h3>
        <p>Import your settings from a JSON file</p>
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const target = e.target;
            if (!isHTMLElement(target) || !target.files) {
              return;
            }

            const reader = new FileReader();
            reader.onload = () => {
              try {
                const resultString = String(reader.result);
                const resultObject = JSON.parse(resultString || '');
                const validatedSettings = validateSettings(resultObject);
                onNewSettings(validatedSettings);
                setErrorString('');
              } catch (e) {
                setErrorString(String(e));
              }
            };
            reader.readAsText(target.files[0]);
          }}
        />
        <div>
          <pre
            style={{
              paddingTop: 10,
              whiteSpace: 'pre-wrap',
            }}>
            {errorString}
          </pre>
        </div>
      </div>
    </div>
  );
};
