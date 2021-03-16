import {makeBTDModule} from '../types/btdCommonTypes';

export const makeSearchColumnsFirst = makeBTDModule(({settings, TD, jq}) => {
  if (!settings.addSearchColumnsFirst) {
    return;
  }

  jq(document).on('uiSearchNoTemporaryColumn', (_e, data) => {
    if (data.query && data.searchScope !== 'users' && !data.columnKey) {
      const order = TD.controller.columnManager._columnOrder;

      if (order.length > 1) {
        const columnKey = order[order.length - 1];

        order.splice(order.length - 1, 1);
        order.splice(1, 0, columnKey);
        TD.controller.columnManager.move(columnKey, 'left'); // syncs new column order & scrolls to the column
      }

      jq('.js-app-search-input').val('');
      jq('.js-perform-search').blur();
    }
  });
});
