// Intents Festival 2026 — schedule
// Extracted from the official IF26 timetables (Friday, Saturday, Sunday).
// All times in "HH:MM" 24h. End time "24:00" means midnight (end of day).
// If you spot a mistake, just edit the row — the rest of the app will pick it up.

export type DayId = "friday" | "saturday" | "sunday";

export type Stage = {
  id: string;
  name: string;
  color: string; // tailwind-ish hex, used in the UI
  host?: string;
};

export type FestivalSet = {
  id: string;
  day: DayId;
  stageId: string;
  title: string; // raw title as printed on the timetable
  artists: string[]; // split artists ("X vs Y" -> ["X","Y"])
  start: string; // "HH:MM"
  end: string; // "HH:MM" (use "24:00" for midnight)
  note?: string; // sub-title / "Journey" / "LIVE" tags etc.
};

export const DAYS: { id: DayId; labelEn: string; labelNo: string; date: string }[] = [
  { id: "friday", labelEn: "Friday", labelNo: "Fredag", date: "2026-06-05" },
  { id: "saturday", labelEn: "Saturday", labelNo: "Lørdag", date: "2026-06-06" },
  { id: "sunday", labelEn: "Sunday", labelNo: "Søndag", date: "2026-06-07" },
];

// Stages — colors picked to match the timetable color coding.
export const STAGES: Record<string, Stage> = {
  mainstage: { id: "mainstage", name: "Mainstage", color: "#f5c400", host: "Villain" },
  indoor_mainstage: { id: "indoor_mainstage", name: "Indoor Mainstage", color: "#3da6e0" },
  dynamite: { id: "dynamite", name: "Dynamite", color: "#8a8d92" },
  fanaticz: { id: "fanaticz", name: "Fanaticz", color: "#d23a3a" },
  outrageous: { id: "outrageous", name: "Outrageous", color: "#e84cc7" },
  revive: { id: "revive", name: "Revive", color: "#7a5cc2" },
  energetic: { id: "energetic", name: "Energetic", color: "#19b39a" },
  karnaval: { id: "karnaval", name: "Karnaval Festival Feestcafé", color: "#ec8c2b" },
  boombox: { id: "boombox", name: "Boombox", color: "#7fc24a" },
  melodica: { id: "melodica", name: "Melodica", color: "#5fbf6b" },
  uiltje: { id: "uiltje", name: "Uiltje", color: "#9a7c46" },
  intentscity: { id: "intentscity", name: "Intentscity", color: "#b6a1d8" },
};

// Convert "HH:MM" -> minutes from midnight. "24:00" = 1440.
export function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// Build set helper to keep the table below readable.
// Pass `artistsOverride` for sets where the title doesn't lend itself to auto-extraction
// (e.g. "15 Years of Radical Redemption LIVE" → ["Radical Redemption"]).
const set = (
  day: DayId,
  stageId: string,
  start: string,
  end: string,
  title: string,
  note?: string,
  artistsOverride?: string[]
): FestivalSet => {
  let artists: string[];
  if (artistsOverride && artistsOverride.length > 0) {
    artists = artistsOverride;
  } else {
    // Strip everything after " - " (sub-title / show concept tag).
    // Strip trailing " LIVE", " Live".
    const cleaned = title
      .replace(/\s+-\s+.*$/, "")
      .replace(/\s+LIVE\b.*$/i, "")
      .replace(/\s+\(.*?\)\s*/g, " ")
      .trim();
    artists = cleaned
      .split(/\s+vs\s+|\s+&\s+|\s+pres\.?\s+|\s+ft\.?\s+/i)
      .map((a) => a.trim())
      .filter(Boolean);
  }
  const id = `${day}-${stageId}-${start.replace(":", "")}-${title.replace(/[^a-z0-9]+/gi, "").slice(0, 24)}`;
  return { id, day, stageId, title, artists, start, end, note };
};

// =====================================================================
// FRIDAY 05.06.26
// =====================================================================
const friday: FestivalSet[] = [
  // Mainstage
  set("friday", "mainstage", "17:00", "17:15", "The Opening Ceremony"),
  set("friday", "mainstage", "17:15", "18:15", "D-Block & S-te-Fan"),
  set("friday", "mainstage", "18:15", "19:00", "Da Tweekaz"),
  set("friday", "mainstage", "19:00", "19:45", "Aversion vs Phuture Noize"),
  set("friday", "mainstage", "19:45", "20:15", "Rejecta - Patient Zero"),
  set("friday", "mainstage", "20:15", "21:00", "Rebelion"),
  set("friday", "mainstage", "21:00", "22:00", "Dual Damage vs Rooler"),
  set("friday", "mainstage", "22:00", "22:30", "AWAKE ASLEEP AdJuzT"),
  set("friday", "mainstage", "22:30", "23:15", "Sickmode"),
  set("friday", "mainstage", "23:15", "24:00", "Radical Redemption vs Kruelty LIVE"),

  // Dynamite
  set("friday", "dynamite", "14:00", "15:00", "Dimma vs MT vs T.M.O."),
  set("friday", "dynamite", "15:00", "16:00", "Revealer vs Udow"),
  set("friday", "dynamite", "16:00", "16:45", "Kemal vs Missy"),
  set("friday", "dynamite", "16:45", "17:45", "Abaddon vs Revellers vs Rosbeek"),
  set("friday", "dynamite", "17:45", "18:45", "Spitnoise - The Ultimate Mashup"),
  set("friday", "dynamite", "18:45", "19:15", "Akimbo - Game Over"),
  set("friday", "dynamite", "19:15", "20:15", "Soulblast vs The Dope Doctor"),
  set("friday", "dynamite", "20:15", "21:00", "Major Conspiracy"),
  set("friday", "dynamite", "21:00", "22:00", "Gezellige Uptempo vs Kili"),
  set("friday", "dynamite", "22:00", "23:00", "Dimitri K vs Satirized"),
  set("friday", "dynamite", "23:00", "23:45", "Invaderz"),

  // Fanaticz
  set("friday", "fanaticz", "14:00", "14:45", "Disaster vs Suspect"),
  set("friday", "fanaticz", "14:45", "15:45", "Coldax vs Unique"),
  set("friday", "fanaticz", "15:45", "16:30", "The Straikerz - Journey"),
  set("friday", "fanaticz", "16:30", "17:30", "Revelation vs Unload"),
  set("friday", "fanaticz", "17:30", "18:30", "The Straikerz vs Damaxy vs Detailed"),
  set("friday", "fanaticz", "18:30", "20:30", "Titans Roulette", "Straikerz, Adjuzt, Dual Damage, Fraw, Mutilator, Rooler, Sickmode, Toza", ["The Straikerz", "Adjuzt", "Dual Damage", "Fraw", "Mutilator", "Rooler", "Sickmode", "Toza"]),
  set("friday", "fanaticz", "20:30", "21:15", "The Straikerz vs Noxiouz vs Yoshiko - Slowtempo Special"),
  set("friday", "fanaticz", "21:15", "21:45", "Krowdexx - We The Loudest LIVE"),
  set("friday", "fanaticz", "21:45", "22:45", "Exproz vs The Smiler"),
  set("friday", "fanaticz", "22:45", "23:30", "Bloodlust vs Infliction"),

  // Revive
  set("friday", "revive", "14:00", "14:45", "Resilience"),
  set("friday", "revive", "14:45", "15:45", "Bass Chaserz - 15 Years Chasin The Bass"),
  set("friday", "revive", "15:45", "16:45", "Digital Punk vs Nightcraft"),
  set("friday", "revive", "16:45", "17:30", "Deluzion"),
  set("friday", "revive", "17:30", "18:30", "E-Force"),
  set("friday", "revive", "18:30", "19:30", "Jones vs Jason Payne pres. Timelapse"),
  set("friday", "revive", "19:30", "20:30", "Adaro vs Wolv"),
  set("friday", "revive", "20:30", "21:30", "Sub Sonik - My True DNA"),
  set("friday", "revive", "21:30", "22:15", "Regain - Classics"),
  set("friday", "revive", "22:15", "23:00", "Unresolved - Journey"),
  set("friday", "revive", "23:00", "23:45", "Chapter V vs Infrium - Spoontech Legacy"),

  // Boombox
  set("friday", "boombox", "14:00", "15:00", "DJ Contest"),
  set("friday", "boombox", "15:00", "16:00", "Infearus"),
  set("friday", "boombox", "16:00", "17:00", "Mistofz vs the Dispatcher"),
  set("friday", "boombox", "17:00", "18:00", "Eclypse vs Twysted"),
  set("friday", "boombox", "18:00", "19:00", "DJ Contest"),
  set("friday", "boombox", "19:00", "20:00", "Dejection"),
  set("friday", "boombox", "20:00", "21:00", "Tob-E"),
  set("friday", "boombox", "21:00", "22:00", "Elevation"),
  set("friday", "boombox", "22:00", "23:00", "NSIDE vs Repeller"),
];

// =====================================================================
// SATURDAY 06.06.26
// =====================================================================
const saturday: FestivalSet[] = [
  // Mainstage
  set("saturday", "mainstage", "12:00", "12:30", "Zelecter"),
  set("saturday", "mainstage", "13:00", "13:45", "Jones - Evolved Euphoria"),
  set("saturday", "mainstage", "13:45", "14:45", "Adrenaline vs Code Black"),
  set("saturday", "mainstage", "14:45", "15:30", "DJ Isaac"),
  set("saturday", "mainstage", "15:30", "16:15", "FreeShow - Melodymax LIVE", undefined, ["Melodymax"]),
  set("saturday", "mainstage", "16:15", "16:45", "D-Sturb - Universe"),
  set("saturday", "mainstage", "16:45", "17:45", "Phuture Noize - Journey"),
  set("saturday", "mainstage", "17:45", "18:45", "Outsiders"),
  set("saturday", "mainstage", "18:45", "19:45", "Rooler"),
  set("saturday", "mainstage", "19:45", "20:25", "Vertile"),
  set("saturday", "mainstage", "20:25", "20:30", "Anthem Moment by Vertile & The Saints", undefined, ["Vertile", "The Saints"]),
  set("saturday", "mainstage", "20:30", "21:00", "The Saints - Holy Dreams LIVE"),
  set("saturday", "mainstage", "21:00", "21:45", "Sub Zero Project - Our World LIVE"),
  set("saturday", "mainstage", "21:45", "22:30", "D-Block & S-te-Fan - Journey"),
  set("saturday", "mainstage", "22:30", "23:00", "Dynamite LIVE", "Lekkerfaces, Noxiouz, Satirized & The Dark Horror", ["Lekkerfaces", "Noxiouz", "Satirized", "The Dark Horror"]),
  set("saturday", "mainstage", "23:00", "23:30", "Radical Redemption vs Regain - Closing"),
  set("saturday", "mainstage", "23:30", "24:00", "Endshow"),

  // Indoor Mainstage
  set("saturday", "indoor_mainstage", "12:00", "12:45", "Odex"),
  set("saturday", "indoor_mainstage", "12:45", "13:30", "Osyo"),
  set("saturday", "indoor_mainstage", "13:30", "14:00", "Roosters vs T.M.O."),
  set("saturday", "indoor_mainstage", "14:00", "15:00", "Crypsis - Journey"),
  set("saturday", "indoor_mainstage", "15:00", "16:00", "Radical Redemption vs Regain - The Opening"),
  set("saturday", "indoor_mainstage", "16:00", "17:00", "AMBER3CK vs Revelation"),
  set("saturday", "indoor_mainstage", "17:00", "17:30", "Marshals of Mayhem LIVE"),
  set("saturday", "indoor_mainstage", "17:30", "18:00", "Regain vs Nightcraft"),
  set("saturday", "indoor_mainstage", "18:00", "19:00", "Radical Redemption vs Warface"),
  set("saturday", "indoor_mainstage", "19:00", "19:30", "Regain vs Rejecta"),
  set("saturday", "indoor_mainstage", "19:30", "20:00", "Radical Redemption - The Legacy"),
  set("saturday", "indoor_mainstage", "20:00", "21:30", "Radical Redemption - The Legacy"),
  set("saturday", "indoor_mainstage", "21:30", "22:30", "Polish Punisher vs Unresolved"),
  set("saturday", "indoor_mainstage", "22:30", "23:30", "Pinotello"),

  // Dynamite
  set("saturday", "dynamite", "12:00", "13:00", "DJ Contest"),
  set("saturday", "dynamite", "13:00", "14:00", "Roosters vs T.M.O."),
  set("saturday", "dynamite", "14:00", "15:00", "Manifest Destiny vs Thurken vs Valhalla"),
  set("saturday", "dynamite", "15:00", "16:00", "Radical Redemption vs Regain - The Opening"),
  set("saturday", "dynamite", "16:00", "17:00", "Lekkerfaces vs Satirized - The Opening"),
  set("saturday", "dynamite", "17:00", "18:00", "Lekkerfaces vs Satirized vs Devilly Goes"),
  set("saturday", "dynamite", "18:00", "19:00", "Lekkerfaces vs Sickmode"),
  set("saturday", "dynamite", "19:00", "20:00", "Barber vs Gezellige Uptempo"),
  set("saturday", "dynamite", "20:00", "21:00", "Lekkerfaces pres. HYPER"),
  set("saturday", "dynamite", "21:00", "22:00", "Lekkerfaces vs Satirized vs Daddy Gams"),
  set("saturday", "dynamite", "22:00", "23:00", "Mutilator - Rave Reactor"),
  set("saturday", "dynamite", "23:00", "23:30", "Partyraiser vs Yoshiko"),

  // Fanaticz
  set("saturday", "fanaticz", "12:00", "13:00", "DJ Contest"),
  set("saturday", "fanaticz", "13:00", "13:30", "Sanctuary LIVE"),
  set("saturday", "fanaticz", "13:30", "14:30", "Dr. Rude"),
  set("saturday", "fanaticz", "14:30", "15:30", "Deezl"),
  set("saturday", "fanaticz", "15:30", "16:30", "Detailed LIVE"),
  set("saturday", "fanaticz", "16:30", "17:00", "Infliction vs Unique vs Unload"),
  set("saturday", "fanaticz", "17:00", "18:00", "Sparkz vs The Smiler"),
  set("saturday", "fanaticz", "18:00", "19:00", "Element - Ode To The Past Show"),
  set("saturday", "fanaticz", "19:00", "19:30", "Chapter V vs The Purge"),
  set("saturday", "fanaticz", "19:30", "20:00", "Toza LIVE"),
  set("saturday", "fanaticz", "20:00", "21:00", "Bloodlust vs Omnya"),
  set("saturday", "fanaticz", "21:00", "22:00", "Domavy vs TITI"),
  set("saturday", "fanaticz", "22:00", "22:30", "Faceless LIVE"),
  set("saturday", "fanaticz", "22:30", "23:30", "Andervx vs Fraw"),
  set("saturday", "fanaticz", "23:30", "24:00", "Incult vs Marris LIVE"),

  // Outrageous
  set("saturday", "outrageous", "12:00", "12:30", "Low Frequency"),
  set("saturday", "outrageous", "12:30", "13:15", "Royalistiq"),
  set("saturday", "outrageous", "13:15", "14:00", "RMK Showcase"),
  set("saturday", "outrageous", "14:00", "15:00", "Zany - Classics"),
  set("saturday", "outrageous", "15:00", "16:00", "Mark with a K & MC Chucky - Journey"),
  set("saturday", "outrageous", "16:00", "17:00", "Psyko Punkz - Classics"),
  set("saturday", "outrageous", "17:00", "17:45", "DJ Thera - 25 Years"),
  set("saturday", "outrageous", "17:45", "18:30", "Pat B"),
  set("saturday", "outrageous", "18:30", "19:30", "Chapter V vs The Purge"),
  set("saturday", "outrageous", "19:30", "20:30", "Adaro vs Chain Reaction - Classics"),
  set("saturday", "outrageous", "20:30", "21:00", "Odium"),
  set("saturday", "outrageous", "21:00", "21:45", "Jason Payne - Hardcore Goldschool"),
  set("saturday", "outrageous", "21:45", "22:45", "Revellers vs Tharoza"),
  set("saturday", "outrageous", "22:45", "23:30", "Noxferatu vs The Viper - Millennium"),

  // Energetic
  set("saturday", "energetic", "12:00", "12:30", "Maistro vs MT"),
  set("saturday", "energetic", "12:30", "13:30", "Double Trouble vs Josha vs Latinity"),
  set("saturday", "energetic", "13:30", "14:30", "Noise of Aggression"),
  set("saturday", "energetic", "14:30", "15:30", "Gaiberzy vs Silky Noize"),
  set("saturday", "energetic", "15:30", "16:30", "DMHC - Hosst Right LIVE"),
  set("saturday", "energetic", "16:30", "17:30", "Unlocked LIVE"),
  set("saturday", "energetic", "17:30", "18:30", "Jan Biggel"),
  set("saturday", "energetic", "18:30", "19:00", "Drien Roelvink"),
  set("saturday", "energetic", "19:00", "19:30", "Angst voor Aakt"),
  set("saturday", "energetic", "19:30", "20:30", "Deviation vs Eraized vs Screucher"),
  set("saturday", "energetic", "20:30", "21:30", "CV de Weggooiers"),
  set("saturday", "energetic", "21:30", "22:30", "Mizo vs Olnox"),
  set("saturday", "energetic", "22:30", "23:30", "DJ Contest"),

  // Karnaval
  set("saturday", "karnaval", "12:00", "15:30", "DJ Die Ene Sjors"),
  set("saturday", "karnaval", "15:30", "16:00", "Guus Doggen"),
  set("saturday", "karnaval", "16:00", "17:00", "DJ Die Ene Sjors"),
  set("saturday", "karnaval", "17:00", "18:00", "Jan Biggel"),
  set("saturday", "karnaval", "18:00", "18:30", "DJ Mats"),
  set("saturday", "karnaval", "18:30", "19:00", "Immer Hansi"),
  set("saturday", "karnaval", "19:00", "19:30", "DJ Mats"),
  set("saturday", "karnaval", "19:30", "20:15", "DJ Mats"),
  set("saturday", "karnaval", "20:15", "20:45", "DJ Mats"),
  set("saturday", "karnaval", "20:45", "21:30", "DJ Mats"),
  set("saturday", "karnaval", "21:30", "22:00", "Vieze Jack"),
  set("saturday", "karnaval", "22:00", "23:00", "Special Krew"),
  set("saturday", "karnaval", "23:00", "23:30", "DJ Contest"),

  // Boombox
  set("saturday", "boombox", "12:00", "13:00", "B-Struct vs Dystone"),
  set("saturday", "boombox", "13:00", "14:00", "RuneRave"),
  set("saturday", "boombox", "14:00", "15:00", "Dirty Lil Monkeyz"),
  set("saturday", "boombox", "15:00", "16:00", "Fragment"),
  set("saturday", "boombox", "16:00", "17:00", "Madmize"),
  set("saturday", "boombox", "17:00", "17:30", "Big K"),
  set("saturday", "boombox", "17:30", "18:30", "Bounster"),
  set("saturday", "boombox", "18:30", "19:00", "Unmute"),
  set("saturday", "boombox", "19:00", "19:30", "Adrenalize - VIBES"),
  set("saturday", "boombox", "19:30", "20:30", "DJ Mats"),
  set("saturday", "boombox", "20:30", "21:00", "Mainfree vs D-Stroy"),
  set("saturday", "boombox", "21:00", "22:00", "Invated"),
  set("saturday", "boombox", "22:00", "23:00", "Iggnnvnts"),

  // Melodica
  set("saturday", "melodica", "12:00", "13:00", "TWSTD"),
  set("saturday", "melodica", "13:00", "14:00", "Arkd vs Envine"),
  set("saturday", "melodica", "14:00", "15:00", "Serze"),
  set("saturday", "melodica", "15:00", "16:00", "Audiotricz Infinity"),
  set("saturday", "melodica", "16:00", "16:30", "Jay Reeve LIVE"),
  set("saturday", "melodica", "16:30", "17:00", "AviB"),
  set("saturday", "melodica", "17:00", "18:00", "Solstice"),
  set("saturday", "melodica", "18:00", "19:00", "Adrenalyze - VIBES"),
  set("saturday", "melodica", "19:00", "19:30", "Coldax vs Detailed vs Disaster"),
  set("saturday", "melodica", "19:30", "20:30", "Coldax vs Detailed vs Disaster - Dolle Marathon"),
  set("saturday", "melodica", "20:30", "21:00", "Wasted Penguinz"),
  set("saturday", "melodica", "21:00", "22:00", "Atmozfears - Journey"),
  set("saturday", "melodica", "22:00", "23:00", "Ecstatic vs Galactixx"),

  // Intentscity
  set("saturday", "intentscity", "10:00", "11:30", "Faceless Bingo Show pres. Morning Rays"),
  set("saturday", "intentscity", "11:30", "12:00", "Faceless vs Unique"),
  set("saturday", "intentscity", "13:30", "14:30", "TWSTD"),
  set("saturday", "intentscity", "14:30", "16:00", "More Kords"),
  set("saturday", "intentscity", "16:00", "17:00", "Krowdexx vs Kemal"),
  set("saturday", "intentscity", "17:00", "18:00", "Kruelty vs Dr. Donk"),
  set("saturday", "intentscity", "18:00", "19:30", "Coldax vs Detailed vs Disaster - Dolle Marathon"),
];

// =====================================================================
// SUNDAY 07.06.26
// =====================================================================
const sunday: FestivalSet[] = [
  // Mainstage
  set("sunday", "mainstage", "13:00", "14:00", "Gezellige Uptempo vs Sound Rush - Rise of Olympass"),
  set("sunday", "mainstage", "14:00", "15:15", "Jay Reeve LIVE"),
  set("sunday", "mainstage", "15:15", "15:45", "Galactixx LIVE"),
  set("sunday", "mainstage", "15:45", "16:45", "Brennan Heart ft Villain present The Legacy Trip", undefined, ["Brennan Heart", "Villain"]),
  set("sunday", "mainstage", "16:45", "17:45", "Act of Rage vs B-Front"),
  set("sunday", "mainstage", "17:45", "18:30", "Stonewalwd - Walwound LIVE"),
  set("sunday", "mainstage", "18:30", "19:00", "15 Years of Radical Redemption LIVE", "SHB The One Man Army", ["Radical Redemption"]),
  set("sunday", "mainstage", "19:00", "20:30", "BIMBERIXX vs Revelation Ascension LIVE", undefined, ["BIMBERIXX", "Revelation"]),
  set("sunday", "mainstage", "20:30", "21:00", "Rebelion in Warface - Journey"),
  set("sunday", "mainstage", "21:00", "21:45", "Dual Damage pres. Built To Break LIVE"),
  set("sunday", "mainstage", "21:45", "22:30", "The Straikerz 777 LIVE"),
  set("sunday", "mainstage", "22:30", "23:00", "Paul Elstak"),
  set("sunday", "mainstage", "23:00", "23:45", "Endshow"),

  // Indoor Mainstage (Outsiders & Mandala Hosting)
  set("sunday", "indoor_mainstage", "13:00", "14:15", "Ransom vs Lunatixz"),
  set("sunday", "indoor_mainstage", "14:15", "15:00", "Lost Identity vs Primeshock"),
  set("sunday", "indoor_mainstage", "15:00", "16:00", "Daren van de Brouwener"),
  set("sunday", "indoor_mainstage", "16:00", "16:30", "Outsiders"),
  set("sunday", "indoor_mainstage", "16:30", "17:00", "Django Wagner"),
  set("sunday", "indoor_mainstage", "17:00", "17:30", "Mental Theo"),
  set("sunday", "indoor_mainstage", "17:30", "18:30", "Vivi Goro"),
  set("sunday", "indoor_mainstage", "18:30", "19:00", "Stuk"),
  set("sunday", "indoor_mainstage", "19:00", "20:00", "Outsiders vs Da Tweekaz"),
  set("sunday", "indoor_mainstage", "20:00", "20:30", "EZG LIVE"),
  set("sunday", "indoor_mainstage", "20:30", "21:30", "The Darkraver vs The Purge"),
  set("sunday", "indoor_mainstage", "21:30", "22:15", "Outsiders vs Korsakoff - Millennium"),

  // Dynamite
  set("sunday", "dynamite", "13:00", "14:00", "DJ Contest"),
  set("sunday", "dynamite", "14:00", "14:30", "Kemal"),
  set("sunday", "dynamite", "14:30", "15:30", "Aalst vs Dimma vs Udow"),
  set("sunday", "dynamite", "15:30", "16:30", "Pinotello"),
  set("sunday", "dynamite", "16:30", "17:00", "Mola"),
  set("sunday", "dynamite", "17:00", "18:00", "Noxiouz vs Complex vs Kili"),
  set("sunday", "dynamite", "18:00", "18:30", "Stuk"),
  set("sunday", "dynamite", "18:30", "19:30", "The Dark Horror vs Dimitri K vs Partyraiser"),
  set("sunday", "dynamite", "19:30", "20:30", "Noxiouz vs Radical Redemption"),
  set("sunday", "dynamite", "20:30", "21:30", "The Dark Horror vs Noxiouz vs Bombsquad"),

  // Fanaticz
  set("sunday", "fanaticz", "13:00", "13:45", "DJ Contest"),
  set("sunday", "fanaticz", "13:45", "14:30", "Disaster vs Unmute"),
  set("sunday", "fanaticz", "14:30", "15:15", "Harde Kwark"),
  set("sunday", "fanaticz", "15:15", "16:15", "LekkerFaces vs The Saints"),
  set("sunday", "fanaticz", "16:15", "17:15", "Fraw vs Mutilator"),
  set("sunday", "fanaticz", "17:15", "17:45", "Adjuzt vs Exproz"),
  set("sunday", "fanaticz", "17:45", "18:45", "Kruelty"),
  set("sunday", "fanaticz", "18:45", "19:30", "E-Force - A Symphony of Screams"),
  set("sunday", "fanaticz", "19:30", "20:30", "Regain - Polish Punisher 6 Album Showcase"),
  set("sunday", "fanaticz", "20:30", "21:00", "Infliction LIVE"),
  set("sunday", "fanaticz", "21:00", "21:45", "Coldax LIVE"),
  set("sunday", "fanaticz", "21:45", "22:45", "Dark Entities vs Element vs Vasto"),

  // Outrageous
  set("sunday", "outrageous", "13:00", "14:00", "EMS - The Hardstyle Family"),
  set("sunday", "outrageous", "14:00", "15:00", "Josh & Wesz"),
  set("sunday", "outrageous", "15:00", "16:00", "LekkerFaces vs The Saints"),
  set("sunday", "outrageous", "16:00", "16:45", "Frontliner"),
  set("sunday", "outrageous", "16:45", "17:30", "Atmozfears vs Code Black"),
  set("sunday", "outrageous", "17:30", "18:00", "Wildstylez"),
  set("sunday", "outrageous", "18:00", "19:00", "Rooler"),
  set("sunday", "outrageous", "19:00", "19:45", "E-Force vs Jones"),
  set("sunday", "outrageous", "19:45", "20:30", "Galaxxe - Album Showcase"),
  set("sunday", "outrageous", "20:30", "21:30", "Adaro vs B-Front vs Crypsis"),
  set("sunday", "outrageous", "21:30", "22:30", "Rotterfire"),

  // Revive / Energetic
  set("sunday", "revive", "13:00", "14:00", "Joeeu"),
  set("sunday", "revive", "14:00", "15:00", "Emas"),
  set("sunday", "revive", "15:00", "16:00", "Genius vs Nowax"),
  set("sunday", "revive", "16:00", "17:00", "Francois vs Genius vs Nowax vs Joeeu"),
  set("sunday", "revive", "17:00", "17:30", "Francois"),
  set("sunday", "revive", "17:30", "18:30", "Potato vs Playboyz"),
  set("sunday", "revive", "18:30", "19:30", "Dr. Rude vs Ruthless"),
  set("sunday", "revive", "19:30", "20:30", "Pat B"),
  set("sunday", "revive", "20:30", "21:30", "Panic vs The Viper"),

  // Karnaval
  set("sunday", "karnaval", "13:00", "15:00", "DJ Mats"),
  set("sunday", "karnaval", "15:00", "15:30", "Nolis Leeman"),
  set("sunday", "karnaval", "15:30", "16:00", "DJ Mats"),
  set("sunday", "karnaval", "16:00", "16:30", "Noud Noutze"),
  set("sunday", "karnaval", "16:30", "17:15", "Tommy Santo"),
  set("sunday", "karnaval", "17:15", "17:45", "Quido van de Graaf"),
  set("sunday", "karnaval", "17:45", "18:15", "Tommy Santo"),
  set("sunday", "karnaval", "18:15", "19:00", "Monique Smit"),
  set("sunday", "karnaval", "19:00", "19:30", "Eevine"),
  set("sunday", "karnaval", "19:30", "20:30", "Lamme Frans"),
  set("sunday", "karnaval", "20:30", "21:00", "Tommy Santo"),
  set("sunday", "karnaval", "21:00", "22:00", "Antics"),

  // Boombox
  set("sunday", "boombox", "13:00", "14:00", "Digital Madness"),
  set("sunday", "boombox", "14:00", "15:00", "Beat Conductors"),
  set("sunday", "boombox", "15:00", "16:00", "KIOR vs Acidz"),
  set("sunday", "boombox", "16:00", "17:00", "Oblivion"),
  set("sunday", "boombox", "17:00", "18:00", "Nocturnal"),
  set("sunday", "boombox", "18:00", "19:00", "More Kords"),
  set("sunday", "boombox", "19:00", "20:00", "Eevine"),
  set("sunday", "boombox", "20:00", "21:00", "Invocious vs Xplosiv"),
  set("sunday", "boombox", "21:00", "22:00", "Azdat vs Incult"),

  // Uiltje
  set("sunday", "uiltje", "13:00", "13:45", "Piolmi"),
  set("sunday", "uiltje", "13:45", "14:45", "Lieks"),
  set("sunday", "uiltje", "14:45", "15:30", "Boery"),
  set("sunday", "uiltje", "15:30", "16:30", "BLNK vs Chapter V"),
  set("sunday", "uiltje", "16:30", "17:30", "TITI"),
  set("sunday", "uiltje", "17:30", "18:30", "Blurred Movement vs Ramon"),
  set("sunday", "uiltje", "18:30", "19:30", "Drou vs Torsten"),
  set("sunday", "uiltje", "19:30", "20:30", "JoJySt"),
  set("sunday", "uiltje", "20:30", "21:30", "Krach Crow"),

  // Intentscity
  set("sunday", "intentscity", "11:45", "13:00", "The Speed Team"),
  set("sunday", "intentscity", "15:00", "16:00", "T.M.O. vs Bössels vs Eraized pres. Candy Shop LIVE"),
  set("sunday", "intentscity", "16:00", "17:00", "GPF vs Primate - Going Aprcht"),
  set("sunday", "intentscity", "17:00", "18:00", "Aalst vs Tob-E vs Undivided"),
  set("sunday", "intentscity", "18:00", "19:00", "Cyber Gunz"),
];

export const ALL_SETS: FestivalSet[] = [...friday, ...saturday, ...sunday];

// Unique list of artist names (for the picker).
export function uniqueArtists(sets: FestivalSet[] = ALL_SETS): string[] {
  const skip = new Set([
    "DJ Contest",
    "The Opening Ceremony",
    "Endshow",
  ]);
  const seen = new Map<string, string>(); // lowercase -> canonical
  for (const s of sets) {
    for (const a of s.artists) {
      if (skip.has(a)) continue;
      const key = a.toLowerCase();
      if (!seen.has(key)) seen.set(key, a);
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

export function spotifySearchUrl(artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(artist)}/artists`;
}
