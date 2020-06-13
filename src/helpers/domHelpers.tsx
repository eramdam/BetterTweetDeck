import React from 'dom-chef';
import {CSSProperties} from 'react';

import {hasProperty} from './typeHelpers';

export function isHTMLElement(blob: EventTarget | Element | Node | null): blob is HTMLElement {
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

export type DCFactory<T> = (
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
  wrapper.appendChild(tempElement);

  const domStyle = (wrapper.firstElementChild! as HTMLElement).style;
  for (let name of Object.values(domStyle)) {
    node.style[name as any] = domStyle[name as any];
  }

  emptyNode(wrapper);
}
