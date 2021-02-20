declare module 'moduleraid' {
  type Predicate = (mod: any) => boolean;

  export default interface moduleraid {
    modules: any[];
    constructors: any[];
    get: (id: string) => any;
    findModule: (query: string | Predicate) => any;
    findFunction: (query: string) => any[];
  }
}
