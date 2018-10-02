import {ThumbnailDataMessage} from '../util/messaging';

type OnSetThumbnail = (payload: ThumbnailDataMessage) => void;
type OnRemoveThumbnail = () => void;

interface ThumbnailModalCoordinatorOptions {
  onSetThumbnail: OnSetThumbnail;
  onRemoveThumbnail: OnRemoveThumbnail;
}

export class ThumbnailModalCoordinator {
  private onSetThumbnail?: OnSetThumbnail;

  private onRemoveThumbnail?: OnRemoveThumbnail;

  setCallbacks({onSetThumbnail, onRemoveThumbnail}: ThumbnailModalCoordinatorOptions) {
    this.onRemoveThumbnail = onRemoveThumbnail;
    this.onSetThumbnail = onSetThumbnail;
  }

  setThumbnail(urlData: ThumbnailDataMessage) {
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
