/* tslint:disable */
/* eslint-disable */
interface Config {
  FirefoxId: string;
  opera_key: string;
  Client: Client;
}
interface Client {
  github_token: string;
  debug: boolean;
  remote_inst: boolean;
  APIs: APIs;
  extension_ids: Extensionids;
}
interface Extensionids {
  chrome: Chrome;
  firefox: Chrome;
  opera: Chrome;
}
interface Chrome {
  release: string;
  beta: string;
}
interface APIs {
  dribbble: string;
  imgur: string;
  twitch: string;
  tinami: string;
  giphy: string;
  tenor: string;
}