import { NextRequest } from "next/server";

// Resolve an artist name to their canonical Spotify profile URL via the
// Spotify Web API (Client Credentials flow — no user auth needed).
// Requires env vars SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.
// Falls back to the /search URL if creds are missing or the lookup fails.

let cachedToken: { value: string; expiresAt: number } | null = null;
const lookupCache = new Map<string, { url: string; cachedAt: number }>();
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

async function getToken(): Promise<string | null> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.value;
  }

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${id}:${secret}`).toString("base64"),
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

function searchFallback(name: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(name)}/artists`;
}

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")?.trim();
  const wantRedirect = req.nextUrl.searchParams.get("redirect") === "1";
  if (!name) {
    return Response.json({ error: "missing name" }, { status: 400 });
  }
  const respond = (url: string, source: string, matchedName?: string) => {
    if (wantRedirect) return Response.redirect(url, 302);
    return Response.json({ url, source, ...(matchedName ? { matchedName } : {}) });
  };
  const key = name.toLowerCase();
  const cached = lookupCache.get(key);
  if (cached && Date.now() - cached.cachedAt < ONE_DAY_MS) {
    return respond(cached.url, "cache");
  }

  const token = await getToken();
  if (!token) {
    return respond(searchFallback(name), "fallback-no-creds");
  }

  try {
    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.set("q", name);
    url.searchParams.set("type", "artist");
    url.searchParams.set("limit", "5");
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return respond(searchFallback(name), "fallback-search-failed");
    }
    const data = (await res.json()) as {
      artists?: { items?: Array<{ id: string; name: string; external_urls?: { spotify?: string }; followers?: { total: number } }> };
    };
    const items = data.artists?.items ?? [];
    if (items.length === 0) {
      const fallback = searchFallback(name);
      lookupCache.set(key, { url: fallback, cachedAt: Date.now() });
      return respond(fallback, "no-match");
    }
    const exact = items.find((a) => a.name.toLowerCase() === name.toLowerCase());
    const chosen = exact ?? items[0];
    const artistUrl = chosen.external_urls?.spotify ?? `https://open.spotify.com/artist/${chosen.id}`;
    lookupCache.set(key, { url: artistUrl, cachedAt: Date.now() });
    return respond(artistUrl, exact ? "exact" : "best-match", chosen.name);
  } catch {
    return respond(searchFallback(name), "fallback-error");
  }
}
