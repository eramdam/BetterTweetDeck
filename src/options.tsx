import React from 'react';
import {render} from 'react-dom';

import {SettingsModal} from './components/settings/settingsModal';

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

        display: grid;
        place-items: center;
      }
    `}
    </style>
    <SettingsModal></SettingsModal>
  </div>
);

render(App, document.body);
