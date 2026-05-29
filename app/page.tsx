"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ALL_SETS,
  DAYS,
  DayId,
  FestivalSet,
  STAGES,
  spotifySearchUrl,
  toMinutes,
  uniqueArtists,
} from "@/data/schedule";
import { buildPlan, PrioritizedArtist } from "@/lib/optimizer";
import { Lang, t } from "@/lib/i18n";

type Tab = "pick" | "discover" | "plan" | "all";

const STORAGE_KEY = "intents26_picks_v1";
const LANG_KEY = "intents26_lang_v1";
const SKIPPED_KEY = "intents26_skipped_v1";
const DISCOVER_IDX_KEY = "intents26_discover_idx_v1";

function durationLabel(mins: number, lang: Lang) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} ${t("minWord", lang)}`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function stagePill(stageId: string) {
  const s = STAGES[stageId];
  if (!s) return null;
  return (
    <span className="stage-pill" style={{ background: s.color }}>
      {s.name}
    </span>
  );
}

function SetRow({
  m,
  lang,
}: {
  m: { set: FestivalSet; matchedArtists: string[] };
  lang: Lang;
}) {
  const s = m.set;
  const dur = toMinutes(s.end) - toMinutes(s.start);
  return (
    <div className="timeline-item">
      <div className="time">
        {s.start} – {s.end === "24:00" ? "00:00" : s.end}
        <span className="duration">{durationLabel(dur, lang)}</span>
      </div>
      <div className="body">
        <div>
          {stagePill(s.stageId)}
          <span className="title">{s.title}</span>
        </div>
        {s.note && <div className="meta">{s.note}</div>}
        <div>
          {m.matchedArtists.map((a) => (
            <span className="matched" key={a}>
              ★ {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState<Lang>("no");
  const [tab, setTab] = useState<Tab>("pick");
  const [dayTab, setDayTab] = useState<DayId>("friday");
  const [query, setQuery] = useState("");
  const [picks, setPicks] = useState<string[]>([]); // ordered: index 0 = highest priority
  const [skipped, setSkipped] = useState<string[]>([]);
  const [discoverIdx, setDiscoverIdx] = useState(0);

  // Hydrate from localStorage.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPicks(JSON.parse(raw));
      const l = localStorage.getItem(LANG_KEY);
      if (l === "no" || l === "en") setLang(l);
      const sk = localStorage.getItem(SKIPPED_KEY);
      if (sk) setSkipped(JSON.parse(sk));
      const di = localStorage.getItem(DISCOVER_IDX_KEY);
      if (di) setDiscoverIdx(Number(di) || 0);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(picks)); } catch {}
  }, [picks]);
  useEffect(() => {
    try { localStorage.setItem(LANG_KEY, lang); } catch {}
  }, [lang]);
  useEffect(() => {
    try { localStorage.setItem(SKIPPED_KEY, JSON.stringify(skipped)); } catch {}
  }, [skipped]);
  useEffect(() => {
    try { localStorage.setItem(DISCOVER_IDX_KEY, String(discoverIdx)); } catch {}
  }, [discoverIdx]);

  const allArtists = useMemo(() => uniqueArtists(), []);
  const visibleArtists = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allArtists;
    return allArtists.filter((a) => a.toLowerCase().includes(q));
  }, [allArtists, query]);

  const prioritized: PrioritizedArtist[] = useMemo(
    () => picks.map((name, i) => ({ name, priority: i })),
    [picks]
  );

  const plan = useMemo(() => buildPlan(prioritized), [prioritized]);

  // Discover queue: artists not yet picked AND not yet skipped.
  const discoverQueue = useMemo(() => {
    const seen = new Set([...picks, ...skipped].map((a) => a.toLowerCase()));
    return allArtists.filter((a) => !seen.has(a.toLowerCase()));
  }, [allArtists, picks, skipped]);

  const currentDiscover = discoverQueue[discoverIdx];

  // Sets the current discover artist plays in (for context).
  const currentDiscoverSets = useMemo(() => {
    if (!currentDiscover) return [];
    const lc = currentDiscover.toLowerCase();
    return ALL_SETS.filter((s) => s.artists.some((a) => a.toLowerCase() === lc));
  }, [currentDiscover]);

  // Resolved Spotify artist URL for the current discover artist.
  const [resolvedSpotify, setResolvedSpotify] = useState<{ url: string; source: string } | null>(null);
  useEffect(() => {
    if (!currentDiscover) {
      setResolvedSpotify(null);
      return;
    }
    let cancelled = false;
    setResolvedSpotify(null);
    fetch(`/api/spotify-artist?name=${encodeURIComponent(currentDiscover)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setResolvedSpotify({ url: d.url, source: d.source }); })
      .catch(() => {
        if (!cancelled) setResolvedSpotify({ url: spotifySearchUrl(currentDiscover), source: "client-error" });
      });
    return () => { cancelled = true; };
  }, [currentDiscover]);

  const discoverAdd = () => {
    if (!currentDiscover) return;
    setPicks((p) => (p.includes(currentDiscover) ? p : [...p, currentDiscover]));
    // queue shrinks by 1 once the picked artist filters out, so index stays where it is.
  };
  const discoverSkip = () => {
    if (!currentDiscover) return;
    setSkipped((s) => (s.includes(currentDiscover) ? s : [...s, currentDiscover]));
  };
  const discoverBack = () => {
    // Undo the last decision by removing the most recent skip or pick that's still applicable.
    // Simplest: pop last skip if any, else last pick.
    if (skipped.length > 0) {
      setSkipped((s) => s.slice(0, -1));
    } else if (picks.length > 0) {
      setPicks((p) => p.slice(0, -1));
    }
  };
  const discoverReset = () => {
    setSkipped([]);
    setDiscoverIdx(0);
  };

  const togglePick = (name: string) => {
    setPicks((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  };
  const movePickUp = (name: string) => {
    setPicks((p) => {
      const i = p.indexOf(name);
      if (i <= 0) return p;
      const c = [...p];
      [c[i - 1], c[i]] = [c[i], c[i - 1]];
      return c;
    });
  };
  const movePickDown = (name: string) => {
    setPicks((p) => {
      const i = p.indexOf(name);
      if (i === -1 || i === p.length - 1) return p;
      const c = [...p];
      [c[i + 1], c[i]] = [c[i], c[i + 1]];
      return c;
    });
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="kicker">05–07 Jun 2026 · Oisterwijk</div>
          <h1 className="title">{t("title", lang)}</h1>
          <div className="subtitle">{t("subtitle", lang)}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            className={`chip ${lang === "no" ? "selected" : ""}`}
            onClick={() => setLang("no")}
          >
            NO
          </button>
          <button
            className={`chip ${lang === "en" ? "selected" : ""}`}
            onClick={() => setLang("en")}
          >
            EN
          </button>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === "pick" ? "active" : ""}`} onClick={() => setTab("pick")}>
          {t("tabPick", lang)} {picks.length > 0 && `(${picks.length})`}
        </button>
        <button className={`tab ${tab === "discover" ? "active" : ""}`} onClick={() => setTab("discover")}>
          {t("tabDiscover", lang)}
        </button>
        <button className={`tab ${tab === "plan" ? "active" : ""}`} onClick={() => setTab("plan")}>
          {t("tabPlan", lang)}
        </button>
        <button className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          {t("tabAll", lang)}
        </button>
      </div>

      {tab === "pick" && (
        <div className="section">
          <div className="toolbar">
            <input
              type="text"
              placeholder={t("searchArtists", lang)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ maxWidth: 360 }}
            />
            {picks.length > 0 && (
              <button onClick={() => setPicks([])} className="ghost">
                {t("clear", lang)}
              </button>
            )}
            <span style={{ color: "var(--text-dim)", fontSize: 13 }}>
              {picks.length} {t("selectedCount", lang)} / {allArtists.length}
            </span>
          </div>

          {picks.length > 0 && (
            <div className="selected-row">
              <div style={{ width: "100%", color: "var(--text-dim)", fontSize: 12, marginBottom: 6 }}>
                {t("selectedHeader", lang)}
              </div>
              {picks.map((name, i) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: 999,
                    padding: "4px 4px 4px 10px",
                  }}
                >
                  <span style={{ fontSize: 13 }}>
                    <span style={{ color: "var(--accent)", fontWeight: 700, marginRight: 6 }}>
                      #{i + 1}
                    </span>
                    {name}
                  </span>
                  <button
                    className="ghost"
                    style={{ padding: "2px 6px", fontSize: 12 }}
                    onClick={() => movePickUp(name)}
                    title="↑"
                  >
                    ↑
                  </button>
                  <button
                    className="ghost"
                    style={{ padding: "2px 6px", fontSize: 12 }}
                    onClick={() => movePickDown(name)}
                    title="↓"
                  >
                    ↓
                  </button>
                  <button
                    className="ghost"
                    style={{ padding: "2px 8px", fontSize: 12 }}
                    onClick={() => togglePick(name)}
                    title="×"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div style={{ width: "100%", color: "var(--text-dim)", fontSize: 11, marginTop: 8 }}>
                {t("conflictTip", lang)}
              </div>
            </div>
          )}

          <div className="grid-artists">
            {visibleArtists.map((a) => {
              const isSelected = picks.includes(a);
              const pri = picks.indexOf(a);
              return (
                <div
                  key={a}
                  className={`artist-card ${isSelected ? "selected" : ""}`}
                  onClick={() => togglePick(a)}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a}
                  </span>
                  {isSelected && <span className="pri-badge">#{pri + 1}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "discover" && (
        <div className="section">
          <div style={{ color: "var(--text-dim)", marginBottom: 14 }}>{t("discoverIntro", lang)}</div>

          {!currentDiscover ? (
            <div className="muted-empty">
              <div style={{ fontSize: 18, marginBottom: 14 }}>{t("discoverDone", lang)}</div>
              <button className="ghost" onClick={discoverReset}>
                {t("reset", lang)}
              </button>
            </div>
          ) : (
            <div className="discover-card">
              <div className="discover-meta">
                {discoverIdx + 1 + picks.length + skipped.length} {t("ofWord", lang)}{" "}
                {allArtists.length}
              </div>
              <h2 className="discover-name">{currentDiscover}</h2>

              {currentDiscoverSets.length > 0 && (
                <div className="discover-sets">
                  <div className="discover-sets-label">{t("playsAt", lang)}:</div>
                  {currentDiscoverSets.slice(0, 4).map((s) => {
                    const dayLabel = DAYS.find((d) => d.id === s.day);
                    return (
                      <div key={s.id} className="discover-set-row">
                        <span className="stage-pill" style={{ background: STAGES[s.stageId]?.color }}>
                          {STAGES[s.stageId]?.name}
                        </span>
                        <span style={{ marginLeft: 8 }}>
                          {lang === "no" ? dayLabel?.labelNo : dayLabel?.labelEn} ·{" "}
                          {s.start}–{s.end === "24:00" ? "00:00" : s.end}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="discover-listen-row">
                <a
                  href={resolvedSpotify?.url ?? spotifySearchUrl(currentDiscover)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="listen-link spotify"
                >
                  <span className="play-icon">▶</span>
                  <span>{t("listenSpotify", lang)}</span>
                </a>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentDiscover + " hardstyle")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="listen-link youtube"
                >
                  <span className="play-icon">▶</span>
                  <span>YouTube</span>
                </a>
              </div>

              <div className="discover-actions">
                <button className="discover-btn skip-btn" onClick={discoverSkip} title={t("skip", lang)}>
                  <span style={{ fontSize: 28 }}>✗</span>
                  <span>{t("skip", lang)}</span>
                </button>
                <button className="discover-btn back-btn" onClick={discoverBack} title={t("back", lang)}>
                  <span style={{ fontSize: 22 }}>↩</span>
                  <span style={{ fontSize: 12 }}>{t("back", lang)}</span>
                </button>
                <button className="discover-btn add-btn" onClick={discoverAdd} title={t("add", lang)}>
                  <span style={{ fontSize: 28 }}>✓</span>
                  <span>{t("add", lang)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "plan" && (
        <div className="section">
          {picks.length === 0 ? (
            <div className="muted-empty">{t("pickFirst", lang)}</div>
          ) : (
            <>
              <div className="day-tabs">
                {DAYS.map((d) => (
                  <button
                    key={d.id}
                    className={`chip day-tab ${dayTab === d.id ? "active" : ""}`}
                    onClick={() => setDayTab(d.id)}
                  >
                    {lang === "no" ? d.labelNo : d.labelEn}
                    <span style={{ opacity: 0.6, marginLeft: 6 }}>
                      {plan[d.id].primary.length}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 12, color: "var(--text-dim)", fontSize: 13 }}>
                <strong style={{ color: "var(--text)" }}>{t("optimalRoute", lang)}</strong>{" "}
                ·{" "}
                {plan[dayTab].primary.length} sets{" "}
                {plan[dayTab].conflicts.length > 0 && (
                  <>
                    · <span style={{ color: "var(--warning)" }}>{plan[dayTab].conflicts.length} {lang === "no" ? "konflikter" : "conflicts"}</span>
                  </>
                )}
              </div>

              {plan[dayTab].primary.length === 0 ? (
                <div className="muted-empty">{t("noSetsForDay", lang)}</div>
              ) : (
                <div className="timeline">
                  {plan[dayTab].primary.map((m, idx) => {
                    const next = plan[dayTab].primary[idx + 1];
                    const gap = next ? toMinutes(next.set.start) - toMinutes(m.set.end) : 0;
                    return (
                      <div key={m.set.id}>
                        <SetRow m={m} lang={lang} />
                        {next && gap >= 5 && (
                          <div className="gap">
                            ↓ {t("gapWord", lang)}: {gap} {t("minWord", lang)}{" "}
                            {STAGES[m.set.stageId]?.id !== STAGES[next.set.stageId]?.id && (
                              <>
                                · {t("movedToWord", lang)} {STAGES[next.set.stageId]?.name}
                              </>
                            )}
                          </div>
                        )}
                        {next && gap > 0 && gap < 5 && (
                          <div className="gap" style={{ color: "var(--warning)" }}>
                            ↓ {gap} {t("minWord", lang)} {lang === "no" ? "spurt!" : "sprint!"}{" "}
                            {STAGES[m.set.stageId]?.id !== STAGES[next.set.stageId]?.id && (
                              <>→ {STAGES[next.set.stageId]?.name}</>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {plan[dayTab].conflicts.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h2>{t("conflictsHeader", lang)}</h2>
                  {plan[dayTab].conflicts.map((c, i) => (
                    <div key={i} className="conflict-card">
                      <div className="label">⚠︎ {t("conflictDropped", lang)}</div>
                      <div style={{ marginBottom: 4 }}>
                        <strong>{c.dropped.set.title}</strong> · {STAGES[c.dropped.set.stageId]?.name} ·{" "}
                        {c.dropped.set.start}–{c.dropped.set.end}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
                        {t("conflictLostTo", lang)}: <strong>{c.lostTo.set.title}</strong> ·{" "}
                        {STAGES[c.lostTo.set.stageId]?.name} · {c.lostTo.set.start}–{c.lostTo.set.end}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "all" && (
        <div className="section">
          <div style={{ color: "var(--text-dim)", marginBottom: 12 }}>{t("allArtistsTip", lang)}</div>
          <div className="grid-artists">
            {allArtists.map((a) => (
              <div key={a} className="artist-card" style={{ cursor: "default" }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a}
                </span>
                <a
                  href={`/api/spotify-artist?redirect=1&name=${encodeURIComponent(a)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button className="spotify-btn">{t("spotifySearch", lang)}</button>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 60, textAlign: "center", color: "var(--text-dim)", fontSize: 12 }}>
        Data extracted from official IF26 timetables · Verify before festival ·{" "}
        <a href="https://intentsfestival.nl" target="_blank" rel="noopener noreferrer">intentsfestival.nl</a>
      </div>
    </div>
  );
}
