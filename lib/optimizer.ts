import { ALL_SETS, FestivalSet, DayId, toMinutes } from "@/data/schedule";

export type PrioritizedArtist = {
  name: string;
  priority: number; // lower = higher priority (0 = top pick)
};

export type SetMatch = {
  set: FestivalSet;
  matchedArtists: string[]; // selected artists appearing in this set
  topPriority: number; // smallest priority among matched artists
};

export type DayPlan = {
  day: DayId;
  // Conflict-resolved primary timeline ("must-see" route)
  primary: SetMatch[];
  // Sets you ALSO selected, but lost to a conflict on the primary timeline
  conflicts: { dropped: SetMatch; lostTo: SetMatch }[];
  // Free windows between primary sets (>= 5 min gaps), so user can grab food etc.
  gaps: { fromTime: string; toTime: string; minutes: number; afterSetId: string; beforeSetId: string }[];
};

export type Plan = Record<DayId, DayPlan>;

const overlaps = (a: FestivalSet, b: FestivalSet) =>
  toMinutes(a.start) < toMinutes(b.end) && toMinutes(b.start) < toMinutes(a.end);

// Find all sets matching any of the selected artists, attaching match data.
export function matchSets(picks: PrioritizedArtist[]): SetMatch[] {
  const priByLower = new Map<string, number>();
  for (const p of picks) priByLower.set(p.name.toLowerCase(), p.priority);

  const matches: SetMatch[] = [];
  for (const s of ALL_SETS) {
    const matched: string[] = [];
    let topPri = Infinity;
    for (const a of s.artists) {
      const pri = priByLower.get(a.toLowerCase());
      if (pri !== undefined) {
        matched.push(a);
        if (pri < topPri) topPri = pri;
      }
    }
    if (matched.length > 0) matches.push({ set: s, matchedArtists: matched, topPriority: topPri });
  }
  return matches;
}

// Resolve overlaps greedily by priority. When two selected sets overlap,
// the one with the lower topPriority (= more important artist) wins.
// Ties broken by earlier start time.
function buildDayPlan(day: DayId, dayMatches: SetMatch[]): DayPlan {
  // Sort by priority asc, then start asc — pick winners first.
  const byPriority = [...dayMatches].sort((a, b) => {
    if (a.topPriority !== b.topPriority) return a.topPriority - b.topPriority;
    return toMinutes(a.set.start) - toMinutes(b.set.start);
  });

  const primary: SetMatch[] = [];
  const conflicts: { dropped: SetMatch; lostTo: SetMatch }[] = [];

  for (const m of byPriority) {
    const clash = primary.find((p) => overlaps(p.set, m.set));
    if (clash) {
      conflicts.push({ dropped: m, lostTo: clash });
    } else {
      primary.push(m);
    }
  }

  // Sort primary chronologically for display.
  primary.sort((a, b) => toMinutes(a.set.start) - toMinutes(b.set.start));

  // Compute gaps between consecutive primary sets (>= 5 min).
  const gaps: DayPlan["gaps"] = [];
  for (let i = 0; i < primary.length - 1; i++) {
    const a = primary[i].set;
    const b = primary[i + 1].set;
    const gap = toMinutes(b.start) - toMinutes(a.end);
    if (gap >= 5) {
      gaps.push({
        fromTime: a.end,
        toTime: b.start,
        minutes: gap,
        afterSetId: a.id,
        beforeSetId: b.id,
      });
    }
  }

  return { day, primary, conflicts, gaps };
}

export function buildPlan(picks: PrioritizedArtist[]): Plan {
  const matches = matchSets(picks);
  const byDay = {
    friday: matches.filter((m) => m.set.day === "friday"),
    saturday: matches.filter((m) => m.set.day === "saturday"),
    sunday: matches.filter((m) => m.set.day === "sunday"),
  };
  return {
    friday: buildDayPlan("friday", byDay.friday),
    saturday: buildDayPlan("saturday", byDay.saturday),
    sunday: buildDayPlan("sunday", byDay.sunday),
  };
}
