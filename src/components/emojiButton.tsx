import React from 'dom-chef';

import {DCFactory} from '../helpers/domHelpers';
import {Handler} from '../helpers/typeHelpers';

export const makeEmojiButton: DCFactory<{
  onClick: Handler;
}> = (props) => {
  return (
    <button
      className="js-add-emojis js-show-tip needsclick btn btn-on-blue full-width txt-left margin-b--12 padding-v--9"
      onClick={props.onClick}>
      <span className="js-add-image-button-label label padding-ls">Emojis</span>
    </button>
  );
};
