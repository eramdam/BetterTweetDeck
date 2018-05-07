
import { BTDComponent } from '../util/btdClass';


export class ColumnsMediaSizeKeeper extends BTDComponent {
  mediaSizes = new Map()

  init() {
    $(document).on('uiColumnUpdateMediaPreview', (ev, data) => {
      const id = ev.target.closest('.js-column').getAttribute('data-column');
      const size = data.value;

      this.mediaSizes.set(id, size);
    });

    $(document).on('dataColumns', (ev, data) => {
      const cols = data.columns
        .filter(col => col.model.state.settings)
        .map(col => ({
          id: col.model.privateState.key,
          mediaSize: col.model.state.settings.media_preview_size,
        }));

      if (this.mediaSizes.size !== cols.length) {
        this.mediaSizes.clear();
      }

      cols.filter(col => col.id).forEach((col) => {
        this.mediaSizes.set(col.id, col.mediaSize || 'medium');
      });
    });
  }
}
