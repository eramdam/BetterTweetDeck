import {TweetDeckChirp, TweetDeckFilter} from '../types/tweetdeckTypes';

interface MuteCatch {
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

function encodeCatchKey(muteCatch: MuteCatch) {
  return [muteCatch.filterType, muteCatch.user.id, encodeURIComponent(muteCatch.value)].join('$_$');
}

function getInitialMuteCatches() {
  return new Map<string, MuteCatch>(
    JSON.parse(window.localStorage.getItem('btd_mute_catches') || '[]')
  );
}

const muteCatches = getInitialMuteCatches();
console.log(muteCatches);

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
