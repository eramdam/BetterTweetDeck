import React from 'dom-chef';

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

    document.body.appendChild<any>(btdApp);
    resolve();
  });
}
