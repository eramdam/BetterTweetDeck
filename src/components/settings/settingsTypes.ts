import {HandlerOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/betterTweetDeck/btdSettingsTypes';

export interface BaseSettingsProps<T extends keyof BTDSettings> {
  initialValue: BTDSettings[T];
  onChange: HandlerOf<BTDSettings[T]>;
}
