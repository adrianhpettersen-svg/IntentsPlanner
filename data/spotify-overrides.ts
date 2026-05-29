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
  // === Mainstage headliners ===
  "D-Block & S-te-Fan": "6L7a6wPGpvLtTwOsMLnF1z",
  "Da Tweekaz": "6UOk7DmvqlzWmo6gjhZvn6",
  "Sub Zero Project": "4f0OXMMSxr0r8Ztx6CdpAl",
  "Phuture Noize": "7AGSJihqYPhYy5QzMcwcQT",
  "Wildstylez": "0wr85NuJuAYZsRzP1lJgiV",
  "Atmozfears": "0MBGxwmCdXdO26ojaNcT64",
  "B-Front": "6Xhhpra0X0hpvC3yZaQ0Du",
  "Brennan Heart": "5QySqc6yAFDx9m7fedFZmC",
  "Adaro": "05ndiewdJogtosuRWN8iwF",
  "Crypsis": "4Kr8tEhZ6ecAQnqxd7WkTb",
  "Frontliner": "7momuad2Twkv5O7MY3dODa",
  "The Saints": "0CE9b5MpyYgJNxa2bNkOMc",
  "Vertile": "2CREMC4YATn7Bx9ZQku6IH",
  "Sub Sonik": "4FApejrnKXgmvrVmBMRO2l",
  "Rebelion": "5JcSyYpBdqCmjJyVlKh7Yg",
  "Outsiders": "0aKXalHKVzkLJ6aeUY3HMf",
  "Warface": "1wuQQfTDZhgNb4GJyhThUs",
  "Regain": "0Fp1lykJGk1eInmWFbSwoK",
  "Code Black": "0I5is4tdxHhT3Ft2EzPjlB",
  "Sound Rush": "7IFPeV5Ew63S7Hid0AjNgK",
  "Act of Rage": "5eHs2hHfUzGizdnrLjc3CW",
  "Aversion": "2ecqtRdHGMT1SSSaYXoYlC",
  "Sickmode": "5PbgCU02dfdBCAzpOaNmYW",
  "Rooler": "2lpFs8QJyIeVDb2Sq4vZYi",
  "Radical Redemption": "3Ij56hbjOTHq8RgutQwfxC",
  "Adrenalize": "6GebWeCCtey5pbQepRYD6c",
  "Galactixx": "450u38hSRh0Q2UyghEbjpS",
  "Frequencerz": "5cPNMq5lKAoAKyv5kdpz9s",
  "The Straikerz": "23YqfnxHhNcTMAkU4hxl1l",
  "Audiotricz": "52I8HbScEEvgwiiSDaM7gP",
  "Jay Reeve": "5AVdeI8lS5HS9VGV8AUyS4",
  "Rejecta": "2lmihUu4FzVOepdJpDDrof",
  "Adjuzt": "0UDN8FPWVrZoMQ7mQB3bS8",
  "Dual Damage": "05bETZtzSdUI5fconFIKRX",
  "Krowdexx": "7Ecbym3UD6q848BAse6Qeb",
  "Headhunterz": "6C0KWmCdqrLU2LzzWBPbOy",
  "Digital Punk": "3GAHYVHU0HppTq2qgzejcv",
  "Nightcraft": "4IQIMZPSBfizEPPGdCmsXV",
  "Kruelty": "30sKm4Zacgq8mC0l7vNmuD",
  "Unresolved": "6glAHKAPvBPUQ4HQcYXxpr",
  "E-Force": "77faXTf6wXs3L2CVol0c8C",

  // === Fanaticz / hardcore ===
  "Mark with a K": "4OPaH4YIqua9DUnI7t0fOQ",
  "Korsakoff": "6wKDmheoz1o7W1Snk3XSwv",
  "Partyraiser": "39cgo5SPJygKIlIcrwkd73",
  "Bloodlust": "1vDMUXdbIJHTSC8ZAf2Zqp",
  "Sefa": "0caJEGgVuXuSHhhrMCmlkI",
  "Dr. Peacock": "4RbUYWWjEBb4umwqakOEd3",
  "Paul Elstak": "123hDJRbi4KtCdBaaKNHW6",
  "Mad Dog": "7oX7rzli18XsB2WFd88oW4",

  // === Uptempo / Dynamite ===
  "Abaddon": "3ujI46PHi7vombfnkjM8C3",
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
