import {makeBTDModule} from '../types/btdCommonTypes';

export const overrideTranslateLanguage = makeBTDModule(({TD, settings}) => {
  if (!settings.overrideTranslationLanguage) {
    return;
  }

  const isLanguageValid = TD.languages
    .getAllLanguages()
    .some((obj) => obj.code === settings.customTranslationLanguage);

  if (!isLanguageValid) {
    return;
  }

  TD.languages.getSystemLanguageCode = () => settings.customTranslationLanguage;
});
