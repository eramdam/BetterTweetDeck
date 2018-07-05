declare module 'moduleraid' {
  export default function moduleRaid(): {
    modules: any[]
    constructors: any[]
    findFunction: (query: string) => any[]
    findModule: (query: string) => any[]
  }
}