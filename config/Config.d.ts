/* tslint:disable */
/* eslint-disable */
declare module "node-config-ts" {
  interface IConfig {
    FirefoxId: string
    crx_key: string
    Client: Client
  }
  interface Client {
    github_token: string
    debug: boolean
    remote_inst: boolean
    APIs: APIs
    extension_ids: Extensionids
  }
  interface Extensionids {
    chrome: Chrome
    firefox: Chrome
    opera: Chrome
  }
  interface Chrome {
    release: string
    beta: string
  }
  interface APIs {
    dribbble: string
    imgur: string
    twitch: string
    tinami: string
    giphy: string
    tenor: string
  }
  export const config: Config
  export type Config = IConfig
}
