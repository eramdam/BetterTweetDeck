import {isObject} from 'lodash';

export function hasProperty<T, K extends string>(o: T, k: K): o is T & Object & Record<K, unknown> {
  return isObject(o) && k in o;
}

export type Handler = () => void;
export type HandlerOf<T> = (opt: T) => void;
export type Renderer = () => JSX.Element | React.ReactNode;
export type RendererOf<T> = (props: T) => JSX.Element | React.ReactNode;

export function insertDomChefElement(element: JSX.Element) {
  return element as any;
}

export function makeIsModuleRaidModule<T>(predicate: (blob: any) => boolean) {
  return (blob: any): blob is T => predicate(blob);
}
