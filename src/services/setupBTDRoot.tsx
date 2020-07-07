import React from 'dom-chef';
import {browser} from 'webextension-polyfill-ts';

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

    const settingsButton = (
      <a
        className="js-header-action link-clean cf app-nav-link padding-h--16 padding-v--2"
        onClick={() => {
          window.open(browser.runtime.getURL('options/index.html'));
        }}
        data-title="Better TweetDeck Settings">
        <div className="obj-left margin-l--2">
          <i className="icon icon-sliders icon-medium"></i>
        </div>
        <div className="nbfc padding-ts hide-condensed txt-size--14 txt-bold app-nav-link-text">
          Settings
        </div>
      </a>
    );

    setTimeout(() => {
      document
        .querySelector('.js-header-action[data-title="Expand"]')!
        .insertAdjacentElement('beforebegin', settingsButton);
    }, 2000);

    document.body.appendChild(btdApp);
    resolve();
  });
}
