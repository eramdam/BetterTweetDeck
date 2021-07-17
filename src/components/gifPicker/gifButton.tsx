import '../gifButton.css';

import React, {FC} from 'react';

import {Handler} from '../../helpers/typeHelpers';

export const BTDGifButton: FC<{
  onClick: Handler;
}> = (props) => {
  const d = new Date();
  const fool = d.getDate() === 1 && d.getMonth() === 3;
  const GIFText = fool ? 'JIF' : 'GIF';

  return (
    <span onClick={props.onClick} className="btd-gif-button -visible color-twitter-dark-gray">
      {GIFText}
    </span>
  );
};
