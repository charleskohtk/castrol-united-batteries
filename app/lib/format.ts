const SGT = "Asia/Singapore";
const LOCALE = "en-SG";

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    timeZone: SGT,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
