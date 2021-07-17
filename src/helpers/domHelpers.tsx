import {hasProperty} from './typeHelpers';

export function isHTMLElement(
  blob: EventTarget | Element | Node | unknown | any | null
): blob is HTMLElement {
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

export function replaceAt(str: string, index: number, target: string, replacement: string) {
  const firstPart = str.substr(0, index);
  const secondPart = str.substr(index + target.length);

  return firstPart + replacement + secondPart;
}

export function valueAtCursor(input: HTMLInputElement | HTMLTextAreaElement) {
  const selection = {
    start: input.selectionStart,
    end: input.selectionEnd,
  };

  const lookStart = selection.start === selection.end ? 0 : selection.start;

  // @ts-ignore
  const beforeCursor = input.value.substr(lookStart, selection.end);

  return {
    value: beforeCursor,
    index: selection.end,
  };
}
