declare module 'moduleraid' {
  export default function moduleraid(): {
    modules: any[];
    constructors: any[];
    get: (id: string) => any;
    findModule: (query: string) => any;
    findFunction: (query: string) => any[];
  };
}
