import React from 'dom-chef';
import {CSSProperties} from 'react';

import {insertDomChefElement} from './typeHelpers';

export function isHTMLElement(
  blob: EventTarget | Element | Node | unknown | any | null
): blob is HTMLElement {
  return blob instanceof HTMLElement;
}

export function isHtmlVideoElement(
  blob: EventTarget | Element | Node | unknown | any | null
): blob is HTMLVideoElement {
  return blob instanceof HTMLVideoElement;
}

export const getRandomString = (length = 32) => {
  const half = Math.ceil(length / 2);
  const values = new Uint8Array(half);

  crypto.getRandomValues(values);

  return Array.from(values)
    .map((n) => Number(n).toString(16))
    .join('');
};

export type DCFactory<T = {}> = (
  props: T & {
    children?: JSX.Element;
  }
) => JSX.Element;

export function maybeDoOnNode(node: Element | null, cb: (node: HTMLElement) => void) {
  if (!node) {
    return;
  }

  cb(node as HTMLElement);
}

export function emptyNode(node: Element) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function setStylesOnNode(node: HTMLElement, style: CSSProperties) {
  const wrapper = document.createElement('div');
  const tempElement = <div style={style}></div>;
  wrapper.appendChild(insertDomChefElement(tempElement));

  const domStyle = (wrapper.firstElementChild! as HTMLElement).style;
  for (let name of Object.values(domStyle)) {
    node.style[name as any] = domStyle[name as any];
  }

  emptyNode(wrapper);
}

export const dataURItoBlob = (dataURI: string) => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], {type: mimeString});
  return blob;
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
