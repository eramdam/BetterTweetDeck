import {useEffect, useState} from 'react';

import {getCurrentTheme, onThemeChange} from './tweetdeckHelpers';

export function useTweetdeckTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getCurrentTheme());

  useEffect(() => {
    onThemeChange(setTheme);
  }, [setTheme]);

  return theme;
}
