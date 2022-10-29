/**
 * Usefull functions
 */

export function getDateString(date: Date | undefined) {
  return date
    ? [
        date?.getDate().toString().padStart(2, "0"),
        (date.getMonth() + 1).toString().padStart(2, "0"),
        date.getFullYear(),
      ].join("/")
    : undefined;
}
