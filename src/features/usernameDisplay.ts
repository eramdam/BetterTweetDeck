import {compile} from 'hogan.js';
import {Dictionary} from 'lodash';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';

export enum BTDUsernameFormat {
  /** `Fullname @username` (default) */
  DEFAULT = 'both',
  /** `@username Fullname` */
  USER_FULL = 'inverted',
  /** `@username` */
  USER = 'username',
  /** `Fullname */
  FULL = 'fullname',
}

const replaceInTemplate = (
  templates: Dictionary<string>,
  templateName: string,
  ...replaceArgs: [string | RegExp, string]
) => {
  templates[`${templateName}.mustache`] = templates[`${templateName}.mustache`].replace(
    ...replaceArgs
  );
};

const Hogan = window.Hogan as {
  compile: compile;
};

export const maybeChangeUsernameFormat = makeBTDModule(({settings, TD}) => {
  const {usernamesFormat} = settings;

  TD.globalRenderOptions.btd = {
    // Use with
    // {{#btd.usernameFromURL}}myProfileURL{{/btd.usernameFromURL}}
    usernameFromURL: function usernameFromURL() {
      return function what(input, render) {
        // I don't want this function to break horribly the day Twitter closes this issue
        // https://github.com/twitter/hogan.js/issues/222#issuecomment-106101791
        const val = render ? render(input) : Hogan.compile(input).render(this);

        return (
          val.match(/https:\/\/(?:www.|)twitter.com\/(?:@|)([A-Za-z0-9_]+)/) &&
          val.match(/https:\/\/(?:www.|)twitter.com\/(?:@|)([A-Za-z0-9_]+)/)[1]
        );
      };
    },
  };

  const replaceWrapper = (templateName: string, ...replaceArgs: [string | RegExp, string]) =>
    replaceInTemplate(TD.mustaches, templateName, ...replaceArgs);

  if (usernamesFormat === 'username' || usernamesFormat === 'inverted') {
    // general fullname template
    replaceWrapper(
      'text/user_link_fullname',
      '{{#unsafe}}{{{name}}}{{/unsafe}}{{^unsafe}}{{name}}{{/unsafe}}',
      '{{#btd.usernameFromURL}}{{profileUrl}}{{/btd.usernameFromURL}}'
    );

    // full tweet/activity
    replaceWrapper(
      'status/tweet_single',
      '<a href="{{getProfileURL}}" rel="user" target="_blank">{{{emojifiedName}}}</a>',
      `
      <a href="{{getProfileURL}}" rel="user" target="_blank">{{#btd.usernameFromURL}}{{getProfileURL}}{{/btd.usernameFromURL}}</a>
    `
    );

    // "<name> added you" in a group conversation
    replaceWrapper('status/conversation_join_preview', '{{sender.name}}', '@{{sender.screenName}}');
    replaceWrapper(
      'status/conversation_join',
      '<a href="{{profileURL}}" rel="user" target="_blank">{{name}}</a>',
      '<a href="{{profileURL}}" rel="user" target="_blank">@{{#btd.usernameFromURL}}{{profileURL}}{{/btd.usernameFromURL}}</a>'
    );
  }

  switch (usernamesFormat) {
    case 'fullname':
      // simple header on tweets in columns/DM conversations
      replaceWrapper(
        'status/tweet_single_header',
        '<span class="username txt-mute">@{{screenName}}</span>',
        ' '
      );

      // DM conversation headers
      replaceWrapper('status/conversation_header', '@{{screenName}}</span>', '</span>');
      break;

    case 'username':
      // simple header on tweets in columns/DM conversations
      replaceWrapper(
        'status/tweet_single_header',
        '<span class="username txt-mute">@{{screenName}}</span>',
        ' '
      );
      replaceWrapper(
        'status/tweet_single_header',
        '<b class="fullname link-complex-target">{{{emojifiedName}}}</b>',
        '<b class="fullname link-complex-target">{{screenName}}</b>'
      );

      // DM conversation headers
      replaceWrapper(
        'status/conversation_header',
        '<b class="link-complex-target">{{{emojifiedName}}}</b> <span class="attribution username txt-mute txt-small">@{{screenName}}</span>',
        '<b class="link-complex-target">{{screenName}}</b>'
      );

      // DM conversation headers
      replaceWrapper('status/conversation_header', /{{{emojifiedName}}}/g, '{{screenName}}');
      break;

    // Username - fullname
    case 'inverted':
      // simple header on tweets in columns/DM conversations
      replaceWrapper('status/tweet_single_header', '{{{emojifiedName}}}', '{{screenName}}');
      replaceWrapper('status/tweet_single_header', '@{{screenName}}', '{{{emojifiedName}}}');

      // DM conversation headers
      replaceWrapper('status/conversation_header', /{{{emojifiedName}}}/g, '{{screenName}}');
      replaceWrapper('status/conversation_header', /@{{screenName}}/g, '{{{emojifiedName}}}');
      break;

    default:
      break;
  }
});
