import _ from 'lodash';
import {DateTime, Interval} from 'luxon';
import {BTDSettings} from '../types/betterTweetDeck/btdSettingsTypes';
import {TweetDeckObject} from '../types/tweetdeckTypes';

export enum BTDTimestampFormats {
  RELATIVE = 'relative',
  ABSOLUTE = 'absolute',
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
  const timeElements = document.querySelectorAll('time.js-timestamp');

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

export function maybeSetupCustomTimestampFormat(TD: TweetDeckObject, settings: BTDSettings) {
  const {timestampStyle} = settings;
  if (timestampStyle === BTDTimestampFormats.RELATIVE) {
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
  refreshTimestamps(settings);
  setInterval(() => refreshTimestamps(settings), TIMESTAMP_INTERVAL);
}
