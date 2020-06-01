import {hasProperty} from './typeHelpers';

export function isHTMLElement(blob: Element | Node): blob is HTMLElement {
  return hasProperty(blob, 'closest');
}

export const getRandomString = (length = 32) => {
  const half = Math.ceil(length / 2);
  const values = new Uint8Array(half);

  crypto.getRandomValues(values);

  return Array.from(values)
    .map((n) => Number(n).toString(16))
    .join('');
};
