import React, {FC} from 'react';
import {Portal, PortalWithState} from 'react-portal';

import {BTDFetchResult, BTDUrlProviderResultTypeEnum} from '../thumbnails/types';
import {BTDModalUuidAttribute, BTDUuidAttribute} from '../types/betterTweetDeck/btdCommonTypes';
import {FullscreenImageModal} from './fullscreenImageModal';
import {MediumThumbnail} from './mediaThumbnails';

type TweetThumbnailProps = {
  uuid: string;
  thumbnailPayload: BTDFetchResult;
};

function maybeDoOnNode(node: Element | null, cb: (node: Element) => void) {
  if (!node) {
    return;
  }
  cb(node);
}

export const TweetThumbnail: FC<TweetThumbnailProps> = ({uuid, thumbnailPayload}) => {
  const thumbnailNode = document.querySelector(
    `.column article[${BTDUuidAttribute}="${uuid}"] .js-tweet.tweet .tweet-body`
  );

  if (!thumbnailNode) {
    return null;
  }

  const fullscreenNodeRoot = document.getElementById('btd-fullscreen-portal-root');
  const fullscreenNode = document.getElementById('btd-fullscreen-portal-target');

  if (thumbnailPayload.type === BTDUrlProviderResultTypeEnum.ERROR) {
    return null;
  }

  const fullscreenImageUrl =
    (thumbnailPayload.type === BTDUrlProviderResultTypeEnum.IMAGE &&
      thumbnailPayload.fullscreenImageUrl) ||
    '';

  return (
    <PortalWithState
      node={fullscreenNode}
      closeOnEsc
      closeOnOutsideClick
      onOpen={() => {
        return maybeDoOnNode(fullscreenNodeRoot, (node) => {
          node.classList.add('open');
          node.setAttribute(BTDModalUuidAttribute, uuid);
        });
      }}
      onClose={() => {
        return maybeDoOnNode(fullscreenNodeRoot, (node) => {
          node.classList.remove('open');
          node.removeAttribute(BTDModalUuidAttribute);
        });
      }}>
      {({openPortal, portal, closePortal}) => (
        <>
          <Portal node={thumbnailNode}>
            <MediumThumbnail
              imageUrl={thumbnailPayload.thumbnailUrl}
              url={thumbnailPayload.url}
              onClick={openPortal}></MediumThumbnail>
          </Portal>
          {portal(
            <FullscreenImageModal
              onClose={closePortal}
              url={fullscreenImageUrl}></FullscreenImageModal>
          )}
        </>
      )}
    </PortalWithState>
  );
};
