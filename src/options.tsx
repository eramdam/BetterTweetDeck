import React from 'react';
import {render} from 'react-dom';

import {SettingsModal} from './components/settings/settingsModal';
import {RBetterTweetDeckSettings} from './types/betterTweetDeck/btdSettingsTypes';

const settingsWithDefault = RBetterTweetDeckSettings.decode({});

const App = (
  <>
    <style>
      {`
      body, #root, html {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    `}
    </style>
    <SettingsModal
      onOpenTDSettings={console.log}
      onSettingsUpdate={console.log}
      settings={(settingsWithDefault as any).right}></SettingsModal>
  </>
);

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(App, root);
