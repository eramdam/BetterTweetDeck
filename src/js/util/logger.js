import config from 'config';

/* eslint no-console: ["error", { allow: ["debug"] }] */
export function debug(...args) {
  if (config.get('Client.debug') || window._BTDDebug) {
    console.debug(...args);
  }

  return;
}
