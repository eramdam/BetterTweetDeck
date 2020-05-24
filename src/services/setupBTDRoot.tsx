import React from 'react';
import {render} from 'react-dom';

import {BtdApp} from '../components/btdApp';

export function setupReactRoot() {
  return new Promise((resolve) => {
    if (document.querySelector('#btdRoot')) {
      return;
    }

    const root = document.createElement('div');
    root.id = 'btdRoot';

    document.body.appendChild(root);

    render(<BtdApp />, root, resolve);
  });
}
