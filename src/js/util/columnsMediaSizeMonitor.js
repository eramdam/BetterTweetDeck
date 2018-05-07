export const columnMediaSizes = new Map();


export const monitorMediaSizes = () => {
  $(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
    const id = ev.target.closest('.js-column').getAttribute('data-column');
    const size = data.value;

    columnMediaSizes.set(id, size);
  });

  $(document).on('dataColumns', (ev, data) => {
    const cols = data.columns
      .filter(col => col.model.state.settings)
      .map(col => ({
        id: col.model.privateState.key,
        mediaSize: col.model.state.settings.media_preview_size,
      }));

    if (columnMediaSizes.size !== cols.length) {
      columnMediaSizes.clear();
    }

    cols.filter(col => col.id).forEach((col) => {
      columnMediaSizes.set(col.id, col.mediaSize || 'medium');
    });
  });
}
;