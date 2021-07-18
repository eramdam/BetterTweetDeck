import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

export function setupBtdRoot() {
  return new Promise<void>((resolve) => {
    if (document.querySelector('#btdRoot')) {
      return;
    }

    const btdApp = (
      <div id="btdRoot">
        <div id="btd-fullscreen-portal-root"></div>
      </div>
    );

    document.body.insertAdjacentHTML('beforeend', renderToStaticMarkup(btdApp));
    resolve();
  });
}
