import React, {FC} from 'react';

import {FullscreenModalWrapper} from './fullscreenModalWrapper';

type FullscreenImageModalProps = {
  url: string;
};

export const FullscreenImageModal: FC<FullscreenImageModalProps> = ({url}) => {
  return (
    <FullscreenModalWrapper>
      {({style}) => {
        return <img src={url} alt="" style={style} />;
      }}
    </FullscreenModalWrapper>
  );
};
