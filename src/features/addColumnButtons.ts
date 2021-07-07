import './addColumnButtons.css';

import {compact, Dictionary} from 'lodash';
import {Key} from 'ts-key-enum';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {reloadColumn} from '../helpers/tweetdeckHelpers';
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
    showClearAllButtonInSidebar: showClearAll,
  } = settings;

  if (!showClear && !showCollapse && !showRemove) {
    return;
  }

  if (showClearAll) {
    document.body.setAttribute('btd-clear-all', 'true');
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

  if (showClearAll) {
    modifyMustacheTemplate(TD, 'topbar/app_header.mustache', (string) => {
      return string.replace(
        `{{_i}}Add column{{/i}}</div> </a>`,
        `{{_i}}Add column{{/i}}</div> </a> <a class="btd-clear-all-columns js-header-action link-clean cf app-nav-link padding-h--16 padding-v--2 txt-bold" data-action="clear-all" data-title="{{_i}}Clear all columns{{/i}}"> <div class="obj-left margin-l--2"> <i class="icon icon-clear-timeline icon-medium"></i> </div> <div class="nbfc padding-ts hide-condensed txt-size--14 txt-bold app-nav-link-text">{{_i}}Clear all columns{{/i}}</div> </a>`
      );
    });
  }

  jq(document).on('pointerdown', '.btd-remove-column-link', (ev) => {
    if (ev.button !== 0) {
      return;
    }
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

  jq(document).on('mouseover', '.btd-clear-column-link', (e) => {
    const setRegularIcon = () => {
      jq(e.currentTarget).find('.icon').attr('class', 'icon icon-clear-timeline');
    };
    const setShiftIcon = () => {
      jq(e.currentTarget).find('.icon').attr('class', 'icon icon-reload');
    };
    if (e.shiftKey) {
      setShiftIcon();
    } else {
      setRegularIcon();
    }

    jq(document).on('keydown', (e) => {
      if (e.key !== Key.Shift) {
        setRegularIcon();
        return;
      }

      setShiftIcon();
    });
    jq(document).on('keyup', (e) => {
      if (e.key !== Key.Shift) {
        setShiftIcon();
        return;
      }
      setRegularIcon();
    });
  });

  jq(document).on('mouseout', '.btd-clear-column-link', (e) => {
    jq(document).off('keydown');
    jq(document).off('keyup');
    jq(e.currentTarget).find('.icon').attr('class', 'icon icon-clear-timeline');
  });

  jq(document).on('pointerdown', '.btd-clear-column-link', (ev) => {
    if (ev.button !== 0) {
      return;
    }
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
    const col = TD.controller.columnManager.get(columnKey);
    if (!col) {
      return;
    }

    if (ev.shiftKey) {
      reloadColumn(col);
    } else {
      col.clear();
    }
  });

  jq(document).on(
    'pointerdown',
    '.column-panel header.column-header .btd-toggle-collapse-column-link',
    (ev) => {
      ev.preventDefault();
      if (ev.button !== 0) {
        return;
      }

      const thisColumn = ev.target.closest('[data-column]');
      const columnKey = thisColumn.getAttribute('data-column');
      toggleCollapseColumn(TD, columnKey);
    }
  );

  jq('body').on('click', '#column-navigator .column-nav-item', (ev) => {
    ev.preventDefault();

    const thisColumn = ev.target.closest('[data-column]');
    const columnKey = thisColumn.getAttribute('data-column');
    toggleCollapseColumn(TD, columnKey, true);
  });

  jq(document).on('mouseover', '.btd-clear-all-columns', (e) => {
    const target = jq(e.currentTarget);
    const setShiftIcon = () => {
      target.find('.icon').attr('class', 'icon-medium icon icon-reload');
      target.attr('data-title', 'Reload all columns');
      jq('.column-nav-flyout .column-nav-item').text('Reload all columns');
      target.find('.txt-bold').text('Reload all columns');
    };
    const setRegularIcon = () => {
      target.find('.icon').attr('class', 'icon-medium icon icon-clear-timeline');
      target.attr('data-title', 'Clear all columns');
      jq('.column-nav-flyout .column-nav-item').text('Clear all columns');
      target.find('.txt-bold').text('Clear all columns');
    };
    if (e.shiftKey) {
      setShiftIcon();
    } else {
      setRegularIcon();
    }

    jq(document).on('keydown', (e) => {
      if (e.key !== Key.Shift) {
        setRegularIcon();
        return;
      }

      setShiftIcon();
    });
    jq(document).on('keyup', (e) => {
      if (e.key !== Key.Shift) {
        setShiftIcon();
        return;
      }
      setRegularIcon();
    });
  });
  jq(document).on('mouseout', '.btd-clear-all-columns', (e) => {
    const target = jq(e.currentTarget);
    jq(document).off('keydown');
    jq(document).off('keyup');
    target.find('.icon').attr('class', 'icon-medium icon icon-clear-timeline');
    target.attr('data-title', 'Clear all columns');
    target.find('.txt-bold').text('Clear all columns');
  });

  jq(document).on('click', '.btd-clear-all-columns', (e) => {
    if (e.button !== 0) {
      return;
    }
    if (e.shiftKey) {
      TD.controller.columnManager.getAllOrdered().forEach((c) => {
        reloadColumn(c);
      });
      return;
    }
    const confirmed = confirm('This will clear ALL the columns, are you sure you want to do it?');
    if (!confirmed) {
      return;
    }
    TD.controller.columnManager.getAllOrdered().forEach((c) => {
      if (!c.clear) {
        return;
      }
      c.clear();
    });
  });

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

function toggleCollapseColumn(TD: TweetDeckObject, columnKey: string, bool?: boolean) {
  const apiId = TD.controller.columnManager
    .getAllOrdered()
    .find((c) => c.model.privateState.key === columnKey)?.model.privateState.apiid;

  if (!apiId) {
    return;
  }
  const isCollapsed = getCollapsedColumnState()[apiId];

  if (isCollapsed || bool) {
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
