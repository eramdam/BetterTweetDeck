import {css} from '@emotion/css';
import React, {useCallback, useEffect} from 'react';

import {BTDSettings} from '../../types/btdSettingsTypes';
import {SettingsRow, SettingsRowTitle} from './components/settingsRow';
import {useSettingsSearch} from './settingsContext';
import {MenuItem, SettingsMenuSectionsEnum} from './settingsMenu';

interface SettingsModalContentProps {
  settings: BTDSettings;
  selectedId: SettingsMenuSectionsEnum;
  searchQuery: string;
  menu: ReadonlyArray<MenuItem>;
}

export const SettingsModalSearchContent = (props: SettingsModalContentProps) => {
  const {renderSearchResults: internalRenderSearchResults, stopIndexing} = useSettingsSearch();
  const {searchQuery, selectedId, menu} = props;

  useEffect(() => {
    stopIndexing();
  }, [stopIndexing]);

  const renderSearchResults = useCallback(
    (query: string) => {
      console.time('search');
      const res = internalRenderSearchResults(query);
      console.timeEnd('search');
      return res;
    },
    [internalRenderSearchResults]
  );

  const renderSelectedPage = () => {
    const menuSection = menu
      .find((s) => s.items.find((s) => s.id === selectedId))
      ?.items.find((s) => s.id === selectedId);

    return menuSection?.render() || null;
  };

  if (!searchQuery) {
    return <>{renderSelectedPage()}</>;
  }

  return (
    <SettingsRow>
      <SettingsRowTitle
        className={css`
          font-size: 24px;
        `}>
        Search results
      </SettingsRowTitle>
      <div
        className={css`
          > div {
            padding-left: 20px;
          }
        `}>
        {renderSearchResults(searchQuery)}
      </div>
    </SettingsRow>
  );
};
