import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {BTDThumbnailDataResults, BTDUrlProviderResultTypeEnum} from '../thumbnails/types';
import {BTD_CUSTOM_ATTRIBUTE} from '../types';
import {ThumbnailModalCoordinator} from './thumbnailModalCoordinator';

interface ThumbnailModalContainerProps {
  coordinator: ThumbnailModalCoordinator;
}

interface ThumbnailModalContainerState {
  modalData: BTDThumbnailDataResults | null;
}

class ThumbnailModalContainer extends Component<ThumbnailModalContainerProps, ThumbnailModalContainerState> {
  constructor(props: ThumbnailModalContainerProps) {
    super(props);

    this.state = {
      modalData: null
    };

    props.coordinator.setCallbacks({
      onSetThumbnail: (modalData) => {
        this.setState({
          modalData
        });
      },
      onRemoveThumbnail: () => {
        this.setState({
          modalData: null
        });
      }
    });
  }

  render() {
    const {modalData} = this.state;
    if (!modalData) {
      return null;
    }

    switch (modalData.type) {
      case BTDUrlProviderResultTypeEnum.IMAGE:
        return <div>{modalData.url}</div>;

      case BTDUrlProviderResultTypeEnum.VIDEO:
        return <div>{modalData.url}</div>;

      default:
        return null;
    }
  }
}

export function setUpThumbnailsModals(coordinator: ThumbnailModalCoordinator) {
  const appRoot = document.querySelector('.application');

  if (!appRoot) {
    throw new Error('No TweetDeck .application element found, cannot set up thumbnail modals.');
  }

  const modalElement = document.createElement('div');
  modalElement.setAttribute(BTD_CUSTOM_ATTRIBUTE, '');
  modalElement.setAttribute('class', 'btd-custom-modal');
  appRoot.insertAdjacentElement('beforeend', modalElement);

  ReactDOM.render(<ThumbnailModalContainer coordinator={coordinator} />, modalElement);
}
