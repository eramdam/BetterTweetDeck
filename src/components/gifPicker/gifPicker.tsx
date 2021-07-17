import {cx} from '@emotion/css';
import React, {FC} from 'react';

import {Handler, HandlerOf} from '../../helpers/typeHelpers';

interface GifPickerProps {
  onSearchInput: HandlerOf<string>;
  onCloseClick: Handler;
  isVisible?: boolean;
}
export const BTDGifPicker: FC<GifPickerProps> = (props) => {
  return (
    <div className={cx('btd-giphy-zone compose', props.isVisible && '-visible')}>
      <header className="js-compose-header compose-header">
        <div className="position-rel compose-title inline-block">
          <h1 className="js-compose-title compose-title-text txt-ellipsis inline-block">
            Add a GIF
          </h1>
        </div>
        <i
          onClick={props.onCloseClick}
          className="js-compose-close is-actionable icon icon-close margin-v--20 pull-right"></i>
      </header>
      <div className="giphy-searchbox">
        <input
          type="search"
          className="giphy-search-input"
          placeholder="Search..."
          onInput={(e) => {
            props.onSearchInput((e.target as HTMLInputElement).value);
          }}
        />
      </div>
      <div className="giphy-wrapper scroll-v scroll-styled-v">
        <div className="giphy-content">{props.children}</div>
      </div>
    </div>
  );
};
