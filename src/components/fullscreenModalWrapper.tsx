import React, {FC} from 'react';

import {Handler} from '../helpers/typeHelpers';

interface FullscreenModalWrapperProps {
  onClose: Handler;
}

export const FullscreenModal: FC<FullscreenModalWrapperProps> = (props) => {
  return (
    <div className="js-mediatable ovl-block is-inverted-light" tabIndex={-1}>
      <div className="s-padded">
        <div className="js-modal-panel mdl s-full med-fullpanel">
          <a
            href="#"
            className="mdl-dismiss js-dismiss mdl-dismiss-media mdl-btn-media"
            onClick={props.onClose}
            rel="dismiss">
            <i className="icon txt-size--24 icon-close"></i>
          </a>
          <div
            className="js-embeditem med-embeditem is-loaded"
            data-btd-modal-content-sizer
            style={{
              bottom: 50,
            }}>
            <div className="l-table">
              <div className="l-cell">
                <div
                  className="med-tray js-mediaembed"
                  style={{
                    opacity: 1,
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}>
                  {props.children}
                </div>
              </div>
            </div>
          </div>
          <div id="media-gallery-tray"></div>
          <div className="js-med-tweet med-tweet"></div>
        </div>
      </div>
    </div>
  );
};
