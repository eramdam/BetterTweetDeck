import './addTweetMenuItems.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {listenToRedraftTweetEvent} from './redraftTweet';

export const maybeAddTweetMenuItems = makeBTDModule((options) => {
  const {settings, TD, jq} = options;
  const menuItems = settings.tweetMenuItems;
  if (!menuItems) {
    return;
  }

  modifyMustacheTemplate(TD, 'menus/actions.mustache', (string) => {
    const marker = '{{/isOwnChirp}} {{/chirp}} </ul>';

    const {addRedraftMenuItem, addMuteHashtagsMenuItems, addMuteSourceMenuItem} = menuItems;

    const additions = [
      addRedraftMenuItem &&
        `  
      <li class="is-selectable">
        <a href="#" data-btd-action="edit-tweet">{{_i}}Re-draft{{/i}}</a>
      </li>
      `,
      '{{/isOwnChirp}}',
      addMuteSourceMenuItem &&
        `<li class="is-selectable">
        <a href="#" data-btd-action="mute-source" data-btd-source="{{sourceNoHTML}}">Mute "{{sourceNoHTML}}"</a>
      </li>`,
      addMuteHashtagsMenuItems &&
        `{{#entities.hashtags}}
        <li class="is-selectable">
          <a href="#" data-btd-action="mute-hashtag" data-btd-hashtag="{{text}}">Mute #{{text}}</a>
        </li>
      {{/entities.hashtags}}`,
      '{{/chirp}}</ul>',
    ];

    return string.replace(marker, `${additions.filter((i) => !!i).join('')}`);
  });

  jq('body').on('click', '[data-btd-action="mute-hashtag"]', (ev) => {
    ev.preventDefault();
    const hashtag = jq(ev.target).data('btd-hashtag');

    TD.controller.filterManager.addFilter('phrase', `#${hashtag}`);
  });

  jq('body').on('click', '[data-btd-action="mute-source"]', (ev) => {
    ev.preventDefault();
    const source = jq(ev.target).data('btd-source');

    TD.controller.filterManager.addFilter('source', source);
  });

  listenToRedraftTweetEvent(options);
});
