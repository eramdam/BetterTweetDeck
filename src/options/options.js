import * as BHelper from '../js/util/browserHelper';
import { schemeWhitelist } from '../js/util/thumbnails';

import $ from 'jquery';
import _ from 'lodash';
import Prism from 'prismjs';
import queryString from 'query-string';
import fecha from 'fecha';

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

  if (_.isBoolean(settings.no_hearts)) {
    const el = $('.tweet-preview.-display .heart');
    el.removeClass('-hidden');

    if (settings.no_hearts) {
      el.addClass('-hidden');
    }
  }

  if (!settings.css) {
    return;
  }

  if (_.isBoolean(settings.css.round_pic)) {
    const el = $('.tweet-preview.-display .avatar');
    el.removeClass('-rounded');

    if (settings.css.round_pic) {
      el.addClass('-rounded');
    }
  }

  if (_.isBoolean(settings.css.show_verified)) {
    const el = $('.tweet-preview.-display .verified');
    el.addClass('-hidden');

    if (settings.css.show_verified) {
      el.removeClass('-hidden');
    }
  }

  if (_.isBoolean(settings.css.hide_context)) {
    const el = $('.tweet-preview.-display .context');
    el.addClass('-hidden');

    if (settings.css.hide_context) {
      el.removeClass('-hidden');
    }
  }

  if (_.isBoolean(settings.css.actions_on_right)) {
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
BHelper.settings.getAll(settings => {
  const settingsStr = JSON.stringify(settings, null, 2);

  $('.settings-dump').html(Prism.highlight(settingsStr, Prism.languages.js));

  /**
   * We go through the settings object and check or not the inputs accordingly
   */
  _.forEach(settings, (val, key) => {
    if (_.isObject(val)) {
      _.forEach(val, (value, keyname) => {
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
          $(`input[name="flash_tweets.mode"]#${settings.flash_tweets.mode}`).prop('checked', settings.flash_tweets.enabled && true);
        }
      });
    } else {
      const name = key;

      if (_.isBoolean(val)) {
        $(`input[name="${name}"]`).prop('checked', val);
      } else {
        $(`input[name="${name}"]#${val}`).prop('checked', true);
      }
    }
  });

  function getFaviconURL(scheme) {
    if (scheme.setting.includes('_')) {
      return `https://plus.google.com/_/favicon?domain=${scheme.setting.replace('_', '.')}`;
    }

    return `https://plus.google.com/_/favicon?domain=${scheme.setting}.com`;
  }

  /**
   * Special treatment for thumb providers list who gets created from the source directly
   */
  schemeWhitelist.forEach(scheme => {
    $('.settings-thumbnails-providers-list').append(`
      <li>
        <input type="checkbox" name="thumbnails.${scheme.setting}" id="${scheme.setting}" ${settings.thumbnails[scheme.setting] ? 'checked' : ''}>
        <img src="${getFaviconURL(scheme)}" class="favicon-icon" />
        <label for="${scheme.setting}">${scheme.name}</label>
      </li>
    `);
  });

  refreshPreviews(settings);

  /**
   * Updating the settings when inputs change
   */

  $('input[name]').on('change input', (e) => {
    $('.save-button').text(chrome.i18n.getMessage('save_save')).removeAttr('disabled');

    if (e.target.type === 'radio' && e.target.name === 'ts') {
      if (e.target.hasAttribute('data-ghost')) {
        $(e.target).parent()
                   .find('ul input')
                   .removeAttr('disabled');
      } else {
        $('[data-ghost] ~ ul input').attr('disabled', '');
      }
    }

    if (e.target.type === 'checkbox' && e.target.hasAttribute('data-ghost')) {
      const els = $(`[data-ghost][name="${e.target.name}"] ~ ul input`);

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

  $('button.save-button').click(() => {
    const newSettings = {};

    $('input[name]').each((i, el) => {
      const input = el;
      const type = input.getAttribute('type').toLowerCase();
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
        } else if (type === 'text') {
          newSettings[nameArr[0]][nameArr[1]] = input.value;
        }
      } else {
        if (type === 'radio' && isChecked) {
          newSettings[name] = input.getAttribute('id');
        } else if (type === 'checkbox') {
          newSettings[name] = isChecked;
        } else if (type === 'text') {
          newSettings[name] = input.value;
        }
      }
    });


    BHelper.settings.set(newSettings);
    $('.save-button').text(chrome.i18n.getMessage('save_no')).attr('disabled', '');
  });
});

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

// Open a specific section when needed
if (Object.keys(queryString.parse(location.search)).length > 0) {
  const QS = queryString.parse(location.search);

  if (QS.on === 'install') {
    $('.sidebar-nav a, .content-block').removeClass('-selected');
    $('.sidebar-nav a[href="#onInstall"], .content-block#onInstall').addClass('-selected');
  }
}

// Write UA/version infos
$('.topbar-version-number').text(`v${BHelper.getVersion()}`);
$('.settings-version-number').text(BHelper.getVersion());
$('.settings-user-agent').text(BHelper.getUA());

// Get GitHub infos
fetch('https://api.github.com/repos/eramdam/BetterTweetDeck/contributors').then(res => {
  res.json().then(json => {
    json.forEach(contributor => {
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

// Because nobody got time to write that HTML by hand, right?
const usedDeps = [
  { name: 'BabelJS', url: 'https://babeljs.io/' },
  { name: 'Embed.ly', url: 'http://embed.ly/' },
  { name: 'ESLint', url: 'http://eslint.org/' },
  { name: 'Gulp', url: 'http://gulpjs.com/' },
  { name: 'jQuery', url: 'http://jquery.com/' },
  { name: 'PostCSS', url: 'http://postcss.org/' },
  { name: 'See other dependencies', url: 'https://github.com/eramdam/BetterTweetDeck/blob/master/package.json' },
];

usedDeps.forEach(dep => {
  $('.settings-deps').append(`
    <li>
      <a href="${dep.url}" target="_blank">${dep.name}</a>
    </li>
  `);
});

// Easy-peasy-lemon-sqeezy i18n code
[...document.querySelectorAll('[data-lang]')].forEach(el => {
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
