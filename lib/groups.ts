import { decodePicksFromHash } from "./share";

export type FriendPlan = {
  name: string;
  picks: string[];
};

const GROUP_KEY = "intents26_group_v1";

export function loadGroup(): FriendPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GROUP_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

export function saveGroup(group: FriendPlan[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(GROUP_KEY, JSON.stringify(group)); } catch {}
}

// Extract picks from a full share URL or a bare hash fragment.
export function parseSharedUrl(input: string): string[] | null {
  if (!input) return null;
  const trimmed = input.trim();
  // Look for #p=... anywhere in the input
  const idx = trimmed.indexOf("#p=");
  const hash = idx >= 0 ? trimmed.substring(idx) : trimmed;
  return decodePicksFromHash(hash);
}

export type OverlapEntry = {
  artist: string;
  byMe: boolean;
  byFriends: string[]; // friend names who picked
  count: number; // total people (incl. me if byMe) who picked
};

export function computeOverlap(myPicks: string[], friends: FriendPlan[]): OverlapEntry[] {
  const map = new Map<string, OverlapEntry>();
  for (const p of myPicks) {
    const lc = p.toLowerCase();
    map.set(lc, { artist: p, byMe: true, byFriends: [], count: 1 });
  }
  for (const f of friends) {
    for (const p of f.picks) {
      const lc = p.toLowerCase();
      const existing = map.get(lc);
      if (existing) {
        existing.byFriends.push(f.name);
        existing.count += 1;
      } else {
        map.set(lc, { artist: p, byMe: false, byFriends: [f.name], count: 1 });
      }
    }
  }
  // Sort by count desc, then by artist name
  return Array.from(map.values()).sort((a, b) => {
    if (a.count !== b.count) return b.count - a.count;
    return a.artist.localeCompare(b.artist);
  });
}
