import {BTDModule} from '../types/BTDTypes';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../types/tweetdeckTypes';

const columnMediaSizes: Map<string, TweetDeckColumnMediaPreviewSizesEnum> = new Map();

export function getSizeForColumnKey(columnKey = '') {
  return columnMediaSizes.get(columnKey) || TweetDeckColumnMediaPreviewSizesEnum.MEDIUM;
}

export const setupMediaSizeMonitor: BTDModule = () => {
  $(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
    if (!ev.target) {
      return;
    }

    // @ts-ignore
    const id = ev.target.closest('.js-column').getAttribute('data-column');
    const size = data.value;

    if (!id) {
      return;
    }

    columnMediaSizes.set(id, size);
  });

  $(document).on('dataColumns', (_, data) => {
    const cols = data.columns
      .filter((col: any) => col.model.state.settings)
      .map((col: any) => ({
        id: col.model.privateState.key,
        mediaSize: col.model.state.settings.media_preview_size,
      }));

    if (columnMediaSizes.size !== cols.length) {
      columnMediaSizes.clear();
    }

    cols
      .filter((col: any) => col.id)
      .forEach((col: any) => {
        columnMediaSizes.set(col.id, col.mediaSize || 'medium');
      });
  });
};
