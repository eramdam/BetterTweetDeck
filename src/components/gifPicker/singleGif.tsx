import React, {FC} from 'react';

import {Handler} from '../../helpers/typeHelpers';

export interface GifItemProps {
  previewUrl: string;
  width: number;
  height: number;
  onClick: Handler;
}
export const BTDGifItem: FC<GifItemProps> = (props) => {
  return (
    <div
      className="btd-giphy-block-wrapper"
      onClick={props.onClick}
      style={{height: 100, width: 100}}>
      <img
        src={props.previewUrl}
        className="btd-giphy-block"
        style={{
          objectFit: 'cover',
          height: '100%',
          width: '100%',
        }}
      />
    </div>
  );
};
