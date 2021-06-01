import './logoTweaks.css';

import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';

export const changeLogo = makeBTDModule(({TD}) => {
  modifyMustacheTemplate(TD, 'topbar/app_title.mustache', (string) => {
    return string
      .replace(
        '<img src="{{#asset}}/global/tweetdeck.svg{{/asset}}" class="margin-l--16 height--24" alt="{{_i}}TweetDeck{{/i}}"/>',
        '<span class="btd-logo-base"></span><span class="btd-logo-border"></span>'
      )
      .replace('TweetDeck</span>', 'TweetDeck</span><span class="btd-logo-border"></span>');
  });
  const svgString = `
  <svg width="0" height="0">
  <clipPath id="btdLogoClip" clipPathUnits="objectBoundingBox">
    <path d="M0.891884 0H0.108116C0.0484009 0 0 0.0486878 0 0.108747V0.737364C0 0.797427 0.0484054 0.846111 0.108116 0.846111H0.348102L0.501076 1L0.65405 0.846111H0.891884C0.951599 0.846111 1 0.797423 1 0.737364V0.108747C1 0.0486838 0.951595 0 0.891884 0Z"></path>
  </clipPath>
  </svg>
  <svg width="0" height="0">
  <clipPath id="btdLogoPlus" clipPathUnits="objectBoundingBox">
  <path d="M0.639712 0.635701H1V0.361566H0.639712V0H0.360288V0.361566H0V0.635701H0.360288V1H0.639712V0.635701Z"></path></clipPath>
  </svg>
  `;

  document.body.insertAdjacentHTML('beforeend', svgString);
  document.body.setAttribute('btd-logo', 'default');
  // document.body.setAttribute('btd-logo', 'rainbow-pride');
});
