const replaceInTemplate = (templates, templateName, ...replaceArgs) => {
  templates[`${templateName}.mustache`] = templates[`${templateName}.mustache`].replace(...replaceArgs);
};


export default function (templates, settingValue) {
  const replaceWrapper = (...args) => replaceInTemplate(templates, ...args);

  if (settingValue === 'username' || settingValue === 'inverted') {
    // general fullname template
    replaceWrapper('text/user_link_fullname', '{{#unsafe}}{{{name}}}{{/unsafe}}{{^unsafe}}{{name}}{{/unsafe}}', '{{#btd.usernameFromURL}}{{profileUrl}}{{/btd.usernameFromURL}}');

    // full tweet/activity
    replaceWrapper('status/tweet_single', '<a href="{{getProfileURL}}" rel="user" target="_blank">{{{emojifiedName}}}</a>', `
      <a href="{{getProfileURL}}" rel="user" target="_blank">{{#btd.usernameFromURL}}{{getProfileURL}}{{/btd.usernameFromURL}}</a>
    `);

    // "<name> added you" in a group conversation
    replaceWrapper('status/conversation_join_preview', '{{sender.name}}', '@{{sender.screenName}}');
    replaceWrapper(
      'status/conversation_join',
      '<a href="{{profileURL}}" rel="user" target="_blank">{{name}}</a>',
      '<a href="{{profileURL}}" rel="user" target="_blank">@{{#btd.usernameFromURL}}{{profileURL}}{{/btd.usernameFromURL}}</a>',
    );
  }

  switch (settingValue) {
    case 'fullname':
      // simple header on tweets in columns/DM conversations
      replaceWrapper('status/tweet_single_header', '<span class="username txt-mute">@{{screenName}}</span>', ' ');

      // DM conversation headers
      replaceWrapper('status/conversation_header', '@{{screenName}}</span>', '</span>');
      break;

    case 'username':
      // simple header on tweets in columns/DM conversations
      replaceWrapper('status/tweet_single_header', '<span class="username txt-mute">@{{screenName}}</span>', ' ');
      replaceWrapper('status/tweet_single_header', '<b class="fullname link-complex-target">{{{emojifiedName}}}</b>', '<b class="fullname link-complex-target">{{screenName}}</b>');

      // DM conversation headers
      replaceWrapper('status/conversation_header', '<b class="link-complex-target">{{{emojifiedName}}}</b> <span class="attribution username txt-mute txt-small">@{{screenName}}</span>', '<b class="link-complex-target">{{screenName}}</b>');

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
}
