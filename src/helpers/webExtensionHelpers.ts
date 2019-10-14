import {browser} from 'webextension-polyfill-ts';

/**
 * Converts a relative path within an extension install directory to a fully-qualified URL.
 */
export const getExtensionUrl = (url: string) => browser.extension.getURL(url);

/** Exposes the WebExtensions settings object/API. */
export const ExtensionSettings = browser.storage.sync;

/** Returns the version of the extension. */
export const getExtensionVersion = () => browser.runtime.getManifest().version;
