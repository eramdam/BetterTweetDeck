import {makeBTDModule} from '../types/btdCommonTypes';

export const injectCustomCss = makeBTDModule(({settings}) => {
  if (settings.customCss.trim().length === 0 && !settings.useCustomColumnWidth) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'btd-custom-css';

  if (!styleElement) {
    return;
  }

  if (settings.customCss.trim().length) {
    styleElement.appendChild(document.createTextNode(settings.customCss));
  }

  if (settings.useCustomColumnWidth && settings.customColumnWidthValue.trim().length) {
    styleElement.appendChild(
      document.createTextNode(`
    section.column {
      width: ${settings.customColumnWidthValue} !important;
    }
  `)
    );
  }

  document.head.appendChild(styleElement);
});
