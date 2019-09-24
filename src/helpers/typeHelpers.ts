import {isObject} from 'lodash';

export function hasProperty<T, K extends string>(
  o: T,
  k: K
): o is T & Object & Record<K, unknown> {
  return isObject(o) && k in o;
}
