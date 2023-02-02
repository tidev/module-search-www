/**
 * Take the difference between the dates and divide by milliseconds per day.
 * Round to nearest whole number to deal with DST.
 * CREDITS: https://stackoverflow.com/a/543152/5537752
 */
export function differenceInMonths(first: Date, second: Date) {
  return Math.round(
    (second.getTime() - first.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
}
