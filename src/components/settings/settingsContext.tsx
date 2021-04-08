import _ from 'lodash';
import React, {createContext, FC, Fragment, useContext, useRef} from 'react';

import {Renderer, RendererOf} from '../../helpers/typeHelpers';

interface SettingsSearchItem {
  render: Renderer;
  keywords: ReadonlyArray<string>;
}

interface SettingsSearchContextProps {
  addToIndex(blob: SettingsSearchItem): void;
  renderSearchResults: RendererOf<string>;
}

const SettingsSearchContext = createContext<SettingsSearchContextProps>({
  addToIndex: () => {},
  renderSearchResults: () => null,
});

export const SettingsSearchProvider: FC = (props) => {
  const searchItems = useRef<ReadonlyArray<SettingsSearchItem>>([]);

  return (
    <SettingsSearchContext.Provider
      value={{
        addToIndex: (item) => {
          searchItems.current = _(searchItems.current)
            .concat(item)
            .uniqBy((i) => i.keywords.join(''))
            .value();
        },
        renderSearchResults: (query) => {
          return searchItems.current
            .filter((item) =>
              item.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
            )
            .map((item, index) => {
              return <Fragment key={`${query}-${index}`}>{item.render()}</Fragment>;
            });
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
