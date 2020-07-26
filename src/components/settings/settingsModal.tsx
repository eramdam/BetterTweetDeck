import './settingsModal.css';

import React, {FC} from 'react';

import {FeatherIcon} from '../../helpers/featherHelpers';

export const SettingsModal: FC = () => {
  function renderSideMenu() {
    return (
      <ul>
        <li className="active">
          <FeatherIcon className="icon" name="activity"></FeatherIcon>
          <span className="text">Section 2</span>
        </li>
        <li>
          <FeatherIcon className="icon" name="alert-circle"></FeatherIcon>
          <span className="text">Section 2</span>
        </li>
      </ul>
    );
  }

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Better TweetDeck Settings</header>
      <aside className="btd-settings-sidebar">{renderSideMenu()}</aside>
      <section className="btd-settings-content"></section>
      <footer className="btd-settings-footer">
        <button className="btd-settings-button primary">Save</button>
      </footer>
    </div>
  );
};
