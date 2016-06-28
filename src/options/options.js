import { send as sendMessage } from '../js/util/messaging';
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

    $('.tweet-preview.-name-time .username').html(html);
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

    $('.tweet-preview.-name-time .date').html(html);
  }
}

/**
 * When got the settings we initliase the view
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
          $(`input[name="${name}"]`).attr('checked', true);
        }

        if (key === 'custom_ts') {
          if (settings.ts === 'custom') {
            $('input[name="ts"]#custom ~ ul input').removeAttr('disabled');
          }

          $(`input[name="${name}"]`).val(settings.custom_ts[keyname]);
        }
      });
    } else {
      const name = key;

      if (_.isBoolean(val)) {
        $(`input[name="${name}"]`).attr('checked', val);
      } else {
        $(`input[name="${name}"]#${val}`).attr('checked', true);
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
        <input type="checkbox" name="thumbnails.${scheme.setting}" id="${scheme.setting}" ${settings.thumbnails[scheme.setting] || scheme.default === true ? 'checked' : ''}>
        <img src="${getFaviconURL(scheme)}" class="favicon-icon" />
        <label for="${scheme.setting}">${scheme.name} <small>${scheme.re.toString()}</small></label>
      </li>
    `);
  });

  refreshPreviews(settings);

  /**
   * Updating the settings when inputs change
   */

  $('input[name]').on('change input', (e) => {
    $('.save-button').text('Save changes').removeAttr('disabled');

    if (e.target.type === 'radio') {
      if (e.target.hasAttribute('data-ghost')) {
        $(e.target).parent()
                   .find('ul input')
                   .removeAttr('disabled');
      } else {
        $('[data-ghost] ~ ul input').attr('disabled', '');
      }
    }

    if (e.target.name === 'nm_disp') {
      refreshPreviews({ nm_disp: e.target.id });
    }

    if (e.target.name === 'ts') {
      refreshPreviews({ ts: e.target.id });
    }

    if (e.target.name.includes('custom_ts.')) {
      refreshPreviews({ ts: 'custom' });
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

    // console.log(settings);
    BHelper.settings.set(newSettings);
    $('.save-button').text('No changes').attr('disabled', '');
  });
});

$('.sidebar-nav:first-child a:first-child, .content-block:first-child').addClass('-selected');

$('.sidebar-nav a:not([href^="#"])').each((i, el) => el.setAttribute('target', '_blank'));

$('.sidebar-nav a[href^="#"]').on('click', (ev) => {
  ev.preventDefault();
  const href = ev.target.getAttribute('href').slice(1);

  $('.sidebar-nav a, .content-block').removeClass('-selected');
  $(`.sidebar-nav a[href="#${href}"], .content-block#${href}`).addClass('-selected');
});

if (Object.keys(queryString.parse(location.search)).length > 0) {
  const QS = queryString.parse(location.search);

  if (QS.on === 'install') {
    $('.sidebar-nav a, .content-block').removeClass('-selected');
    $('.sidebar-nav a[href="#onInstall"], .content-block#onInstall').addClass('-selected');
  }
}

$('.sidebar-version-number').text(`v${BHelper.getVersion()}`);
$('.settings-version-number').text(BHelper.getVersion());
$('.settings-user-agent').text(BHelper.getUA());

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
