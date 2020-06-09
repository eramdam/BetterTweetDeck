import React, {FC} from 'react';
import {Portal, PortalWithState} from 'react-portal';

import {maybeDoOnNode} from '../helpers/domHelpers';
import {BTDFetchResult, BTDUrlProviderResultTypeEnum} from '../thumbnails/types';
import {
  BTDModalUuidAttribute,
  BTDUuidAttribute,
  getFullscreenNode,
  getFullscreenNodeRoot,
} from '../types/betterTweetDeck/btdCommonTypes';
import {FullscreenImageModal} from './fullscreenImageModal';
import {MediumThumbnail} from './mediaThumbnails';

type TweetThumbnailProps = {
  uuid: string;
  thumbnailPayload: BTDFetchResult;
};

export const TweetThumbnail: FC<TweetThumbnailProps> = ({uuid, thumbnailPayload}) => {
  const thumbnailNode = document.querySelector(
    `.column article[${BTDUuidAttribute}="${uuid}"] .js-tweet.tweet .tweet-body`
  );

  if (!thumbnailNode) {
    return null;
  }

  if (thumbnailPayload.type === BTDUrlProviderResultTypeEnum.ERROR) {
    return null;
  }

  const fullscreenImageUrl =
    (thumbnailPayload.type === BTDUrlProviderResultTypeEnum.IMAGE &&
      thumbnailPayload.fullscreenImageUrl) ||
    '';

  return (
    <PortalWithState
      node={getFullscreenNode()}
      closeOnOutsideClick
      onOpen={() => {
        return maybeDoOnNode(getFullscreenNodeRoot(), (node) => {
          node.classList.add('open');
          node.setAttribute(BTDModalUuidAttribute, uuid);
        });
      }}
      onClose={() => {
        return maybeDoOnNode(getFullscreenNodeRoot(), (node) => {
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
