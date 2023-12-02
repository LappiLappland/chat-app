type convertDate = string | Date;

export function getFormattedDate(date: convertDate) {
  date = new Date(date);

  return date.toLocaleString();
}

export function dateDifference(date1: convertDate, date2: convertDate) {
  date1 = new Date(date1);
  date2 = new Date(date2);
  return date1.valueOf() - date2.valueOf();
}