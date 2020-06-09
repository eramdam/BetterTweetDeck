import React, {FC} from 'react';

import {Handler} from '../../helpers/typeHelpers';

interface GifButtonProps {
  onClick: Handler;
}
export const GifButton: FC<GifButtonProps> = (props) => {
  return (
    <span onClick={props.onClick} className="btd-gif-button -visible color-twitter-dark-gray">
      GIF
    </span>
  );
};
