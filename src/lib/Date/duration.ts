import add from "date-fns/add";

export const durationToMillis = (duration: Duration) =>
  add(0, duration).getTime();

export const durationToSeconds = (duration: Duration) =>
  add(0, duration).getTime() / 1000;
