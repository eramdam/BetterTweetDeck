import './changeAvatarShape.css';

import {makeBTDModule} from '../types/btdCommonTypes';

export const changeAvatarsShape = makeBTDModule(({settings}) => {
  document.body.setAttribute('btd-avatar-shape', settings.avatarsShape);
});
