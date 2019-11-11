import React from 'react';
import {render} from 'react-dom';

export function setupReactRoot() {
  if (document.querySelector('#btdRoot')) {
    return;
  }

  const root = document.createElement('div');
  root.id = 'btdRoot';

  document.body.appendChild(root);

  render(<div />, root);
}
