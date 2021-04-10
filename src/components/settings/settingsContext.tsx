import Fuse from 'fuse.js';
import he from 'he';
import _ from 'lodash';
import React, {createContext, FC, Fragment, ReactNode, useContext, useRef} from 'react';

import {RendererOf} from '../../helpers/typeHelpers';
import {BTDSettings} from '../../types/btdSettingsTypes';
import {SettingsSeparator} from './components/settingsSeparator';

interface SettingsSearchItem {
  render: RendererOf<BTDSettings>;
  key: string;
  keywords: ReadonlyArray<string>;
}

interface SettingsSearchContextProps {
  addToIndex: (blob: SettingsSearchItem, settings: BTDSettings) => ReactNode;
  renderSearchResults: (query: string, settings: BTDSettings) => ReactNode;
  stopIndexing(): void;
}

export const SettingsSearchContext = createContext<SettingsSearchContextProps>({
  addToIndex: () => null,
  renderSearchResults: () => null,
  stopIndexing: () => {},
});

export const SettingsSearchProvider: FC = (props) => {
  const searchItems = useRef<Fuse<SettingsSearchItem>>(
    new Fuse([], {
      threshold: 0.4,
      distance: 200,
      keys: ['keywords'],
    })
  );
  const stopIndexingRef = useRef(false);

  return (
    <SettingsSearchContext.Provider
      value={{
        stopIndexing: () => {
          stopIndexingRef.current = true;
        },
        addToIndex: (item, settings) => {
          if (stopIndexingRef.current) {
            return item.render(settings);
          }

          const decodedKeywords = item.keywords.map((k) => he.decode(k));

          searchItems.current.add({
            ...item,
            keywords: [...decodedKeywords, decodedKeywords.join(' ')],
          });
          return item.render(settings);
        },
        renderSearchResults: (query, settings) => {
          return _(searchItems.current.search(query.trim()))
            .uniqBy((r) => r.item.key)

            .map((result) => {
              return (
                <Fragment key={result.item.key}>
                  {result.item.render(settings)}
                  <SettingsSeparator></SettingsSeparator>
                </Fragment>
              );
            })
            .value();
        },
      }}>
      {props.children}
    </SettingsSearchContext.Provider>
  );
};

export function useSettingsSearch() {
  const context = useContext(SettingsSearchContext);

  return context;
}
