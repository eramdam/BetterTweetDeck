import config from 'config';

/* eslint no-console: ["error", { allow: ["log"] }] */
export default function debug(...args) {
  if (config.Client.debug || window._BTDDebug) {
    console.log('[BTD]', ...args);
  }
}
