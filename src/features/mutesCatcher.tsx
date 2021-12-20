import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import {MuteCatchesModal} from '../components/muteCatchesModal';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckChirp, TweetDeckFilter, TweetDeckFilterTypes} from '../types/tweetdeckTypes';

export enum AMEFilters {
  NFT_AVATAR = 'BTD_nft_avatar',
  IS_RETWEET_FROM = 'BTD_is_retweet_from',
  MUTE_USER_KEYWORD = 'BTD_mute_user_keyword',
  REGEX_DISPLAYNAME = 'BTD_mute_displayname',
  REGEX = 'BTD_regex',
  USER_REGEX = 'BTD_user_regex',
  MUTE_QUOTES = 'BTD_mute_quotes',
  USER_BIOGRAPHIES = 'BTD_user_biographies',
  DEFAULT_AVATARS = 'BTD_default_avatars',
  FOLLOWER_COUNT_LESS_THAN = 'BTD_follower_count_less_than',
  FOLLOWER_COUNT_GREATER_THAN = 'BTD_follower_count_greater_than',
  SPECIFIC_TWEET = 'BTD_specific_tweet',
}

const muteTypeAllowlist = [
  TweetDeckFilterTypes.SOURCE,
  TweetDeckFilterTypes.PHRASE,
  AMEFilters.DEFAULT_AVATARS,
  AMEFilters.FOLLOWER_COUNT_GREATER_THAN,
  AMEFilters.FOLLOWER_COUNT_LESS_THAN,
  AMEFilters.MUTE_USER_KEYWORD,
  AMEFilters.NFT_AVATAR,
  AMEFilters.REGEX_DISPLAYNAME,
  AMEFilters.USER_BIOGRAPHIES,
  AMEFilters.USER_REGEX,
  AMEFilters.REGEX,
] as const;
type AllowedMuteTypes = typeof muteTypeAllowlist[number];

export interface MuteReason {
  filterType: AllowedMuteTypes;
  value: string;
}
export interface MuteCatch {
  filterType: AllowedMuteTypes;
  value: string;
  user: {
    avatar: string;
    id: string;
    screenName: string;
    name: string;
  };
}

function serializeMuteCatch(target: TweetDeckChirp, filter: TweetDeckFilter): MuteCatch {
  const meaningfulUser = target.sourceUser || target.user || target.following || target.owner;
  if (!meaningfulUser) {
    console.debug(filter, target);
  }

  const simplifiedUser = {
    avatar: meaningfulUser.profileImageURL,
    id: meaningfulUser.id,
    screenName: meaningfulUser.screenName,
    name: meaningfulUser.name,
  };

  return {
    filterType: filter.type as AllowedMuteTypes,
    value: filter.value,
    user: simplifiedUser,
  };
}

export function encodeCatchKey(muteCatch: MuteCatch) {
  return [muteCatch.filterType, muteCatch.user.id, encodeURIComponent(muteCatch.value)].join('$_$');
}

export function encodeMuteReasonKey(muteReason: MuteReason): string {
  return [muteReason.filterType, encodeURIComponent(muteReason.value)].join('$_$');
}
export function decodeMuteReasonKey(muteReasonKey: string): MuteReason {
  const [filterType, rawValue] = muteReasonKey.split('$_$');

  return {
    filterType: filterType as AllowedMuteTypes,
    value: decodeURIComponent(rawValue),
  };
}

export type MuteCatchesMap = Map<string, MuteCatch>;

const BTD_MUTE_CATCHES_KEY = `btd_mute_catches`;

function getInitialMuteCatches() {
  return new Map<string, MuteCatch>(
    JSON.parse(window.localStorage.getItem(BTD_MUTE_CATCHES_KEY) || '[]')
  );
}

const muteCatches = getInitialMuteCatches();

export function removeCatchesByFilter(filter: {type: string; value: string}) {
  Array.from(muteCatches.entries()).forEach(([key, value]) => {
    if (value.filterType === filter.type && value.value === filter.value) {
      muteCatches.delete(key);
    }
  });
}

window.addEventListener('beforeunload', () => {
  window.localStorage.setItem(BTD_MUTE_CATCHES_KEY, JSON.stringify(muteCatches));
});

export function maybeLogMuteCatch(
  target: TweetDeckChirp,
  filter: TweetDeckFilter,
  shouldDisplay: boolean
) {
  return new Promise<void>((resolve) => {
    // If the filter isn't part of our allowlist, nothing to do.
    if (!muteTypeAllowlist.includes(filter.type as any)) {
      return resolve();
    }
    // Serialize our catch for easy storage
    const serialized = serializeMuteCatch(target, filter);

    // Make a unique key based on target+filter+value
    const catchKey = encodeCatchKey(serialized);

    if (muteCatches.has(catchKey)) {
      // If the target was previously matched and isn't anymore, then we can remove them.
      if (shouldDisplay) {
        muteCatches.delete(catchKey);
      }
      // Otherwise, we can stop here
      return resolve();
    }

    if (shouldDisplay) {
      return resolve();
    }

    muteCatches.set(catchKey, serialized);
    return resolve();
  });
}

export function formatMuteReason(muteCatch: MuteReason) {
  const {filterType, value} = muteCatch;

  switch (filterType) {
    case TweetDeckFilterTypes.SOURCE: {
      return `tweeted using "${value}"`;
    }
    case TweetDeckFilterTypes.PHRASE: {
      return `tweeted the phrase "${value}"`;
    }
    case AMEFilters.REGEX: {
      return `a tweet matched the regex \`/${value}/gi\``;
    }
    case AMEFilters.NFT_AVATAR: {
      return `uses the NFT avatar integration`;
    }
    case AMEFilters.DEFAULT_AVATARS: {
      return `had a default avatar`;
    }
    case AMEFilters.FOLLOWER_COUNT_GREATER_THAN: {
      return `had more than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.FOLLOWER_COUNT_LESS_THAN: {
      return `had less than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.USER_BIOGRAPHIES: {
      return `biography matched the phrase "${value}"`;
    }
    case AMEFilters.USER_REGEX: {
      return `username matched the regex \`/${value}/gi\` `;
    }
    case AMEFilters.REGEX_DISPLAYNAME: {
      return `display name matched the regex \`/${value}/gi\` `;
    }
    case AMEFilters.MUTE_USER_KEYWORD: {
      return `has tweeted the keyword "${value.split('|')[1]}"`;
    }
    default: {
      return `${filterType} ${value}`;
    }
  }
}

const openCatchList = () => {
  const root = document.createElement('div');
  root.id = 'btd-mute-catches';
  document.querySelector('.js-app')?.insertAdjacentElement('beforeend', root);

  ReactDOM.render(
    <MuteCatchesModal
      catches={Array.from(muteCatches.values())}
      onRequestClose={() => {
        ReactDOM.unmountComponentAtNode(root);
      }}
      muteReasons={_.chain(Array.from(muteCatches.values()))
        .map((value) => {
          return {
            filterType: value.filterType,
            value: value.value,
          };
        })
        .uniqBy((value) => encodeMuteReasonKey(value))
        .value()}
    />,
    root
  );
};

export const setupMuteCatcher = makeBTDModule(({TD, jq}) => {
  modifyMustacheTemplate(TD, `settings/global_setting_filter.mustache`, (string) => {
    return string.replace(
      `<div class="divider-bar"></div> `,
      `<div class="divider-bar"></div>  
    <div class="txt-size--12"> <i class="icon-btd icon-large obj-left color-twitter-gray"></i> <p class="nbfc margin-t--2"> Better TweetDeck keeps track of users that are caught by the mutes you define. <br/> <a href="#" data-action="btd-open-catches">Click here to review them or export them</a></p> </div>
    <div class="divider-bar"></div>`
    );
  });

  jq(document).on('click', `[data-action="btd-open-catches"]`, () => {
    openCatchList();
  });
});
