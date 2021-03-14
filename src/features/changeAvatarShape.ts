import './changeAvatarShape.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export enum BTDAvatarShapes {
  SQUARE = 'square',
  CIRCLE = 'circle',
}
export const changeAvatarsShape = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-avatar-shape', settings.avatarsShape);
});
