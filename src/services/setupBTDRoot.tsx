import React from 'dom-chef';

import {insertDomChefElement} from '../helpers/typeHelpers';

export function setupBtdRoot() {
  return new Promise((resolve) => {
    if (document.querySelector('#btdRoot')) {
      return;
    }

    const btdApp = (
      <div id="btdRoot">
        <div id="btd-fullscreen-portal-root"></div>
      </div>
    );

    document.body.appendChild(insertDomChefElement(btdApp));
    resolve();
  });
}
