import _ from 'lodash';

import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

export enum BTDTimestampFormats {
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
}

function removeOriginalTask(TD: TweetDeckObject, chosenFormat: BTDTimestampFormats) {
  if (chosenFormat === BTDTimestampFormats.RELATIVE) {
    return;
  }

  // Find the task that changes the timestamp
  const taskIdToRemove = _(TD.controller.scheduler._tasks)
    .entries()
    .filter(([, task]) => {
      // The timestamp task is ran every 30 seconds.
      return task.period === 1e3 * 30;
    })
    .map(([, task]) => {
      return task.id;
    })
    .compact()
    .first();

  // If no id is found, nothign we can do
  if (!taskIdToRemove) {
    return;
  }

  // Otherwise, remove the periodic task
  TD.controller.scheduler.removePeriodicTask(taskIdToRemove);
}

export function maybeSetupCustomTimestampFormat(TD: TweetDeckObject, settings: BTDSettings) {
  removeOriginalTask(TD, settings.timestampStyle);
}
