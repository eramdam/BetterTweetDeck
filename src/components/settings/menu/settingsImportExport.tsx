import _ from 'lodash';
import Highlight, {defaultProps} from 'prism-react-renderer';
import React, {FC, useState} from 'react';

import {isHTMLElement} from '../../../helpers/domHelpers';
import {HandlerOf} from '../../../helpers/typeHelpers';
import {validateSettings} from '../../../services/backgroundSettings';
import {
  BTDSettings,
  RBetterTweetDeckSettings,
} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {getTransString, Trans} from '../../trans';
import {settingsRegularText} from '../settingsStyles';
import {SettingsExportButton} from './settingsExportButton';

export const ImportExportSettings: FC<{
  settings: BTDSettings;
  onNewSettings: HandlerOf<BTDSettings>;
}> = (props) => {
  const {settings, onNewSettings} = props;

  const [errorString, setErrorString] = useState('');
  const [successString, setSuccessString] = useState('');
  const [importedSettings, setImportedSettings] = useState({});

  return (
    <div className={settingsRegularText}>
      <div>
        <h3>
          <Trans id="settings_export_settings" />
        </h3>
        <p>
          <Trans id="settings_export_settings_copy" />
        </p>
        <SettingsExportButton settings={settings}></SettingsExportButton>
      </div>
      <div>
        <h3>
          <Trans id="settings_import_settings" />
        </h3>
        <p>
          <Trans id="settings_import_settings_copy" />
        </p>
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
                const fileKeys = _(resultObject)
                  .mapValues((v) => true)
                  .toPairs()
                  .sortBy(0)
                  .fromPairs()
                  .value();
                const settingsKeys = _(RBetterTweetDeckSettings.props)
                  .mapValues((v) => true)
                  .toPairs()
                  .sortBy(0)
                  .fromPairs()
                  .value();

                const hasRightKeys = _.isMatch(fileKeys, settingsKeys);

                if (!hasRightKeys) {
                  throw new Error(getTransString('settings_import_json_wrong_keys'));
                }

                const finalSettings = validateSettings(resultObject);

                onNewSettings(finalSettings);
                setImportedSettings(finalSettings);
                setErrorString('');
                const successString = getTransString('settings_import_success');
                setSuccessString(successString);
              } catch (e) {
                setSuccessString('');
                setImportedSettings({});
                setErrorString(String(e));
              }
            };

            reader.readAsText(target.files[0]);
          }}
        />
        <div>
          <pre
            style={{
              paddingTop: 30,
              whiteSpace: 'pre-wrap',
              color: 'red',
            }}>
            {errorString}
          </pre>
          <pre
            style={{
              paddingTop: 30,
              whiteSpace: 'pre-wrap',
              color: 'green',
            }}>
            {successString}
          </pre>
          {!_.isEmpty(importedSettings) && (
            <details
              style={{
                margin: '20px 0',
              }}>
              <summary
                style={{
                  cursor: 'pointer',
                }}>
                <Trans id="settings_imported_settings_summary" />
              </summary>
              <Highlight
                {...defaultProps}
                language="json"
                code={JSON.stringify(importedSettings, null, 2)}>
                {({className, style, tokens, getLineProps, getTokenProps}) => (
                  <pre
                    className={className}
                    style={{
                      ...style,
                      padding: 20,
                      whiteSpace: 'pre-wrap',
                      borderRadius: 12,
                      margin: '12px 0',
                    }}>
                    {tokens.map((line, i) => (
                      <div
                        {...getLineProps({line, key: i})}
                        key={JSON.stringify(line)}
                        style={{
                          margin: '2px 0',
                        }}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({token, key})} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};
