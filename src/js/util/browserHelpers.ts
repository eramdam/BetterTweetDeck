import {browser} from 'webextension-polyfill-ts';

/**
 * Converts a relative path within an extension install directory to a fully-qualified URL.
 *
 * @param path A path to a resource within an extension expressed relative to its install directory.
 * @returns string The fully-qualified URL to the resource.
 */
export const getExtensionUrl = (url: string) => browser.extension.getURL(url);

export const settings = browser.storage.sync;
