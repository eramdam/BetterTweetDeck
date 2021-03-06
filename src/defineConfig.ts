// This file is auto-generated by tools/createDefineConfig.ts
interface BtdClientConfig {
  debug: boolean;
  APIs: APIs;
  github_token: string;
}
interface APIs {
  giphy: string;
  tenor: string;
  dribbble: string;
  imgur: string;
  twitch: string;
  tinami: string;
}
declare const __BTD_CONFIG: BtdClientConfig;
export const BtdConfig = __BTD_CONFIG as BtdClientConfig;
