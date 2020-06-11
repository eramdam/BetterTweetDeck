import React from 'dom-chef';

import {DCFactory} from '../../helpers/domHelpers';
import {Handler} from '../../helpers/typeHelpers';

interface GifButtonProps {
  onClick: Handler;
}
export const makeGifButton: DCFactory<GifButtonProps> = (props) => {
  return (
    <span onClick={props.onClick} className="btd-gif-button -visible color-twitter-dark-gray">
      GIF
    </span>
  );
};
