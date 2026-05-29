// Manual Spotify artist overrides.
// When the auto-search picks the wrong profile (common name collision with
// non-hardstyle artists), add an entry here. Key is the artist name as it
// appears in the picker (case-insensitive match), value is the Spotify artist ID.
//
// To find an artist ID:
//  1. Open the correct profile on open.spotify.com
//  2. The URL looks like: https://open.spotify.com/artist/3ujI46PHi7vombfnkjM8C3
//  3. Copy the last segment (3ujI46PHi7vombfnkjM8C3)

export const SPOTIFY_OVERRIDES: Record<string, string> = {
  // Known correct IDs verified manually.
  "Abaddon": "3ujI46PHi7vombfnkjM8C3",
  "Sub Zero Project": "4f0OXMMSxr0r8Ztx6CdpAl",
  "Radical Redemption": "3Ij56hbjOTHq8RgutQwfxC",
  "D-Block & S-te-Fan": "6L7a6wPGpvLtTwOsMLnF1z",
  "Da Tweekaz": "6UOk7DmvqlzWmo6gjhZvn6",
  "Rooler": "2lpFs8QJyIeVDb2Sq4vZYi",
  "Sickmode": "5PbgCU02dfdBCAzpOaNmYW",
};

export function getOverrideUrl(artistName: string): string | null {
  const lc = artistName.toLowerCase();
  for (const [name, id] of Object.entries(SPOTIFY_OVERRIDES)) {
    if (name.toLowerCase() === lc) {
      return `https://open.spotify.com/artist/${id}`;
    }
  }
  return null;
}
