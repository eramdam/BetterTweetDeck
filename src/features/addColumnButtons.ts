import './addColumnButtons.css';

import {compact, Dictionary} from 'lodash';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

const collapsedColumnsStorageKey = 'btd_collapsed_columns';

export const maybeAddColumnsButtons = makeBTDModule(({TD, jq, settings}) => {
  if (!window.localStorage.getItem(collapsedColumnsStorageKey)) {
    window.localStorage.setItem(collapsedColumnsStorageKey, JSON.stringify({}));
  }

  const {
    showClearButtonInColumnsHeader: showClear,
    showCollapseButtonInColumnsHeader: showCollapse,
    showRemoveButtonInColumnsHeader: showRemove,
  } = settings;

  if (!showClear && !showCollapse && !showRemove) {
    return;
  }

  const clearButtonMarkup = `<a class="js-action-header-button column-header-link btd-clear-column-link" href="#" data-action="clear"><i class="icon icon-clear-timeline"></i></a>`;
  const collapseButtonMarkup = `<a class="js-action-header-button column-header-link btd-toggle-collapse-column-link" href="#" data-action="toggle-collapse-column"><i class="icon icon-minus"></i></a>`;
  const removeButtonMarkup = `<a class="js-action-header-button column-header-link btd-remove-column-link" href="#" data-action="remove"><i class="icon icon-close"></i></a>`;

  modifyMustacheTemplate(TD, 'column/column_header.mustache', (string) => {
    const marker = '{{/withMarkAllRead}} {{^isTemporary}}';

    const additionalMarkup = compact([
      showClear && clearButtonMarkup,
      showCollapse && collapseButtonMarkup,
      showRemove && removeButtonMarkup,
    ]).join('');

    return string.replace(marker, marker + additionalMarkup);
  });

  jq(document).on('mousedown', '.btd-remove-column-link', (ev) => {
    ev.preventDefault();

    const element = ev.target;

    if (!isHTMLElement(element)) {
      return;
    }

    const thisColumn = element.closest('[data-column]');
    const columnKey = thisColumn?.getAttribute('data-column');
    if (!columnKey) {
      return;
    }

    TD.controller.columnManager.deleteColumn(columnKey);
  });

  jq(document).on('mousedown', '.btd-clear-column-link', (ev) => {
    ev.preventDefault();

    const element = ev.target;

    if (!isHTMLElement(element)) {
      return;
    }

    const thisColumn = element.closest('[data-column]');
    const columnKey = thisColumn?.getAttribute('data-column');
    if (!columnKey) {
      return;
    }

    TD.controller.columnManager.get(columnKey).clear();
  });

  jq(document).on(
    'mousedown',
    '.column-panel header.column-header .btd-toggle-collapse-column-link',
    (ev) => {
      ev.preventDefault();
      if (ev.which !== 1) {
        return;
      }

      const thisColumn = ev.target.closest('[data-column]');
      const columnKey = thisColumn.getAttribute('data-column');
      toggleCollapseColumn(TD, columnKey);
    }
  );

  const columnsSettings = getCollapsedColumnState();
  const collapsedColumnsKeys = Object.keys(columnsSettings).filter((k) => columnsSettings[k]);

  jq(document).on('uiColumnRendered', (ev, data) => {
    const {column} = data;

    const {key, apiid} = column.model.privateState;
    const isTrendingColumn = column?.model?.state?.type === 'trends';
    const headerLinks = document.querySelector(
      `section.column[data-column="${key}"] .column-header-links`
    );

    if (!headerLinks) {
      return;
    }

    if (isTrendingColumn && showRemove) {
      headerLinks?.insertAdjacentHTML('afterbegin', removeButtonMarkup);
    }
    if (isTrendingColumn && showCollapse) {
      headerLinks?.insertAdjacentHTML('afterbegin', collapseButtonMarkup);
    }

    if (collapsedColumnsKeys.includes(apiid)) {
      collapseColumn(apiid, key);
    }
  });
});

function getCollapsedColumnState(): Dictionary<boolean> {
  const rawData = window.localStorage.getItem(collapsedColumnsStorageKey) || '{}';
  try {
    const parsed = JSON.parse(rawData);
    return parsed || [];
  } catch (e) {
    console.error(e);
    return {};
  }
}

function saveCollapsedColumnState(state: Dictionary<boolean>) {
  window.localStorage.setItem(collapsedColumnsStorageKey, JSON.stringify(state));
}

function toggleCollapseColumn(TD: TweetDeckObject, columnKey: string) {
  const apiId = TD.controller.columnManager
    .getAllOrdered()
    .find((c) => c.model.privateState.key === columnKey)?.model.privateState.apiid;

  if (!apiId) {
    return;
  }
  const isCollapsed = getCollapsedColumnState()[apiId];

  if (isCollapsed) {
    uncollapseColumn(apiId, columnKey);
  } else {
    collapseColumn(apiId, columnKey);
  }
}

function collapseColumn(apiId: string, columnKey: string) {
  const columnNode = document.querySelector(`section.column[data-column="${columnKey}"]`);

  if (!columnNode) {
    return;
  }

  columnNode.classList.add('btd-column-collapsed');
  saveCollapsedColumnState({
    ...getCollapsedColumnState(),
    [apiId]: true,
  });
}

function uncollapseColumn(apiId: string, columnKey: string) {
  const columnNode = document.querySelector(`section.column[data-column="${columnKey}"]`);

  if (!columnNode) {
    return;
  }

  columnNode.classList.remove('btd-column-collapsed');
  saveCollapsedColumnState({
    ...getCollapsedColumnState(),
    [apiId]: false,
  });
}
