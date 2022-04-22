import { areIntervalsOverlapping } from 'date-fns';
import { LocationHistoryRecord } from 'proto-all-js/location/location_pb';

export interface Interval {
  start: Date;
  end: Date;
}

export const getQueryRange = (
  wantedRange: Interval,
  cachedDates?: Interval[]
): Interval[] | null => {
  // Cache empty, query full set
  if (cachedDates === undefined || cachedDates.length === 0) {
    return [wantedRange];
  }

  const isInCache = cachedDates.some((dateRange) =>
    isIntervalFullyWithinAnother(wantedRange, dateRange)
  );
  // Already in cache, don't query
  if (isInCache) {
    return null;
  }
  const partiallyCached = cachedDates.some((dateRange) =>
    areIntervalsOverlapping(wantedRange, dateRange, { inclusive: true })
  );
  // Partially cached, merge query and cache
  if (partiallyCached) {
    const queryRange = getNonOverlappingRanges(cachedDates, wantedRange);

    return queryRange;
  }

  // Not in cache, full query
  return [wantedRange];
};

export const mergeOverlappingDateRanges = (
  dateRanges: Interval[]
): Interval[] => {
  const sorted = sortIntervals(dateRanges);

  const result = sorted.reduce(
    (acc, curr) => {
      const prev = acc.pop() as Interval;

      if (curr.end <= prev.end) {
        // Current range is completely inside previous
        return [...acc, prev];
      }

      // Merges overlapping (<) and contiguous (==) ranges
      if (curr.start <= prev.end) {
        // Current range overlaps previous
        return [...acc, { start: prev.start, end: curr.end }];
      }

      // Ranges do not overlap
      return [...acc, prev, curr];
    },
    [sorted[0]]
  );

  return result;
};

const getNonOverlappingRanges = (
  intervals: Interval[],
  range: Interval
): Interval[] => {
  const { start: rangeStart, end: rangeEnd } = range;

  const result = [];
  let cursor = rangeStart;

  intervals.forEach((interval) => {
    const { start: iStart, end: iEnd } = interval;

    if (cursor < iStart) {
      result.push({ start: cursor, end: iStart });
    }

    cursor = iEnd;
  });

  if (cursor < rangeEnd) {
    result.push({ start: cursor, end: rangeEnd });
  }

  return result;
};

export const sortIntervals = (dateRanges: Interval[]): Interval[] =>
  dateRanges.sort(
    // By start, ascending
    (a, b) => Number(a.start) - Number(b.start)
  );

export const isIntervalFullyWithinAnother = (
  first: Interval,
  second: Interval
) => first.start >= second.start && first.end <= second.end;

export const sortLocationHistoryRecords = (
  records: LocationHistoryRecord.AsObject[]
): LocationHistoryRecord.AsObject[] =>
  (records as Required<LocationHistoryRecord.AsObject>[]).sort(
    (first, second) => first.fromTime.seconds - second.fromTime.seconds
  );
