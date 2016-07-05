import config from 'config';

/* eslint no-console: ["error", { allow: ["debug"] }] */
export function debug(...args) {
  if (!config.get('Client.debug')) {
    return;
  }

  console.debug(...args);
}
