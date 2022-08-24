import format from 'date-fns/format';
import formatDuration from 'date-fns/formatDuration';
import { FormatInputDateOptions } from './types';

/**
 * Format as input date
 *
 * e.g. `2020-01-31T23:59:59`
 */
export const formatAsInputDate = (
  date: string | number | bigint | Date,
  { showSeconds = false }: FormatInputDateOptions = {}
) => {
  let currDate: Date;

  if (date instanceof Date) {
    currDate = date;
  } else if (typeof date === 'bigint') {
    currDate = new Date(Number(date));
  } else if (isNaN(Number(date))) {
    currDate = new Date(date);
  } else {
    currDate = new Date(Number(date));
  }

  const timeFormat = showSeconds
    ? "yyyy-MM-dd'T'HH:mm:ss"
    : "yyyy-MM-dd'T'HH:mm";

  return format(currDate, timeFormat);
};

/**
 * Format as a time string duration without letters
 *
 * e.g. `999:59:59`
 */
export const formatDurationAsTimeString = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.round(durationInSeconds - hours * 3600 - minutes * 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format as a short time string duration with letter
 *
 * e.g. `99:59 h` or `59:59 m` or `59 s`
 */
export const formatDurationAsShortTimeString = (durationInSeconds: number) => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
  const seconds = Math.round(durationInSeconds - hours * 3600 - minutes * 60);

  if (hours !== 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')} h`;
  }
  if (minutes !== 0) {
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')} m`;
  }

  return `${seconds} s`;
};

/**
 * Format as a duration with words
 *
 * e.g. `99h` or `59m` or `59s`
 */
export const formatDurationAsShortWord = (duration: Duration) => {
  const localeDictionary = {
    xSeconds: '{{count}}s',
    xMinutes: '{{count}}m',
    xHours: '{{count}}h',
  };
  const locale = {
    formatDistance: (token: keyof typeof localeDictionary, count: string) =>
      localeDictionary[token].replace('{{count}}', count),
  };

  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    locale,
  });
};
