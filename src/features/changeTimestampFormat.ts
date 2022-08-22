import _ from 'lodash';
import {DateTime, Interval} from 'luxon';

import {onChirpAdded} from '../services/chirpHandler';
import {makeBTDModule, makeBtdUuidSelector} from '../types/btdCommonTypes';
import {BTDTimestampFormats} from '../types/btdSettingsEnums';
import {BTDSettings} from '../types/btdSettingsTypes';

const TIMESTAMP_INTERVAL = 1e3 * 8;

function parseDateFromSnowflake(snowflake: number): DateTime | undefined {
  // Old SnowFlake:under 10 digits is not contain any data of date.
  if (snowflake < 10000000000) return undefined;
  // (val >> 22) + Standard Time
  const unixTime = Math.floor(snowflake / 4194304) + 1288834974657;

  return DateTime.fromMillis(unixTime);
}

function maybeExtractDateFromStatus(
  textLinkElement: HTMLAnchorElement | HTMLSpanElement | null
): DateTime | undefined {
  if (!textLinkElement) {
    return undefined;
  }
  const statusURLPattern = /^https:\/\/twitter.com\/.*\/status\/\d+$/;
  if (textLinkElement instanceof HTMLSpanElement) {
    return undefined;
  }

  if (statusURLPattern.test(textLinkElement.href)) {
    const snowFlake = parseInt(new URL(textLinkElement.href).pathname.split('/').pop() || '', 10);

    return parseDateFromSnowflake(snowFlake);
  }

  return undefined;
}

function getFinalDateString(
  sourceIsoString: string,
  {timestampFullFormat, timestampShortFormat, fullTimestampAfterDay}: BTDSettings,
  textLinkElement: HTMLAnchorElement | HTMLSpanElement | null
) {
  const dateObject =
    maybeExtractDateFromStatus(textLinkElement) || DateTime.fromISO(sourceIsoString);
  const now = DateTime.local();
  const fullString = dateObject.toFormat(timestampFullFormat);
  const shortString = dateObject.toFormat(timestampShortFormat);

  if (fullTimestampAfterDay) {
    const intervalToNow = Interval.fromDateTimes(dateObject, now).length('hours');

    return intervalToNow > 24 ? fullString : shortString;
  }

  return shortString;
}

function refreshTimestamps(
  settings: BTDSettings,
  timeElements = document.querySelectorAll('time')
) {
  timeElements.forEach((timeElement) => {
    if (timeElement.closest('.js-tweet-detail.tweet-detail-wrapper')) {
      return;
    }
    const timeString = timeElement.getAttribute('datetime');
    if (!timeString) {
      return;
    }

    const textLikeElement = timeElement.querySelector<HTMLAnchorElement | HTMLSpanElement>(
      'a, span'
    );
    const newTextContent = getFinalDateString(timeString, settings, textLikeElement);

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
    onChirpAdded((addedChirp) => {
      refreshTimestamps(
        settings,
        document.querySelectorAll(`${makeBtdUuidSelector('data-btd-uuid', addedChirp.uuid)} time`)
      );
    });
  });
});
