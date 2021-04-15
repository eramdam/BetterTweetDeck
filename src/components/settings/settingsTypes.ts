import {HandlerOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';

export interface BaseSettingsProps<T extends keyof BTDSettings> {
  initialValue: BTDSettings[T];
  onChange: HandlerOf<BTDSettings[T]>;
}

export const translationLanguages = [
  {
    code: 'am',
    name: 'አማርኛ',
  },
  {
    code: 'ar',
    name: 'العربية',
  },
  {
    code: 'bg',
    name: 'Български',
  },
  {
    code: 'bn',
    name: 'বাংলা',
  },
  {
    code: 'bo',
    name: 'བོད་སྐད',
  },
  {
    code: 'ca',
    name: 'Català',
  },
  {
    code: 'chr',
    name: 'ᏣᎳᎩ',
  },
  {
    code: 'cs',
    name: 'čeština',
  },
  {
    code: 'da',
    name: 'Dansk',
  },
  {
    code: 'de',
    name: 'Deutsch',
  },
  {
    code: 'dv',
    name: 'ދިވެހި',
  },
  {
    code: 'el',
    name: 'Ελληνικά',
  },
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'es',
    name: 'Español',
  },
  {
    code: 'et',
    name: 'eesti',
  },
  {
    code: 'fa',
    name: 'فارسی',
  },
  {
    code: 'fi',
    name: 'Suomi',
  },
  {
    code: 'fr',
    name: 'Français',
  },
  {
    code: 'gu',
    name: 'ગુજરાતી',
  },
  {
    code: 'iw',
    name: 'עברית',
  },
  {
    code: 'hi',
    name: 'हिंदी',
  },
  {
    code: 'ht',
    name: 'Kreyòl ayisyen',
  },
  {
    code: 'hu',
    name: 'Magyar',
  },
  {
    code: 'hy',
    name: 'Հայերեն',
  },
  {
    code: 'in',
    name: 'Bahasa Indonesia',
  },
  {
    code: 'is',
    name: 'Íslenska',
  },
  {
    code: 'it',
    name: 'Italiano',
  },
  {
    code: 'iu',
    name: 'ᐃᓄᒃᑎᑐᑦ',
  },
  {
    code: 'ja',
    name: '日本語',
  },
  {
    code: 'ka',
    name: 'ქართული',
  },
  {
    code: 'km',
    name: 'ខ្មែរ',
  },
  {
    code: 'kn',
    name: 'ಕನ್ನಡ',
  },
  {
    code: 'ko',
    name: '한국어',
  },
  {
    code: 'lo',
    name: 'ລາວ',
  },
  {
    code: 'lt',
    name: 'Lietuvių',
  },
  {
    code: 'lv',
    name: 'latviešu valoda',
  },
  {
    code: 'ml',
    name: 'മലയാളം',
  },
  {
    code: 'my',
    name: 'မြန်မာဘာသာ',
  },
  {
    code: 'ne',
    name: 'नेपाली',
  },
  {
    code: 'nl',
    name: 'Nederlands',
  },
  {
    code: 'no',
    name: 'Norsk',
  },
  {
    code: 'or',
    name: 'ଓଡ଼ିଆ',
  },
  {
    code: 'pa',
    name: 'ਪੰਜਾਬੀ',
  },
  {
    code: 'pl',
    name: 'Polski',
  },
  {
    code: 'pt',
    name: 'Português',
  },
  {
    code: 'ro',
    name: 'limba română',
  },
  {
    code: 'ru',
    name: 'Русский',
  },
  {
    code: 'si',
    name: 'සිංහල',
  },
  {
    code: 'sk',
    name: 'slovenčina',
  },
  {
    code: 'sl',
    name: 'slovenski jezik',
  },
  {
    code: 'sv',
    name: 'Svenska',
  },
  {
    code: 'ta',
    name: 'தமிழ்',
  },
  {
    code: 'te',
    name: 'తెలుగు',
  },
  {
    code: 'th',
    name: 'ไทย',
  },
  {
    code: 'tl',
    name: 'Tagalog',
  },
  {
    code: 'tr',
    name: 'Türkçe',
  },
  {
    code: 'uk',
    name: 'українська мова',
  },
  {
    code: 'ur',
    name: 'ﺍﺭﺩﻭ',
  },
  {
    code: 'vi',
    name: 'Tiếng Việt',
  },
  {
    code: 'zh',
    name: '中文',
  },
];
