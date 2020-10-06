import {RendererOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';

export function makeSettingsRow<T extends keyof BTDSettings>(
  key: T,
  render: RendererOf<BTDSettings[T]>
) {
  return {
    render,
    id: key,
  };
}

export interface SettingsSection {
  id: string;
  content: readonly SettingsRow<keyof BTDSettings>[];
}
