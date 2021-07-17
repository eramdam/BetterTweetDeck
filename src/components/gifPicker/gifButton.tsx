import '../gifButton.css';

import React from 'react';

import {DCFactory} from '../../helpers/domHelpers';
import {Handler} from '../../helpers/typeHelpers';

export const BTDGifButton: DCFactory<{
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
