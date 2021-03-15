import {makeBTDModule} from '../types/btdCommonTypes';

export const injectCustomCss = makeBTDModule(({settings}) => {
  if (settings.customCss.trim().length === 0 && !settings.useCustomColumnWidth) {
    console.log('skipping css');
    return;
  }

  const styleElement = document.querySelector('style');

  if (!styleElement || !styleElement.sheet) {
    console.log('no sheet css');
    return;
  }

  if (settings.customCss.trim().length) {
    styleElement.sheet.insertRule(settings.customCss, styleElement.sheet.cssRules.length);
  }

  if (settings.useCustomColumnWidth && settings.customColumnWidthValue.trim().length) {
    styleElement.sheet.insertRule(
      `
      section.column {
        width: ${settings.customColumnWidthValue} !important;
      }
    `,
      styleElement.sheet.cssRules.length
    );
  }
});
