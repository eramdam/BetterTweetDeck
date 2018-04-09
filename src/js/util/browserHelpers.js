import browser from "webextension-polyfill";

export const getExtensionUrl = (...args) => browser.extension.getURL(...args);

export const settings = browser.storage.sync