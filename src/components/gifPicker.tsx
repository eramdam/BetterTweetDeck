import React from 'dom-chef';

import {DCFactory} from '../helpers/domHelpers';
import {Handler, HandlerOf} from '../helpers/typeHelpers';

interface GifPickerProps {
  onSearchInput: HandlerOf<string>;
  onCloseClick: Handler;
}
export const makeGifPicker: DCFactory<GifPickerProps> = (props) => {
  return (
    <div className="btd-giphy-zone compose">
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
        <div className="giphy-content"></div>
      </div>
    </div>
  );
};

interface GifItemProps {
  previewUrl: string;
  width: number;
  height: number;
  onClick: Handler;
}
export const makeGifItem: DCFactory<GifItemProps> = (props) => {
  return (
    <div className="btd-giphy-block-wrapper" onClick={props.onClick}>
      <img
        src={props.previewUrl}
        className="btd-giphy-block"
        height={props.height}
        width={props.width}
      />
    </div>
  );
};
