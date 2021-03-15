import {browser} from 'webextension-polyfill-ts';

import {BTDMessageEvent, BTDMessageEventData} from '../types/btdMessageTypes';

/**
 * Converts a relative path within an extension install directory to a fully-qualified URL.
 */
export const getExtensionUrl = (url: string) => browser.extension.getURL(url);

/** Exposes the WebExtensions settings object/API. */
export const ExtensionSettings = browser.storage.sync;

/** Returns the version of the extension. */
export const getExtensionVersion = () => browser.runtime.getManifest().version;

export async function sendMessageToBackground(
  msg: BTDMessageEvent
): Promise<BTDMessageEventData | undefined> {
  if (!browser) {
    return undefined;
  }

  return browser.runtime.sendMessage(msg);
}

export const getMessage = (msg: string, substitutions?: string) =>
  browser.i18n.getMessage(msg, substitutions);

export const isFirefox = navigator.userAgent.includes('Firefox/');
export const isChrome = navigator.userAgent.includes('Chrome/');
export const isSafari = navigator.userAgent.includes('Safari/') && !isChrome;
