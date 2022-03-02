import React, {FC} from 'react';

import {Handler} from '../../helpers/typeHelpers';

export interface GifItemProps {
  previewUrl: string;
  onClick: Handler;
}
export const BTDGifItem: FC<GifItemProps> = (props) => {
  return (
    <div
      className="btd-giphy-block-wrapper"
      onClick={props.onClick}
      style={{height: 100, width: `calc(100% / 3)`, display: 'inline-block'}}>
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
