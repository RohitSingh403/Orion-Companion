export function getTodayString() {
  return new Date().toLocaleDateString("en-CA");
}

export function getYesterdayString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toLocaleDateString("en-CA");
}