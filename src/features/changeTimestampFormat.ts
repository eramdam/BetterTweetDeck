import _ from 'lodash';
import {DateTime, Interval} from 'luxon';

import {makeBTDModule} from '../types/betterTweetDeck/btdCommonTypes';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';

export enum BTDTimestampFormats {
  RELATIVE = 'relative',
  CUSTOM = 'custom',
}

const TIMESTAMP_INTERVAL = 1e3 * 8;

function getFinalDateString(
  sourceIsoString: string,
  {timestampFullFormat, timestampShortFormat, fullTimestampAfterDay}: BTDSettings
) {
  const dateObject = DateTime.fromISO(sourceIsoString);
  const now = DateTime.local();
  const fullString = dateObject.toFormat(timestampFullFormat);
  const shortString = dateObject.toFormat(timestampShortFormat);

  if (fullTimestampAfterDay) {
    const intervalToNow = Interval.fromDateTimes(dateObject, now).length('hours');

    return intervalToNow > 24 ? fullString : shortString;
  }

  return shortString;
}

function refreshTimestamps(settings: BTDSettings) {
  const timeElements = document.querySelectorAll('time');

  timeElements.forEach((timeElement) => {
    const timeString = timeElement.getAttribute('datetime');
    if (!timeString) {
      return;
    }

    const textLikeElement = timeElement.querySelector('a, span');
    const newTextContent = getFinalDateString(timeString, settings);

    if (!textLikeElement) {
      timeElement.textContent = newTextContent;
      return;
    }

    textLikeElement.textContent = newTextContent;
  });
}

export const maybeSetupCustomTimestampFormat = makeBTDModule(({TD, settings, jq}) => {
  const {timestampStyle} = settings;
  if (timestampStyle === BTDTimestampFormats.RELATIVE) {
    return;
  }

  jq(document).one('dataColumnsLoaded', () => {
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

    // If no id is found, nothing we can do
    if (!taskIdToRemove) {
      return;
    }

    // Otherwise, remove the periodic task
    TD.controller.scheduler.removePeriodicTask(taskIdToRemove);
    refreshTimestamps(settings);
    setInterval(() => refreshTimestamps(settings), TIMESTAMP_INTERVAL);
  });
});
