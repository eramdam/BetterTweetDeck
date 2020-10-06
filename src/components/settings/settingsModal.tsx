import './settingsModal.css';

import React, {Fragment, useState} from 'react';

import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';
import {AvatarsShape} from './components/avatarsShape';
import {makeSettingsRow, SettingsSection} from './settingsComponents';

export const SettingsModal = (props: {settings: BTDSettings}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menu: readonly SettingsSection[] = [
    {
      id: 'section-1',
      content: [
        makeSettingsRow('avatarsShape', (val) => {
          return <AvatarsShape val={val}></AvatarsShape>;
        }),
      ],
    },
    {
      id: 'section-2',
      content: [
        {
          id: 'badgesOnTopOfAvatars',
          render: (val) => <div>{val}</div>,
        },
      ],
    },
  ];

  return (
    <div className="btd-settings-modal">
      <header className="btd-settings-header">Better TweetDeck Settings</header>
      <aside className="btd-settings-sidebar">
        <ul>
          {menu.map((item, index) => {
            return (
              <li
                key={item.id}
                className={(selectedIndex === index && 'active') || ''}
                onClick={() => {
                  setSelectedIndex(index);
                }}>
                <div className="icon"></div>
                <div className="text">{item.id}</div>
              </li>
            );
          })}
        </ul>
      </aside>
      <section className="btd-settings-content">
        {menu[selectedIndex].content.map((row) => {
          console.log({val: props.settings[row.id]});
          return (
            <Fragment key={selectedIndex + row.id}>{row.render(props.settings[row.id])}</Fragment>
          );
        })}
      </section>
      <footer className="btd-settings-footer">
        <button className="btd-settings-button primary">Save</button>
      </footer>
    </div>
  );
};
