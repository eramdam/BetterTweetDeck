import React from 'react';
import {render} from 'react-dom';

import {SettingsModal} from './components/settings/settingsModal';
import {RBetterTweetDeckSettings} from './types/betterTweetDeck/btdSettingsTypes';

const settingsWithDefault = RBetterTweetDeckSettings.decode({});

const App = (
  <div>
    <style>
      {`
      body {
        background-image: linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), linear-gradient(purple, fuchsia);
        background-size: 100vw 100vh;
        height: 100vh;
        overflow: hidden;
        margin: 0;
        padding: 0;
      }

      .btd-settings-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    `}
    </style>
    <SettingsModal
      onOpenTDSettings={console.log}
      onSettingsUpdate={console.log}
      settings={(settingsWithDefault as any).right}></SettingsModal>
  </div>
);

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
render(App, root);
