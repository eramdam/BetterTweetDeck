// From https://github.com/JedWatson/classnames/pull/103

declare module 'classnames' {
  declare type ClassValue = | string
    | number
    | ClassDictionary
    | ClassArray
    | undefined
    | null
    | false;
  interface ClassDictionary {
    [id: string]: boolean | undefined | null;
  }
  interface ClassArray extends Array<ClassValue> {}
  interface ClassNamesFn {
    (...classes: ClassValue[]): string;
  }

  declare const classNames: ClassNamesFn;

  export default classNames;
}
