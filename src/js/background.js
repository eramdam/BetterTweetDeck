import gifshot from 'gifshot';
import { defaultsDeep } from 'lodash';

import * as BHelper from './util/browserHelper';
import * as Messages from './util/messaging';
import Log from './util/logger';

const defaultSettings = {
  installed_version: BHelper.getVersion(),
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
  no_gif_pp: false,
  custom_columns_width: {
    size: '250px',
    enabled: false,
  },
  css: {
    round_pic: true,
    bigger_emojis: true,
    collapse_dms: false,
    no_col_icns: false,
    gray_icns_notifs: false,
    minimal_mode: false,
    small_icns_compose: true,
    usrname_only_typeahead: true,
    hide_context: false,
    no_scrollbars: false,
    slim_scrollbars: false,
    show_verified: true,
    actions_on_right: true,
    actions_on_hover: true,
    hide_url_thumb: true,
    no_bg_modal: true,
    show_provider_indicator: false,
    hide_like_rt_indicators: false,
    system_fonts: false,
  },
  share_item: {
    enabled: true,
    short_txt: false,
  },
  old_replies: false,
  old_search: false,
  regex_filter: false,
  favstar_item: true,
  mute_hashtags: true,
  hotlink_item: false,
  download_item: false,
  download_filename_format: '{{postedUser}}-{{fileName}}.{{fileExtension}}',
  ctrl_changes_interactions: false,
  update_title_on_notifications: true,
  thumbnails: {},
};

function openWelcomePage() {
  chrome.tabs.create({
    url: 'options/options.html?on=install',
  });
}

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
        active: true,
      }, () => {
        chrome.tabs.sendMessage(TDTab.id, {
          action: 'share',
          text: textToShare,
          url: urlToShare,
        });
      });
    });
  });
}

const createMenuItem = (newSettings) => {
  chrome.contextMenus.create({
    title: BHelper.getMessage('shareOnTD'),
    contexts: ['page', 'selection', 'image', 'link'],
    onclick: (info, tab) => contextMenuHandler(info, tab, newSettings),
  });
};

BHelper.settings.getAll((settings) => {
  let curSettings = settings;

  if (curSettings.BTDSettings) {
    const cleanedSettings = Object.assign({}, curSettings.BTDSettings);
    curSettings = cleanedSettings;
    chrome.storage.sync.clear();
  }

  BHelper.settings.set(defaultsDeep(curSettings, defaultSettings), (newSettings) => {
    Log(newSettings);
    if (!newSettings.installed_date) {
      openWelcomePage();
      BHelper.settings.set({ installed_date: new Date().getTime() });
    }

    const oldVersion = (curSettings.installed_version || '').replace(/\./g, '');
    const newVersion = BHelper.getVersion().replace(/\./g, '');

    Log('version', BHelper.getVersion());
    BHelper.settings.set({ installed_version: String(BHelper.getVersion()) });

    if (!oldVersion || Number(oldVersion) !== Number(newVersion)) {
      BHelper.settings.set({
        need_update_banner: true,
      });
    }

    // We create the context menu item
    if (newSettings.share_item && newSettings.share_item.enabled) {
      if (chrome.permissions) {
        chrome.permissions.contains({
          permissions: ['tabs'],
        }, (hasTabs) => {
          if (!hasTabs) {
            return;
          }
          createMenuItem(newSettings);
        });
      } else {
        createMenuItem(newSettings);
      }
    }
  });
});

const sendToCurrentTab = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
};

// Simple interface to get settings
Messages.on((message, sender, sendResponse) => {
  switch (message.action) {
    case 'displayed_update_banner':
      BHelper.settings.set({
        need_update_banner: false,
        installed_version: String(BHelper.getVersion()),
      });
      return false;
    case 'get_settings':
      BHelper.settings.getAll(settings => sendResponse({ settings }));
      return true;

    case 'get':
      BHelper.settings.get(message.key, val => sendResponse({ val }));
      return true;

    case 'download_gif':
      message.options.progressCallback = (progress) => {
        sendToCurrentTab({ action: 'progress_gif', progress });
      };

      gifshot.createGIF(message.options, (obj) => {
        sendResponse({ obj });
      });
      return true;

    default:
      return false;
  }
});
