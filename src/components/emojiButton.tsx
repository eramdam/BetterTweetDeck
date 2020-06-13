import React from 'dom-chef';

import {DCFactory} from '../helpers/domHelpers';
import {Handler} from '../helpers/typeHelpers';

export const makeEmojiButton: DCFactory<{
  onClick: Handler;
}> = (props) => {
  return (
    <div
      style={{
        height: 20,
        position: 'absolute',
        top: 10,
        right: 10,
        width: 20,
        background: 'red',
        display: 'block',
      }}
      onClick={props.onClick}></div>
  );
};
