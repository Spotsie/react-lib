import add from "date-fns/add";

export const getDatesBetweenRange = (
  startTime: Date,
  endTime: Date
): Date[] => {
  const dates: Date[] = [startTime];

  const date = new Date(startTime);
  date.setHours(0);
  date.setMinutes(0);

  for (
    let currDate = add(date, { days: 1 });
    currDate.getTime() <= endTime.getTime();
    currDate = add(currDate, { days: 1 })
  ) {
    dates.push(currDate);
  }

  return dates;
};
