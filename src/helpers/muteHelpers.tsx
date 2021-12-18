import React from 'react';
import ReactDOM from 'react-dom';

import {MuteCatchesModal} from '../components/muteCatchesModal';
import {TweetDeckChirp, TweetDeckFilter} from '../types/tweetdeckTypes';

export interface MuteCatch {
  filterType: string;
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
    filterType: filter.type,
    value: filter.value,
    user: simplifiedUser,
  };
}

export function encodeCatchKey(muteCatch: MuteCatch) {
  return [muteCatch.filterType, muteCatch.user.id, encodeURIComponent(muteCatch.value)].join('$_$');
}

export type MuteCatchesMap = Map<string, MuteCatch>;

function getInitialMuteCatches() {
  return new Map<string, MuteCatch>(
    JSON.parse(window.localStorage.getItem('btd_mute_catches') || '[]')
  );
}

const muteCatches = getInitialMuteCatches();

window.openCatchList = () => {
  const root = document.createElement('div');
  root.id = 'btd-mute-catches';
  document.querySelector('.js-app')?.insertAdjacentElement('beforeend', root);

  ReactDOM.render(
    <MuteCatchesModal
      catches={Array.from(muteCatches.values())}
      onRequestClose={() => {
        ReactDOM.unmountComponentAtNode(root);
      }}
    />,
    root
  );
};

setTimeout(window.openCatchList, 500);

window.addEventListener('beforeunload', () => {
  window.localStorage.setItem('btd_mute_catches', JSON.stringify(muteCatches));
});

export function maybeLogMuteCatch(target: TweetDeckChirp, filter: TweetDeckFilter) {
  const serialized = serializeMuteCatch(target, filter);
  const catchKey = encodeCatchKey(serialized);

  if (muteCatches.has(catchKey)) {
    return;
  }

  muteCatches.set(catchKey, serialized);
}
