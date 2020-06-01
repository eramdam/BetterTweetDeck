import {isHTMLElement} from '../helpers/domHelpers';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export const maybeAddColumnsButtons = makeBTDModule(({settings, TD, $}) => {
  modifyMustacheTemplate(TD, 'column/column_header.mustache', (string) => {
    const marker = '{{/withMarkAllRead}} {{^isTemporary}}';
    return string.replace(
      marker,
      marker +
        `<a class="js-action-header-button column-header-link btd-clear-column-link" href="#" data-action="clear"><i class="icon icon-clear-timeline"></i></a>`
    );
  });

  $(document).on('mousedown', '.btd-clear-column-link', (ev) => {
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
});
