import {DateTime} from 'luxon';
import React, {FC} from 'react';

import {getExtensionVersion} from '../../../helpers/webExtensionHelpers';
import {BTDSettings} from '../../../types/betterTweetDeck/btdSettingsTypes';
import {Trans} from '../../trans';

export const SettingsExportButton: FC<{
  settings: BTDSettings;
}> = (props) => {
  const {settings} = props;
  const href = URL.createObjectURL(
    new Blob([JSON.stringify(settings, null, 2)], {
      type: 'application/json',
    })
  );

  const downloadName = `better-tweetdeck-settings-${getExtensionVersion()}-${DateTime.local().toFormat(
    'y-LL-dd_HH.mm.ss'
  )}.json`;

  return (
    <a download={downloadName} href={href} className="btd-settings-button secondary">
      <Trans id="settings_download_settings_button" />
    </a>
  );
};
