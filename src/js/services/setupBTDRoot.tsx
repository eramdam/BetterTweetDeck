import React from 'react';
import {render} from 'react-dom';

import {BTDApp} from '../components/btdApp';

export function setupRoot() {
  if (document.querySelector('#btdRoot')) {
    return;
  }

  const root = document.createElement('div');
  root.id = 'btdRoot';

  document.body.appendChild(root);

  render(<BTDApp />, root);
}
