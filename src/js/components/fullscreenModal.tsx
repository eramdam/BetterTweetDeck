import React, {createRef, PureComponent, RefObject} from 'react';
import {Portal} from 'react-portal';
import {Key} from 'ts-key-enum';

import {BTDThumbnailDataResults, BTDUrlProviderResultTypeEnum} from '../thumbnails/types';
import {Handler, HandlerOf} from '../types';

interface FullscreenModalProps {
  urlData: BTDThumbnailDataResults;
  onRequestClose: Handler;
}

export class FullscreenModal extends PureComponent<FullscreenModalProps> {
  constructor(props: FullscreenModalProps) {
    super(props);

    // 💥 Remove anything living in the modal already before we mount.
    const modalNode = document.querySelector('#open-modal');
    this.contentRef = createRef<HTMLElement>();

    if (!modalNode) {
      return;
    }

    modalNode.childNodes.forEach(e => e.remove());
    modalNode.setAttribute('style', 'display: block');
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);

    const modalNode = document.querySelector('#open-modal');
    if (!modalNode) {
      return;
    }

    modalNode.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown);
    const modalNode = document.querySelector('#open-modal');

    if (!modalNode) {
      return;
    }

    modalNode.setAttribute('style', 'display: none');
    modalNode.removeEventListener('click', this.handleClick);
  }

  private handleClick: EventListenerOrEventListenerObject = (ev) => {
    if (ev.currentTarget !== ev.target) {
      return;
    }

    this.props.onRequestClose();
  };

  private handleKeydown: HandlerOf<KeyboardEvent> = (ev) => {
    if (ev.key !== Key.Escape) {
      return;
    }

    this.props.onRequestClose();
  };

  private contentRef: RefObject<HTMLElement>;

  private readonly renderContent = () => {
    const {urlData} = this.props;

    if (urlData.type === BTDUrlProviderResultTypeEnum.VIDEO) {
      return null;
    }

    return (
      <img
        src={urlData.fullscreenImageUrl}
        alt=""
        ref={this.contentRef as any}
        style={{
          maxWidth: '80vw',
          maxHeight: '80vh',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)'
        }}
      />
    );
  };

  render() {
    return <Portal node={document.querySelector('#open-modal')}>{this.renderContent()}</Portal>;
  }
}
