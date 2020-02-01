import 'brace/mode/css';
import 'brace/theme/solarized_light';
import '../css/options/index.css';

import { createApolloFetch } from 'apollo-fetch';
import * as ace from 'brace';
import config from 'config';
import fecha from 'fecha';
import $ from 'jquery';
import { forEach, isBoolean, isObject, isString } from 'lodash';
import marked from 'marked';
import Prism from 'prismjs';
import queryString from 'query-string';

import * as BHelper from '../js/util/browserHelper';
import { schemeWhitelist } from '../js/util/thumbnails';

const CSS_EDITOR = ace.edit('custom-css-editor');
CSS_EDITOR.getSession().setMode('ace/mode/css');
CSS_EDITOR.setTheme('ace/theme/solarized_light');

const GITHUB_URI = 'https://api.github.com/graphql';
const GITHUB_RELEASES_QUERY = `
query BTDReleases {
  viewer {
    repository(name: "BetterTweetDeck") {
      id
      releases(last: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
        edges {
          node {
            id
            name
            isDraft
            createdAt
            description
            url
            tag {
              name
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}`;

const githubApolloFetch = createApolloFetch({ uri: GITHUB_URI });

githubApolloFetch.use(({ options }, next) => {
  if (!options.headers) {
    options.headers = {}; // Create the headers object if needed.
  }
  options.headers.authorization = `bearer ${config.Client.github_token}`;

  next();
});

if (config.Client.debug) {
  window._BTDSetSettings = (obj) => BHelper.settings.set(obj);
}

if (BHelper.isFirefox) {
  document.body.classList.add('-browser-firefox');
}

function refreshPreviews(settings) {
  if (settings.nm_disp) {
    let html;

    switch (settings.nm_disp) {
      case 'username':
        html = 'BetterTDeck';
        break;

      case 'fullname':
        html = 'Better TweetDeck';
        break;

      case 'inverted':
        html = 'BetterTDeck <em>Better TweetDeck</em>';
        break;

      default:
        html = 'Better TweetDeck <em>BetterTDeck</em>';
        break;
    }

    $('.tweet-preview.-name-time:not(.-display) .username').html(html);
  }

  if (settings.ts) {
    let html;

    switch (settings.ts) {
      case 'absolute_us':
        html = fecha.format(new Date(), 'MM/DD/YY hh:mm a');
        break;

      case 'absolute_metric':
        html = fecha.format(new Date(), 'DD/MM/YY HH:mm');
        break;

      case 'custom':
        html = fecha.format(new Date(), $('[name="custom_ts.full"]').val());
        break;

      default:
        html = 'now';
        break;
    }

    $('.tweet-preview.-name-time:not(.-display) .date').html(html);
  }

  if (isBoolean(settings.no_hearts)) {
    const el = $('.tweet-preview.-display .heart');
    el.removeClass('-hidden');

    if (settings.no_hearts) {
      el.addClass('-hidden');
    }
  }

  if (!settings.css) {
    return;
  }

  if (isBoolean(settings.css.round_pic)) {
    const el = $('.tweet-preview.-display .avatar');
    el.removeClass('-rounded');

    if (settings.css.round_pic) {
      el.addClass('-rounded');
    }
  }

  if (isBoolean(settings.css.show_verified)) {
    const el = $('.tweet-preview.-display .verified');
    el.addClass('-hidden');

    if (settings.css.show_verified) {
      el.removeClass('-hidden');
    }
  }

  if (isBoolean(settings.css.hide_context)) {
    const el = $('.tweet-preview.-display .context');
    el.addClass('-hidden');

    if (settings.css.hide_context) {
      el.removeClass('-hidden');
    }
  }

  if (isBoolean(settings.css.actions_on_right)) {
    const el = $('.tweet-preview.-display .actions');
    el.removeClass('-right');

    if (settings.css.actions_on_right) {
      el.addClass('-right');
    }
  }
}

/**
 * When got the settings we initialise the view
 */

BHelper.settings.getAll((settings) => {
  const settingsStr = JSON.stringify(settings, null, 2);

  $('.settings-dump').html(Prism.highlight(settingsStr, Prism.languages.js));

  /**
   * We go through the settings object and check or not the inputs accordingly
   */
  forEach(settings, (val, key) => {
    if (isObject(val)) {
      forEach(val, (value, keyname) => {
        const name = `${key}.${keyname}`;

        if (value) {
          $(`input[name="${name}"]`).prop('checked', true);
        }

        if (key === 'custom_ts') {
          if (settings.ts === 'custom') {
            $('input[name="ts"]#custom ~ ul input').removeAttr('disabled');
          }

          $(`input[name="${name}"]`).val(settings.custom_ts[keyname]);
        }

        if (key === 'flash_tweets') {
          if (settings.flash_tweets) {
            $('input[name="flash_tweets.enabled"]').prop('checked', settings.flash_tweets.enabled);
            $('input[name="flash_tweets.enabled"] ~ ul input').removeAttr('disabled');
          }

          $('input[name="flash_tweets.mode"]').removeAttr('checked');
          $('input[name="flash_tweets.mode"]').prop('disabled', !settings.flash_tweets.enabled);
          $(`input[name="flash_tweets.mode"]#${settings.flash_tweets.mode}`).prop(
            'checked',
            settings.flash_tweets.enabled && true
          );
        }

        if (key === 'ctrl_changes_interactions') {
          if (settings.ctrl_changes_interactions.enabled) {
            $('input[name="ctrl_changes_interactions.enabled"]').prop(
              'checked',
              settings.ctrl_changes_interactions.enabled
            );
            $('input[name="ctrl_changes_interactions.enabled"] ~ select').removeAttr('disabled');
          }

          $('select[name="ctrl_changes_interactions.mode"]').prop(
            'disabled',
            !settings.ctrl_changes_interactions.enabled
          );
          $('select[name="ctrl_changes_interactions.mode"]').val(
            settings.ctrl_changes_interactions.mode
          );
        }

        if (key === 'custom_columns_width') {
          if (settings.custom_columns_width) {
            $('input[name="custom_columns_width.enabled"]').prop(
              'checked',
              settings.custom_columns_width.enabled
            );
            $('input[name="custom_columns_width.enabled"] ~ ul input').removeAttr('disabled');
          }

          $('input[name="custom_columns_width.size"]').removeAttr('checked');
          $('input[name="custom_columns_width.size"]').prop(
            'disabled',
            !settings.custom_columns_width.enabled
          );
          $('input[name="custom_columns_width.size"]').prop(
            'value',
            settings.custom_columns_width.size
          );
        }
      });
    } else {
      const name = key;

      if (isBoolean(val)) {
        $(`input[name="${name}"]`).prop('checked', val);
      } else if (isString(val) && name !== 'ts' && name !== 'nm_disp') {
        $(`input[name="${name}"]`).val(settings[name]);
      } else {
        $(`input[name="${name}"]#${val}`).prop('checked', true);
      }
    }
  });

  function getFaviconURL(scheme) {
    return `img/favicons/${scheme.setting}.png`;
  }

  /**
   * Special treatment for thumb providers list who gets created from the source directly
   */
  schemeWhitelist.forEach((scheme) => {
    const isEnabled = isBoolean(settings.thumbnails[scheme.setting])
      ? settings.thumbnails[scheme.setting]
      : scheme.default;

    $('.settings-thumbnails-providers-list').append(`
      <li>
        <input type="checkbox" name="thumbnails.${scheme.setting}" id="${scheme.setting}" ${
      isEnabled ? 'checked' : ''
    }>
        <img src="${getFaviconURL(scheme)}" class="favicon-icon" />
        <label for="${scheme.setting}">${scheme.name}</label>
      </li>
    `);
  });

  refreshPreviews(settings);

  /**
   * Updating the settings when inputs change
   */

  $('input[name], select[name]').on('change input', (e) => {
    $('.save-button')
      .text(chrome.i18n.getMessage('save_save'))
      .removeAttr('disabled');

    if (e.target.type === 'radio' && e.target.name === 'ts') {
      if (e.target.hasAttribute('data-ghost')) {
        $(e.target)
          .parent()
          .find('ul input')
          .removeAttr('disabled');
      } else {
        $('[data-ghost] ~ ul input').attr('disabled', '');
      }
    }

    if (e.target.type === 'checkbox' && e.target.hasAttribute('data-ghost')) {
      const els = $(
        `[data-ghost][name="${e.target.name}"] ~ ul input, [data-ghost][name="${e.target.name}"] ~ select`
      );

      if (e.target.checked) {
        els.removeAttr('disabled');
      } else {
        els.attr('disabled', '');
      }
    }

    const name = e.target.name;

    if (['nm_disp', 'ts'].includes(name)) {
      refreshPreviews({ [name]: e.target.id });
    }

    if (name.includes('custom_ts.')) {
      refreshPreviews({ ts: 'custom' });
    }

    if (['no_hearts'].includes(name)) {
      refreshPreviews({ [name]: e.target.checked });
    }

    if (name.includes('css.')) {
      refreshPreviews({
        css: {
          [name.split('.')[1]]: e.target.checked,
        },
      });
    }
  });

  const changeCssEditor = () => {
    const annotations = CSS_EDITOR.getSession().getAnnotations();
    const hasErrors = annotations.find((a) => a.type === 'error');
    const saveBtn = $('.save-button');
    saveBtn.text(chrome.i18n.getMessage('save_save'));

    if (hasErrors) {
      saveBtn.prop('disabled', true);
    } else {
      saveBtn.removeAttr('disabled');
    }
  };

  CSS_EDITOR.getSession().on('change', changeCssEditor);
  CSS_EDITOR.getSession().on('changeAnnotations', changeCssEditor);

  $('button.save-button').click(() => {
    const newSettings = {};

    $('input[name],select[name]').each((i, el) => {
      const input = el;
      const type = input.nodeName === 'SELECT' ? null : input.getAttribute('type').toLowerCase();
      const name = input.getAttribute('name');
      const nameArr = name.split('.');
      const isChecked = $(el).is(':checked');

      if (name.includes('.')) {
        if (!newSettings[nameArr[0]]) {
          newSettings[nameArr[0]] = {};
        }

        if (type === 'radio' && isChecked) {
          newSettings[nameArr[0]][nameArr[1]] = input.getAttribute('id');
        } else if (type === 'checkbox') {
          newSettings[nameArr[0]][nameArr[1]] = isChecked;
        } else if (type === 'text' || type === 'number' || input.nodeName === 'SELECT') {
          newSettings[nameArr[0]][nameArr[1]] = input.value;
        }
      } else if (type === 'radio' && isChecked) {
        newSettings[name] = input.getAttribute('id');
      } else if (type === 'checkbox') {
        newSettings[name] = isChecked;
      } else if (type === 'text') {
        newSettings[name] = input.value;
      }
    });

    newSettings.custom_css_style = CSS_EDITOR.getValue();
    BHelper.settings.set(newSettings);
    BHelper.settings.set(newSettings, null, true);
    $('.save-button')
      .text(chrome.i18n.getMessage('save_no'))
      .attr('disabled', '');
  });
});

BHelper.settings.get(
  'custom_css_style',
  (css) => {
    CSS_EDITOR.setValue(css);
    CSS_EDITOR.clearSelection();
    $('.save-button').attr('disabled', '');
  },
  true
);

if (chrome.permissions) {
  chrome.permissions.contains(
    {
      permissions: ['tabs'],
    },
    (hasTabs) => {
      if (!hasTabs) {
        $('[data-require-permission] input').each((i, el) => $(el).prop('disabled', true));
      } else {
        $('[data-ask-permissions]').prop('disabled', true);
        $('[data-ask-permissions]').text(BHelper.getMessage('share_granted'));
      }
    }
  );

  $('[data-ask-permissions]').on('click', (ev) => {
    ev.preventDefault();
    chrome.permissions.request(
      {
        permissions: ['tabs'],
      },
      (granted) => {
        if (granted) {
          $('[data-require-permission] input').each((i, el) => $(el).prop('disabled', false));
          $(ev.target).prop('disabled', true);
          $(ev.target).text(BHelper.getMessage('share_granted'));
        }
      }
    );
  });
}

// Auto-select sidebar items
$('.sidebar-nav:first-child a:first-child, .content-block:first-child').addClass('-selected');

// Automatically add target=_blank on external links
$('.sidebar-nav a:not([href^="#"])').each((i, el) => el.setAttribute('target', '_blank'));

// "Animation" logic
$('.sidebar-nav a[href^="#"]').on('click', (ev) => {
  ev.preventDefault();
  const href = ev.target.getAttribute('href').slice(1);

  $('.sidebar-nav a, .content-block').removeClass('-selected');
  $(`.sidebar-nav a[href="#${href}"], .content-block#${href}`).addClass('-selected');
});

const switchSettingPage = (page) => {
  $('.sidebar-nav a, .content-block').removeClass('-selected');
  $(`.sidebar-nav a[href="#${page}"], .content-block#${page}`).addClass('-selected');
};

const flashSettingByName = (name) => {
  $('[data-setting-name]').removeClass('flash-setting');
  const featBlock = $(`[data-setting-name=${name}]`);

  if (featBlock) {
    setTimeout(() => {
      featBlock.addClass('flash-setting');
    }, 200);
  }
};

$('body').on('click', '[data-info-setting]', (ev) => {
  const $target = $(ev.target);

  if (!$target.data('info-setting')) {
    return;
  }

  const [settingCat, settingName] = $target.data('info-setting').split('/');

  if (!settingCat || !settingName) {
    return;
  }

  switchSettingPage(settingCat);
  setTimeout(() => flashSettingByName(settingName));
});

// Open a specific section when needed
if (Object.keys(queryString.parse(window.location.search)).length > 0) {
  const QS = queryString.parse(window.location.search);

  if (QS.on === 'install') {
    switchSettingPage('onInstall');
  }

  if (QS.on === 'update') {
    switchSettingPage('changelog');
  }

  const navItemsHrefs = [...$('.nav-flex .nav-item')]
    .map((i) => i.getAttribute('href'))
    .filter((i) => i.startsWith('#'))
    .map((i) => i.slice(1));

  if (navItemsHrefs.includes(QS.on)) {
    switchSettingPage(QS.on);
  }

  if (QS.feat) {
    flashSettingByName(QS.feat);
  }
}

// Write UA/version infos
$('.topbar-version-number').text(`v${BHelper.getVersion()}`);
$('.topbar-ext-name').text(`${BHelper.getName()}`);
$('.settings-version-number').text(BHelper.getVersion());
$('.settings-user-agent').text(BHelper.getUA());
$('.topbar-icon').attr('src', BHelper.getIcons()['48']);

// Get GitHub infos
fetch('https://api.github.com/repos/eramdam/BetterTweetDeck/contributors').then((res) => {
  res.json().then((json) => {
    json.forEach((contributor) => {
      if (contributor.login === 'eramdam') {
        return;
      }

      const commitsLinks = `https://github.com/eramdam/BetterTweetDeck/commits?author=${contributor.login}`;

      $('.settings-contributors').append(`
        <li>
          <a href="${contributor.html_url}" target="_blank">${contributor.login}</a>
          <small><a href="${commitsLinks}" target="_blank">${contributor.contributions} commit(s)</a></small>
        </li>
      `);
    });
  });
});

const makeReleaseMarkup = (release) => {
  const GITHUB_USERNAME_RE = /([^>])@([a-z0-9-_]+)([^<])/gi;
  const GITHUB_ISSUES_RE = /([^>])#([0-9]+)([^<])/g;
  const string = release.description
    .replace(
      GITHUB_ISSUES_RE,
      '$1<a href="https://github.com/eramdam/BetterTweetDeck/issues/$2">#$2</a>$3'
    )
    .replace(GITHUB_USERNAME_RE, '$1<a class="test" href="https://github.com/$2">@$2</a>$3');

  return marked(string);
};

githubApolloFetch({ query: GITHUB_RELEASES_QUERY })
  .then(({ data }) =>
    data.viewer.repository.releases.edges.filter((e) => !e.node.isDraft).map((e) => e.node)
  )
  .then((releases) => {
    const changelogMarkup = releases
      .map((release, index) => {
        let str = '';

        if (index === 0) {
          str = `<h1>🎉 ${release.name || release.tag.name} 🎉</h1>`;
        } else {
          str = `<h1>${release.name || release.tag.name}</h1>`;
        }

        str += `<div>${makeReleaseMarkup(release)}</div>`;

        return str;
      })
      .join('');

    $('.settings-section.changelog')[0].innerHTML = changelogMarkup;
  });

// Because nobody got time to write that HTML by hand, right?
const usedDeps = [
  { name: 'BabelJS', url: 'https://babeljs.io/' },
  { name: 'ESLint', url: 'http://eslint.org/' },
  { name: 'Gulp', url: 'http://gulpjs.com/' },
  { name: 'jQuery', url: 'http://jquery.com/' },
  { name: 'PostCSS', url: 'http://postcss.org/' },
  {
    name: 'See other dependencies',
    url: 'https://github.com/eramdam/BetterTweetDeck/blob/master/package.json',
  },
];

usedDeps.forEach((dep) => {
  $('.settings-deps').append(`
    <li>
      <a href="${dep.url}" target="_blank">${dep.name}</a>
    </li>
  `);
});

// Easy-peasy-lemon-sqeezy i18n code
[...document.querySelectorAll('[data-lang]')].forEach((el) => {
  const msg = el.getAttribute('data-lang');
  el.innerHTML = BHelper.getMessage(msg);
});

// Add the "Are you sure you wanna leave?" alert when the save button isn't clicked
window.onbeforeunload = () => {
  if (!$('.save-button').is(':disabled')) {
    return false;
  }

  return null;
};
