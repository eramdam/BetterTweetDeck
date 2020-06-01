import React, {CSSProperties, FC, useRef, useState} from 'react';
import useResizeObserver from 'use-resize-observer';

import {Handler, RendererOf} from '../helpers/typeHelpers';

interface FullscreenModalWrapperProps {
  children: RendererOf<{style: CSSProperties}>;
  onClose: Handler;
}

export const FullscreenModalWrapper: FC<FullscreenModalWrapperProps> = (props) => {
  const embedItemRef = useRef<HTMLDivElement>(null);
  const [imageStyles, setImageStyles] = useState<CSSProperties>({});

  useResizeObserver({
    ref: embedItemRef,
    onResize: (dimensions) => {
      setImageStyles({
        maxWidth: dimensions.width,
        maxHeight: dimensions.height,
      });
    },
  });

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
          <div className="js-embeditem med-embeditem is-loaded" ref={embedItemRef}>
            <div className="l-table">
              <div className="l-cell">
                <div
                  className="med-tray js-mediaembed"
                  style={{
                    opacity: 1,
                  }}>
                  {props.children({style: imageStyles})}
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
