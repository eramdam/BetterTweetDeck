import { send as sendMessage } from '../js/util/messaging';
import * as BHelper from '../js/util/browserHelper';
import { schemeWhitelist } from '../js/util/thumbnails';

import $ from 'jquery';
import _ from 'lodash';
import Prism from 'prismjs';
import queryString from 'query-string';

sendMessage({ action: 'get_settings' }, (response) => {
  const settingsStr = JSON.stringify(response, null, 2);
  const settings = response.settings;

  $('.settings-dump').html(Prism.highlight(settingsStr, Prism.languages.js));

  _.forEach(settings, (val, key) => {
    if (_.isObject(val)) {
      _.forEach(val, (value, keyname) => {
        const name = `${key}.${keyname}`;

        if (value) {
          $(`input[name="${name}"]`).attr('checked', true);
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

  schemeWhitelist.forEach(scheme => {
    $('.settings-thumbnails-providers-list').append(`
      <li>
        <input type="checkbox" name="thumbnails.${scheme.setting}" id="${scheme.setting}" ${settings.thumbnails[scheme.setting] ? 'checked' : ''}>
        <label for="${scheme.setting}">${scheme.name} <small>${scheme.re.toString()}</small></label>
      </li>
    `);
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
