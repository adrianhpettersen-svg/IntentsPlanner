import { DAYS, DayId, toMinutes } from "@/data/schedule";
import { SetMatch } from "./optimizer";

// Detect which festival day a given Date falls on (in Europe/Amsterdam),
// and split a day's matches into past / current / upcoming based on the wall clock.

export function activeDay(now: Date): DayId | null {
  // Use Amsterdam local time. Festival days run from ~12:00 to ~02:00 next day.
  // We're lenient: from 10:00 day-of until 06:00 next morning counts as that festival day.
  const ams = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
  const ymd = `${ams.getFullYear()}-${String(ams.getMonth() + 1).padStart(2, "0")}-${String(ams.getDate()).padStart(2, "0")}`;
  const hour = ams.getHours();

  for (const d of DAYS) {
    if (d.date === ymd && hour >= 10) return d.id;
    // Early morning belonging to previous day's session
    const prev = previousDate(d.date);
    if (prev === ymd && hour < 6) return d.id;
  }
  // Festival not active right now — pick the first day if it's the same date or near
  return null;
}

function previousDate(date: string): string {
  const d = new Date(date + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export function currentMinutes(now: Date): number {
  const ams = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
  return ams.getHours() * 60 + ams.getMinutes();
}

export type NowSplit = {
  past: SetMatch[];
  current: SetMatch | null;
  upcoming: SetMatch[];
};

export function splitByNow(matches: SetMatch[], nowMinutes: number): NowSplit {
  const past: SetMatch[] = [];
  const upcoming: SetMatch[] = [];
  let current: SetMatch | null = null;
  for (const m of matches) {
    const start = toMinutes(m.set.start);
    const end = toMinutes(m.set.end);
    if (end <= nowMinutes) past.push(m);
    else if (start <= nowMinutes && nowMinutes < end) current = m;
    else upcoming.push(m);
  }
  return { past, current, upcoming };
}
