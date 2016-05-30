document.write("<script async src='http://localhost:3000/browser-sync/browser-sync-client.2.12.10.js'></script>");

import { send as sendMessage } from '../js/util/messaging';

import $ from 'jquery';

// sendMessage({ action: 'get_settings' }, (response) => {
//   console.log(response);
// });

$('.sidebar-nav:first-child a:first-child, .content-block:first-child').addClass('-selected');

$('.sidebar-nav').on('click', (ev) => {
  ev.preventDefault();
  const href = ev.target.getAttribute('href').slice(1);

  $('.sidebar-nav a, .content-block').removeClass('-selected');
  $(`.sidebar-nav a[href="#${href}"], .content-block#${href}`).addClass('-selected');
});
