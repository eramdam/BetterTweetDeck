import {browser} from 'webextension-polyfill-ts';

export const getExtensionUrl = (url: string) => browser.extension.getURL(url);

export const settings = browser.storage.sync;
