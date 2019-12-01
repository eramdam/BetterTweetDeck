import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import './changeAvatarShape.css';

export enum BTDAvatarShapes {
  SQUARE = 'square',
  CIRCLE = 'circle',
}
export function changeAvatarsShape(settings: BTDSettings) {
  document.body.setAttribute('btd-avatar-shape', settings.avatarsShape);
}
