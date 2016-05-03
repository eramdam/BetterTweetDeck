export function $(sel, parent = document) {
  const arr = [].slice.call(parent.querySelectorAll(sel));

  return arr.length >= 1 ? arr : null;
}

export const TIMESTAMP_INTERVAL = 1e3 * 8;

export function on(...args) {
  return document.addEventListener(...args);
}

export function sendEvent(name, detail) {
  const event = new CustomEvent(name, { detail });
  document.dispatchEvent(event);
}
