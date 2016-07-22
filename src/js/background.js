import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';
import * as Log from './util/logger';
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
    bigger_emojis: true,
    no_col_icns: false,
    gray_icns_notifs: false,
    minimal_mode: false,
    small_icns_compose: true,
    usrname_only_typeahead: true,
    hide_context: false,
    hide_scrollbars: true,
    show_verified: true,
    actions_on_right: true,
    actions_on_hover: true,
    hide_url_thumb: true,
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

  /**
   * We query a tab with TweetDeck opened in it
   */
  chrome.tabs.query({
    url: '*://tweetdeck.twitter.com/*',
  }, (tabs) => {
    if (tabs.length === 0) {
      return;
    }

    const TDTab = tabs[0];

    /**
     * We take the first tab we find, focus/select it and send a message to it
     */
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

const oldTStoNew = {
  absolute: 'absolute_metric',
  absolute_us: 'absolute_us',
  relative: 'relative',
};

BHelper.settings.getAll(settings => {
  let curSettings;

  // Migrating old settings. Settings that don't exist will default automatically
  if (settings && settings.circled_avatars) {
    curSettings = {
      ts: oldTStoNew[settings.timestamp],
      full_aft_24: settings.full_after_24h,
      nm_disp: settings.name_display,
      share_item: {
        enabled: settings.share_button,
        short_txt: settings.shorten_text,
      },
      no_hearts: settings.no_hearts,
      no_tco: settings.url_redirection,
      css: {
        round_pic: settings.circled_avatars,
        no_col_icns: settings.no_columns_icons,
        no_play_btn: settings.yt_rm_button,
        gray_icns_notifs: settings.grayscale_notification_icons,
        minimal_mode: settings.minimal_mode,
        small_icns_compose: settings.small_icons_compose,
        usrname_only_typeahead: settings.typeahead_display_username_only,
        hide_context: settings.hide_view_conversation,
        actions_on_right: settings.actions_on_right,
        actions_on_hover: settings.actions_on_hover,
      },
    };
  } else {
    curSettings = settings;
  }

  BHelper.settings.setAll(defaultsDeep(curSettings, defaultSettings), (newSettings) => {
    Log.debug(newSettings);
    // If the user is new on v3 then we display the "on install" page
    // '1468605919620' => ~15th of July
    if (!newSettings.installed_date || newSettings.installed_date <= 1468605919620) {
      chrome.tabs.create({
        url: 'options/options.html?on=install',
      });

      BHelper.settings.set({ installed_date: new Date().getTime() });
    }

    // We create the context menu item
    chrome.contextMenus.create({
      title: BHelper.getMessage('shareOnTD'),
      contexts: ['page', 'selection', 'image', 'link'],
      onclick: (info, tab) => contextMenuHandler(info, tab, newSettings),
    });
  }, true);
});

// Simple interface to get settings
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
