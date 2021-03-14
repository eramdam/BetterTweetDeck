import {makeBTDModule} from '../types/btdCommonTypes';

export const pauseColumnsOnHover = makeBTDModule(({jq, TD, settings}) => {
  if (settings && !settings.pauseColumnScrollingOnHover) {
    return;
  }

  jq('body').on(
    {
      mouseenter: (ev) => {
        const thisColumn = ev.target.closest('[data-column]');
        const columnKey = thisColumn.getAttribute('data-column');
        const column = TD.controller.columnManager.get(columnKey);
        const scroller = column.ui.getChirpScroller();
        if (scroller.scrollTop() === 0) {
          column.ui.pause();
        }
      },
      mouseleave: (ev) => {
        const thisColumn = ev.target.closest('[data-column]');
        const columnKey = thisColumn.getAttribute('data-column');
        const column = TD.controller.columnManager.get(columnKey);
        const scroller = column.ui.getChirpScroller();
        if (scroller.scrollTop() === 1) {
          column.ui.unpause();
        }
      },
    },
    'section.column'
  );
});
