import * as t from 'io-ts';

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

/** Creates an io-ts type with a default value. */
/* Taken from https://github.com/gcanti/io-ts/blob/d8382e60685f17414942b1b04826168280c14f2e/test/helpers.ts#L101-L111 */
export function withDefault<A, O, I>(type: t.Type<A, O, I>, defaultValue: I) {
  return new t.Type<A, O, I>(
    type.name,
    type.is,
    (v, context) => {
      return type.validate(v != null ? v : defaultValue, context);
    },
    type.encode
  );
}
