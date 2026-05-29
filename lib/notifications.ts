import { DAYS, STAGES } from "@/data/schedule";
import { SetMatch } from "./optimizer";

// Browser notification scheduling — schedules a setTimeout for each upcoming set
// "minutesBefore" minutes before it starts. Re-runs whenever plan changes.

export type NotifPrefs = {
  enabled: boolean;
  minutesBefore: number; // 5, 10, 15
};

const NOTIF_KEY = "intents26_notif_v1";

export function loadNotifPrefs(): NotifPrefs {
  if (typeof window === "undefined") return { enabled: false, minutesBefore: 10 };
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { enabled: false, minutesBefore: 10 };
}

export function saveNotifPrefs(prefs: NotifPrefs) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs)); } catch {}
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

let scheduledTimeouts: ReturnType<typeof setTimeout>[] = [];

export function clearScheduled() {
  scheduledTimeouts.forEach((t) => clearTimeout(t));
  scheduledTimeouts = [];
}

function setDateForSet(day: string, hhmm: string): Date | null {
  const d = DAYS.find((x) => x.id === day);
  if (!d) return null;
  let [H, M] = hhmm.split(":").map(Number);
  // 24:00 == 00:00 next day
  const [Y, Mo, D] = d.date.split("-").map(Number);
  let day0 = D;
  if (H === 24) { H = 0; day0 = D + 1; }
  // Europe/Amsterdam — use UTC offset hack: 26.06 NL = UTC+2 (CEST)
  // Build local time in CEST (UTC+2). Festival is in June so CEST.
  // We'll create a Date assuming the wall-clock is CEST.
  const utcMs = Date.UTC(Y, Mo - 1, day0, H, M) - 2 * 60 * 60 * 1000;
  return new Date(utcMs);
}

export function scheduleAll(matches: SetMatch[], prefs: NotifPrefs) {
  clearScheduled();
  if (!prefs.enabled) return 0;
  if (typeof window === "undefined" || !("Notification" in window)) return 0;
  if (Notification.permission !== "granted") return 0;

  const now = Date.now();
  let scheduled = 0;
  for (const m of matches) {
    const start = setDateForSet(m.set.day, m.set.start);
    if (!start) continue;
    const fireAt = start.getTime() - prefs.minutesBefore * 60 * 1000;
    const delay = fireAt - now;
    if (delay <= 0) continue; // already past
    if (delay > 2147483000) continue; // setTimeout max ~24 days
    const stage = STAGES[m.set.stageId]?.name ?? m.set.stageId;
    const id = setTimeout(() => {
      try {
        new Notification(`${m.set.title}`, {
          body: `${stage} · starts in ${prefs.minutesBefore} min · ${m.set.start}`,
          icon: "/icon.svg",
          badge: "/icon.svg",
          tag: m.set.id,
          requireInteraction: false,
        });
      } catch {}
    }, delay);
    scheduledTimeouts.push(id);
    scheduled++;
  }
  return scheduled;
}
