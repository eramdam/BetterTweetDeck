import * as t from 'io-ts';
import {isObject} from 'lodash';

/** Checks for the presence of a property in a type-safe way. */
export function hasProperty<T, K extends string>(o: T, k: K): o is T & Object & Record<K, unknown> {
  return isObject(o) && k in o;
}

export type Handler = () => void;
export type HandlerOf<T> = (opt: T) => void;
export type RendererOf<T> = (props: T) => React.ReactNode;

/** Creates an io-ts type with a default value. */
/* Taken from https://github.com/gcanti/io-ts/blob/d8382e60685f17414942b1b04826168280c14f2e/test/helpers.ts#L101-L111 */
export function withDefault<T extends t.Mixed>(
  type: T,
  defaultValue: t.TypeOf<T>
): t.Type<t.TypeOf<T>, t.TypeOf<T>, unknown> {
  return new t.Type(
    `withDefault(${type.name}, ${JSON.stringify(defaultValue)})`,
    type.is,
    (v) => type.decode(v != null ? v : defaultValue),
    type.encode
  );
}

/** Build a custom runtime type for the specified Enum. */
export function makeEnumRuntimeType<T extends Object>(srcEnum: object) {
  const enumValues = new Set(Object.values(srcEnum));
  return new t.Type<T, string>(
    'Enum',
    (value: any): value is T => Boolean(value && enumValues.has(value)),
    (value, context) => {
      if (!value || !enumValues.has(value)) return t.failure(value, context);

      return t.success((value as any) as T);
    },
    (value) => value.toString()
  );
}
