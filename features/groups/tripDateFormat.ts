/** Figma copy: "12 - 14 September" or "12 August". */
export function formatFigmaTripDates(startISO: string, endISO: string): string {
  const start = parseIsoDate(startISO);
  if (!start) return "";

  const end = parseIsoDate(endISO);
  const startDay = start.getDate();
  const month = start.toLocaleDateString("en-GB", { month: "long" });

  if (!end || sameDay(start, end)) {
    return `${startDay} ${month}`;
  }

  return `${startDay} - ${end.getDate()} ${month}`;
}

function parseIsoDate(iso: string): Date | null {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
