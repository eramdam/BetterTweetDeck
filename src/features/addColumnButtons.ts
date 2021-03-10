import './addColumnButtons.css';

import {compact} from 'lodash';

import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

export const maybeAddColumnsButtons = makeBTDModule(({TD, jq, settings}) => {
  if (!window.localStorage.getItem('btd_collapsed_columns')) {
    window.localStorage.setItem('btd_collapsed_columns', JSON.stringify({}));
  }

  if (
    !settings.showClearButtonInColumnsHeader &&
    !settings.showCollapseButtonInColumnsHeader &&
    !settings.showRemoveButtonInColumnsHeader
  ) {
    return;
  }

  modifyMustacheTemplate(TD, 'column/column_header.mustache', (string) => {
    const marker = '{{/withMarkAllRead}} {{^isTemporary}}';
    const {
      showClearButtonInColumnsHeader: showClear,
      showCollapseButtonInColumnsHeader: showCollapse,
      showRemoveButtonInColumnsHeader: showRemove,
    } = settings;

    const additionalMarkup = compact([
      showClear &&
        `<a class="js-action-header-button column-header-link btd-clear-column-link" href="#" data-action="clear"><i class="icon icon-clear-timeline"></i></a>`,
      showCollapse &&
        `<a class="js-action-header-button column-header-link btd-toggle-collapse-column-link" href="#" data-action="toggle-collapse-column"><i class="icon icon-minus"></i></a>`,
      showRemove &&
        `<a class="js-action-header-button column-header-link btd-remove-column-link" href="#" data-action="remove"><i class="icon icon-close"></i></a>`,
    ]).join('');

    return string.replace(marker, marker + additionalMarkup);
  });

  overrideColumnPrototype(TD, jq);

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
      TD.controller.columnManager.get(columnKey)._btd.toggleCollapse();
    }
  );
});

function overrideColumnPrototype(TD: TweetDeckObject, jq: JQueryStatic) {
  ((originalColumn) => {
    TD.vo.Column = class BTDColumn extends originalColumn {
      constructor(...args: any[]) {
        super(...args);

        const _parent = this;
        this._btd = {
          _parent,
          _isCollapsed: false,
          isCollapsed() {
            return this._isCollapsed || false;
          },
          collapse() {
            const dataBoy = JSON.parse(window.localStorage.getItem('btd_collapsed_columns') || '');

            const columnKey = this._parent.model.privateState.key;
            const theColumn = jq(`section.column[data-column="${columnKey}"]`);
            theColumn.addClass('btd-column-collapsed');

            dataBoy[this._parent.model.privateState.apiid] = true;
            this._isCollapsed = true;
            window.localStorage.setItem('btd_collapsed_columns', JSON.stringify(dataBoy));
          },
          uncollapse() {
            const dataBoy = JSON.parse(window.localStorage.getItem('btd_collapsed_columns') || '');

            if (dataBoy[this._parent.model.privateState.apiid]) {
              const scroller = this._parent.ui.getChirpScroller();
              if (scroller.scrollTop() !== 0) {
                this._parent.ui.unpause();
              }

              const columnKey = this._parent.model.privateState.key;
              const theColumn = jq(`section.column[data-column="${columnKey}"]`);
              theColumn.removeClass('btd-column-collapsed');

              delete dataBoy[this._parent.model.privateState.apiid];
              this._isCollapsed = false;
              window.localStorage.setItem('btd_collapsed_columns', JSON.stringify(dataBoy));
              TD.controller.columnManager.showColumn(columnKey);
            }
          },
          toggleCollapse(state = false) {
            if (this._isCollapsed || state) {
              this.uncollapse();
            } else {
              this.collapse();
            }
          },
        };
      }
    };
  })(TD.vo.Column);
}
