import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';
import { defaultsDeep } from 'lodash';

const defaultSettings = {
  installed_date: new Date().getTime(),
  ts: 'relative',
  custom_ts: {
    short: '',
    full: '',
  },
  full_aft_24: true,
  nm_disp: 'inverted',
  no_hearts: false,
  no_tco: true,
  flash_tweets: {
    mode: 'mentions',
    enabled: true,
  },
  rtl_text_style: true,
  stop_gifs: true,
  css: {
    round_pic: true,
    no_col_icns: false,
    no_play_btn: true,
    gray_icns_notifs: false,
    minimal_mode: false,
    small_icns_compose: true,
    usrname_only_typeahead: true,
    hide_context: false,
    hide_scrollbars: true,
    show_verified: true,
    actions_on_right: true,
    actions_on_hover: true,
  },
  share_item: {
    enabled: true,
    short_txt: false,
  },
  thumbnails: {},
};

function contextMenuHandler(info, tab, settings) {
  const urlToShare = info.linkUrl || info.srcUrl || info.pageUrl;
  let textToShare = info.selectionText || tab.title;

  if (settings.share_item.short_txt) {
    textToShare = textToShare.substr(0, 110);
  }

  chrome.tabs.query({
    url: '*://tweetdeck.twitter.com/*',
  }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }

    const TDTab = tabs[0];

    chrome.windows.update(TDTab.windowId, {
      focused: true,
    }, () => {
      chrome.tabs.update(TDTab.id, {
        selected: true,
        active: true,
        highlighted: true,
      }, () => {
        chrome.tabs.sendMessage(TDTab.id, {
          text: textToShare,
          url: urlToShare,
        });
      });
    });
  });
}

BHelper.settings.getAll(settings => {
  BHelper.settings.setAll(defaultsDeep(settings, defaultSettings), (newSettings) => {
    if (!newSettings.installed_date) {
      chrome.tabs.create({
        url: 'options/options.html?on=install',
      });
    }

    chrome.contextMenus.create({
      title: 'Share on TweetDeck',
      contexts: ['page', 'selection', 'image', 'link'],
      onclick: (info, tab) => contextMenuHandler(info, tab, newSettings),
    });
  }, true);
});

Messages.on((message, sender, sendResponse) => {
  switch (message.action) {
    case 'get_settings':
      BHelper.settings.getAll((settings) => sendResponse({ settings }));
      return true;

    case 'get':
      BHelper.settings.get(message.key, (val) => sendResponse({ val }));
      return true;

    default:
      return false;
  }
});
