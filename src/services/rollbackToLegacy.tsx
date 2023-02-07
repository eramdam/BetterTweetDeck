import React from 'react';
import {createRoot} from 'react-dom/client';

import {SettingsButton} from '../components/settings/components/settingsButton';
import {SettingsHeader} from '../components/settings/components/settingsModalComponents';
import {getExtensionUrl, getExtensionVersion} from '../helpers/webExtensionHelpers';

export const ROLLBACK_TO_LEGACY = 'ROLLBACK_TO_LEGACY';

export function rollbackToLegacy() {
  if (localStorage.getItem('ROLLBACK_TO_LEGACY') === 'true') {
    return;
  }
  if (document.getElementById('btd-rollback-dialog-root')) {
    window.location.reload();
    return;
  }
  const container = document.createElement('div');
  container.id = 'btd-rollback-dialog-root';
  container.classList.add('new-td');
  document.body.appendChild(container);
  const root = createRoot(container);

  root.render(
    <RollbackDialog
      onCancel={() => {
        root.unmount();
        container.remove();
      }}></RollbackDialog>
  );
}

const topbarIcon = getExtensionUrl('build/assets/icons/icon-32.png');
const topbarVersion = getExtensionVersion();
const RollbackDialog = (props: {onCancel: () => void}) => {
  return (
    <div className="btd-dialog">
      <SettingsHeader>
        <span className="icon">
          <img src={topbarIcon} alt={''} />
        </span>
        <span className="title">Better TweetDeck</span>
        <small className="version">{topbarVersion}</small>
      </SettingsHeader>
      <div
        style={{
          padding: '0 20px',
        }}>
        <h3>Rollback to legacy TweetDeck</h3>
        <p>
          It seems like you have been enrolled into the new TweetDeck UI. Better TweetDeck is{' '}
          <strong>NOT</strong> compatible with it and <strong>likely never</strong> will,{' '}
          <a href="https://github.com/eramdam/BetterTweetDeck/issues/848">
            you can read more about the situation here
          </a>
          . <br />
          <br /> You can rollback to the legacy UI by clicking the button below. <br />
          Disclaimer: it is possible this button won&apos;t do anything at some point in the future,
          unfortunately.
        </p>

        <div className="buttons">
          <SettingsButton
            onClick={() => {
              localStorage.setItem('ROLLBACK_TO_LEGACY', String(true));
              props.onCancel();
            }}
            variant="secondary">
            Don&apos;t ask again
          </SettingsButton>
          <div
            style={{
              flex: 1,
            }}></div>
          <SettingsButton onClick={props.onCancel} variant="secondary">
            Cancel
          </SettingsButton>
          <SettingsButton
            onClick={() => {
              localStorage.setItem('ROLLBACK_TO_LEGACY', String(true));
              document.cookie = 'tweetdeck_version=legacy';
              window.location.reload();
            }}
            variant="primary">
            Rollback
          </SettingsButton>
        </div>
      </div>
    </div>
  );
};
