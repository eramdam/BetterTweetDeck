import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';
import { defaultsDeep } from 'lodash';

const defaultSettings = {
  installed_date: new Date().getTime(),
  ts: 'absolute_metric',
  full_aft_24: true,
  nm_disp: 'inverted',
  no_hearts: false,
  no_tco: true,
  flash_tweets: 'mentions',
  rtl_text_style: true,
  stop_gifs: true,
  css: {
    round_pic: true,
    no_col_icns: true,
    no_play_btn: true,
    gray_icns_notifs: false,
    minimal_mode: true,
    flash_tweets: 'mentions',
    small_icns_compose: true,
    usrname_only_typeahed: true,
    hide_context: true,
    hide_scrollbars: true,
    show_verified: true,
    actions_on_right: true,
    actions_on_hover: true,
  },
  share_item: {
    enabled: true,
    short_txt: false,
  },
  firefox: true,
};

const contextMenuHandler = (info, tab, settings) => {
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
};

BHelper.settings.getAll(settings => {
  BHelper.settings.setAll(defaultsDeep(settings, defaultSettings), (newSettings) => {
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
