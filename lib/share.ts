// Encode/decode picks into a compact URL hash for sharing plans.
// Format: #p=base64(JSON.stringify(picks))

export function encodePicks(picks: string[]): string {
  if (typeof window === "undefined") return "";
  if (picks.length === 0) return "";
  const json = JSON.stringify(picks);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return `#p=${b64}`;
}

export function decodePicksFromHash(hash: string): string[] | null {
  if (!hash) return null;
  const m = hash.match(/[#&]p=([A-Za-z0-9+/=_-]+)/);
  if (!m) return null;
  try {
    const json = decodeURIComponent(escape(atob(m[1])));
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed;
    }
  } catch {}
  return null;
}

export function buildShareUrl(picks: string[]): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.hash = encodePicks(picks).slice(1); // drop leading #
  return url.toString();
}
