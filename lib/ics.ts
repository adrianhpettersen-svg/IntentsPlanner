import { DAYS, FestivalSet, STAGES, toMinutes } from "@/data/schedule";
import { SetMatch } from "./optimizer";

// Build an .ics file from the optimal plan. Events use Europe/Amsterdam local time
// (the festival is in Oisterwijk, NL).

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toIcsDate(dayDate: string, hhmm: string): string {
  // dayDate "2026-06-05", hhmm "23:15" or "24:00"
  const [Y, M, D] = dayDate.split("-").map(Number);
  let [h, m] = hhmm.split(":").map(Number);
  let day = D;
  if (h === 24) {
    h = 0;
    day = D + 1;
  }
  // Use floating local time (no Z, no timezone) — Apple Cal + Google interpret as local.
  return `${Y}${pad(M)}${pad(day)}T${pad(h)}${pad(m)}00`;
}

function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

export function buildIcs(matches: SetMatch[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Intents Planner 2026//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Intents Festival 2026",
    "X-WR-TIMEZONE:Europe/Amsterdam",
  ];
  for (const m of matches) {
    const s = m.set;
    const day = DAYS.find((d) => d.id === s.day);
    if (!day) continue;
    const dtStart = toIcsDate(day.date, s.start);
    const dtEnd = toIcsDate(day.date, s.end);
    const stage = STAGES[s.stageId]?.name ?? s.stageId;
    const summary = escapeIcsText(`${s.title} · ${stage}`);
    const description = escapeIcsText(
      [
        s.note ? `Note: ${s.note}` : null,
        m.matchedArtists.length > 0 ? `Your picks: ${m.matchedArtists.join(", ")}` : null,
        `Stage: ${stage}`,
      ]
        .filter(Boolean)
        .join("\n")
    );
    lines.push(
      "BEGIN:VEVENT",
      `UID:${s.id}@intents-planner`,
      `DTSTAMP:${dtStart}`,
      `DTSTART;TZID=Europe/Amsterdam:${dtStart}`,
      `DTEND;TZID=Europe/Amsterdam:${dtEnd}`,
      `SUMMARY:${summary}`,
      `LOCATION:${escapeIcsText(stage + ", Intents Festival, Oisterwijk")}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Suppressed unused warning for FestivalSet/toMinutes (kept for potential future use)
export type _IcsUnused = FestivalSet | typeof toMinutes;
