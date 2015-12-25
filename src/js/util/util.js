export function $(sel, parent = document) {
  let arr;

  arr = [].slice.call(parent.querySelectorAll(sel));

  return arr.length >= 1 ? arr : null;
}

export function log(...args) {
  console.log(...args);
}

export const TIMESTAMP_INTERVAL = 1e3 * 8;