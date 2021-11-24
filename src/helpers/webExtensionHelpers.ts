import browser from 'webextension-polyfill';

import {BTDMessageEvent, BTDMessageEventData} from '../types/btdMessageTypes';
import {BTDSettings} from '../types/btdSettingsTypes';

/**
 * Converts a relative path within an extension install directory to a fully-qualified URL.
 */
export const getExtensionUrl = (url: string) => browser.runtime.getURL(url);

/** Exposes the WebExtensions settings object/API. */
export const ExtensionSettings = browser.storage.sync;

export type StorageChangeHandler = (
  changes: {
    [k in keyof BTDSettings]: {
      oldValue: BTDSettings[k];
      newValue: BTDSettings[k];
    };
  },
  area: string
) => void;

export function listenForStorageChange(cb: StorageChangeHandler) {
  browser.storage.onChanged.addListener(cb as any);
}

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
