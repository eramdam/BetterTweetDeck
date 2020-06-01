import React, {FC} from 'react';

import {Handler} from '../helpers/typeHelpers';
import {FullscreenModalWrapper} from './fullscreenModalWrapper';

type FullscreenImageModalProps = {
  url: string;
  onClose: Handler;
};

export const FullscreenImageModal: FC<FullscreenImageModalProps> = ({url, onClose}) => {
  return (
    <FullscreenModalWrapper onClose={onClose}>
      {({style}) => {
        return <img src={url} alt="" style={style} />;
      }}
    </FullscreenModalWrapper>
  );
};
