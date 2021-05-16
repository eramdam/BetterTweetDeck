import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckColumn} from '../types/tweetdeckTypes';
import {TweetDeckColumnMediaPreviewSizesEnum} from '../types/tweetdeckTypes';

const columnMediaSizes: Map<string, TweetDeckColumnMediaPreviewSizesEnum> = new Map();

/** Returns the media size chosen for a specific column key. */
export function getSizeForColumnKey(columnKey = '') {
  return columnMediaSizes.get(columnKey) || TweetDeckColumnMediaPreviewSizesEnum.MEDIUM;
}

/** Sets up a Map that stores the media size of TweetDeck columns for easy and quick access (without having to go through the state) */
export const setupMediaSizeMonitor = makeBTDModule(({jq}) => {
  jq(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
    if (!ev.target) {
      return;
    }

    // @ts-ignore
    const id = ev.target.closest('.js-column').getAttribute('data-column');
    const size = data.value;
    // @ts-ignore
    ev.target.closest('.js-column').setAttribute('data-column-size', size);

    if (!id) {
      return;
    }

    columnMediaSizes.set(id, size);
  });

  function onDataColumns(data: {columns: TweetDeckColumn[]}) {
    const cols = data.columns
      .filter((col) => col.model.state.settings)
      .map((col) => ({
        id: col.model.privateState.key,
        mediaSize: col.model.state.settings.media_preview_size,
      }));

    if (columnMediaSizes.size !== cols.length) {
      columnMediaSizes.clear();
    }

    cols
      .filter((col) => col.id)
      .forEach((col) => {
        columnMediaSizes.set(col.id, col.mediaSize || 'medium');
        document
          .querySelector(`[data-column=${col.id}]`)
          ?.setAttribute('data-column-size', col.mediaSize || 'medium');
      });
  }

  jq(document).on('dataColumns', (_, data) => {
    onDataColumns(data);
  });
});
