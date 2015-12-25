import config from 'config';

export function log(...args) {
  if (!config.get('Client.debug'))
    return;

  console.log(...args);
}

export function debug(...args) {
  if (!config.get('Client.debug'))
    return;

  console.debug(...args);
}

export function error(...args) {
  if (!config.get('Client.debug'))
    return;

  console.error(...args);
}