import {makeBTDModule} from '../types/btdCommonTypes';

export const injectCustomCss = makeBTDModule(({settings}) => {
  if (settings.customCss.trim().length === 0) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'btd-custom-css';
  styleElement.appendChild(document.createTextNode(settings.customCss));
  document.head.appendChild(styleElement);
});
