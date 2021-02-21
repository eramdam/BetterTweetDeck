import {browser} from 'webextension-polyfill-ts';

browser.tabs.create({url: browser.runtime.getURL('build/options/index.html')});
window.close();
