import _ from 'lodash';
import React, {createContext, FC, Fragment, useContext, useRef} from 'react';

import {Renderer, RendererOf} from '../../helpers/typeHelpers';

interface SettingsSearchItem {
  render: Renderer;
  key: string;
  keywords: ReadonlyArray<string>;
}

interface SettingsSearchContextProps {
  addToIndex(blob: SettingsSearchItem): void;
  renderSearchResults: RendererOf<string>;
  stopIndexing(): void;
}

export const SettingsSearchContext = createContext<SettingsSearchContextProps>({
  addToIndex: () => {},
  renderSearchResults: () => null,
  stopIndexing: () => {},
});

export const SettingsSearchProvider: FC = (props) => {
  const searchItems = useRef<ReadonlyArray<SettingsSearchItem>>([]);
  const stopIndexingRef = useRef(false);

  return (
    <SettingsSearchContext.Provider
      value={{
        stopIndexing: () => {
          stopIndexingRef.current = true;
        },
        addToIndex: (item) => {
          if (stopIndexingRef.current) {
            return;
          }

          searchItems.current = _(searchItems.current)
            .concat(item)
            .uniqBy((i) => i.key)
            .value();
        },
        renderSearchResults: (query) => {
          return _(searchItems.current)
            .filter((item) =>
              item.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
            )
            .map((item, index) => {
              return <Fragment key={`${query}-${index}`}>{item.render()}</Fragment>;
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
