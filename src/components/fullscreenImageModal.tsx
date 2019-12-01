import React, {FC} from 'react';

type FullscreenImageModalProps = {
  url: string;
};

export const FullscreenImageModal: FC<FullscreenImageModalProps> = ({url}) => {
  return (
    <div id="fullscreen-modal-content">
      <img src={url} alt="" />
    </div>
  );
};
