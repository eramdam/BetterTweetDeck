import './showAvatarsInColumnsHeader.css';

import _ from 'lodash';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const showAvatarsInColumnsHeader = makeBTDModule(({TD, jq, settings}) => {
  if (!settings.showAvatarsOnTopOfColumns) {
    return;
  }

  document.body.setAttribute('btd-avatars-columns', 'true');

  modifyMustacheTemplate(TD, 'column/column_header.mustache', (str) => {
    return str.replace(
      '<div class="column-header-title',
      `
    <div class="column-avatar" />
    <div class="column-header-title
    `
    );
  });

  jq(document).on('dataColumns', (ev) => {
    const domColumns = document.querySelectorAll<HTMLElement>(
      '#container.js-app-columns-container section.js-column'
    );

    if (!domColumns.length) {
      return;
    }

    domColumns.forEach((domColumn) => {
      const columnId = domColumn.getAttribute('data-column');

      if (!columnId) {
        return;
      }

      const column = TD.controller.columnManager.get(columnId);

      if (!column || !column._feeds) {
        return;
      }

      if (column._feeds.length > 1) {
        domColumn.setAttribute('data-multi-account-feeds', 'true');
        return;
      }
      const clientKeys = _(column._feeds)
        .map((f) => f.privateState.key)
        .compact()
        .value();

      if (!clientKeys.length || !clientKeys[0]) {
        return;
      }

      const parts = clientKeys[0].split(':');
      const clientKey = [parts[0], parts[1]].join(':');
      const client = TD.controller.clients.getClient(clientKey);
      if (!client) {
        return;
      }

      const profileImageURL = client.oauth.account.state.profileImageURL.replace(
        'normal',
        '200x200'
      );

      domColumn.style.setProperty('--avatar-url', `url(${profileImageURL})`);
    });
  });
});
