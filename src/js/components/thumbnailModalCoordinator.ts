import {BTDThumbnailDataResults} from '../thumbnails/types';

type OnSetThumbnail = (payload: BTDThumbnailDataResults) => void;
type OnRemoveThumbnail = () => void;

interface ThumbnailModalCoordinatorOptions {
  onSetThumbnail: OnSetThumbnail;
  onRemoveThumbnail: OnRemoveThumbnail;
}

export class ThumbnailModalCoordinator {
  private onSetThumbnail?: OnSetThumbnail;

  private onRemoveThumbnail?: OnRemoveThumbnail;

  setCallbacks({onSetThumbnail, onRemoveThumbnail}: Partial<ThumbnailModalCoordinatorOptions>) {
    this.onRemoveThumbnail = onRemoveThumbnail;
    this.onSetThumbnail = onSetThumbnail;
  }

  setThumbnail(urlData: BTDThumbnailDataResults) {
    if (this.onSetThumbnail) {
      this.onSetThumbnail(urlData);
    }
  }

  removeThumbnail() {
    if (this.onRemoveThumbnail) {
      this.onRemoveThumbnail();
    }
  }
}
