import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import {BTDUrlProviderResultTypeEnum} from '../thumbnails/types';
import {BTD_CUSTOM_ATTRIBUTE} from '../types';
import {ThumbnailDataMessage} from '../util/messaging';
import {ThumbnailModalCoordinator} from './thumbnailModalCoordinator';

interface ThumbnailModalContainerProps {
  coordinator: ThumbnailModalCoordinator;
}

interface ThumbnailModalContainerState {
  modalData: ThumbnailDataMessage | null;
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

    const {payload} = modalData;

    if (!payload) {
      return null;
    }

    switch (payload.type) {
      case BTDUrlProviderResultTypeEnum.ERROR:
        return null;

      case BTDUrlProviderResultTypeEnum.IMAGE:
        return <div>{payload.url}</div>;

      case BTDUrlProviderResultTypeEnum.VIDEO:
        return <div>{payload.url}</div>;

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
