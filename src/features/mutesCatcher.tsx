import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import {MuteCatchesModal} from '../components/muteCatchesModal';
import {modifyMustacheTemplate} from '../helpers/mustacheHelpers';
import {makeBTDModule} from '../types/btdCommonTypes';
import {TweetDeckChirp, TweetDeckFilter} from '../types/tweetdeckTypes';
import {AMEFilters, RAMEFilters} from './advancedMuteEngine';

export interface MuteReason {
  filterType: AMEFilters;
  value: string;
}
export interface MuteCatch {
  filterType: AMEFilters;
  value: string;
  user: {
    avatar: string;
    id: string;
    screenName: string;
    name: string;
  };
}

function serializeMuteCatch(target: TweetDeckChirp, filter: TweetDeckFilter): MuteCatch {
  const meaningfulUser = target.sourceUser || target.user;
  const simplifiedUser = {
    avatar: meaningfulUser.profileImageURL,
    id: meaningfulUser.id,
    screenName: meaningfulUser.screenName,
    name: meaningfulUser.name,
  };

  return {
    filterType: filter.type as AMEFilters,
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
    filterType: filterType as AMEFilters,
    value: decodeURIComponent(rawValue),
  };
}

export type MuteCatchesMap = Map<string, MuteCatch>;

const BTD_MUTE_CATCHES_KEY = `btd_mute_catches2`;

function getInitialMuteCatches() {
  return new Map<string, MuteCatch>(
    JSON.parse(window.localStorage.getItem(BTD_MUTE_CATCHES_KEY) || '[]')
  );
}

const muteCatches = getInitialMuteCatches();

export function removeCatchesByFilter(filter: {type: string; value: string}) {
  Array.from(muteCatches.entries()).forEach(([key, value]) => {
    console.log({key, value, filter});
    if (value.filterType === filter.type && value.value === filter.value) {
      muteCatches.delete(key);
    }
  });
}

window.addEventListener('beforeunload', () => {
  window.localStorage.setItem(BTD_MUTE_CATCHES_KEY, JSON.stringify(muteCatches));
});

export function maybeLogMuteCatch(target: TweetDeckChirp, filter: TweetDeckFilter) {
  if (!RAMEFilters.is(filter.type)) {
    return;
  }
  const serialized = serializeMuteCatch(target, filter);
  const catchKey = encodeCatchKey(serialized);

  if (muteCatches.has(catchKey)) {
    return;
  }

  muteCatches.set(catchKey, serialized);
}

export function formatMuteReason(muteCatch: MuteReason) {
  const {filterType, value} = muteCatch;

  switch (filterType) {
    case AMEFilters.NFT_AVATAR: {
      return `uses the NFT avatar integration`;
    }
    case AMEFilters.DEFAULT_AVATARS: {
      return `has a default avatar`;
    }
    case AMEFilters.FOLLOWER_COUNT_GREATER_THAN: {
      return `has more than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.FOLLOWER_COUNT_LESS_THAN: {
      return `has less than ${Number(value).toLocaleString()} followers`;
    }
    case AMEFilters.USER_BIOGRAPHIES: {
      return `biography matches the phrase ${value}`;
    }
    case AMEFilters.USER_REGEX: {
      return `username matches the regex \`/${value}/gi\` `;
    }
    case AMEFilters.REGEX_DISPLAYNAME: {
      return `display name matches the regex \`/${value}/gi\` `;
    }
    case AMEFilters.MUTE_USER_KEYWORD: {
      return `has tweeted the keyword ${value.split('|')[1]}`;
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
