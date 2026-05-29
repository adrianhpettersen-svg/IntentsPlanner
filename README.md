# Intents Festival 2026 — Planner

Pick your favorite artists and get an optimal route through Intents Festival 2026 (5–7 June, Oisterwijk, Netherlands).

## Hva den gjør

- Velg artister fra hele lineupen (alle 10 scener, 3 dager, ~285 artister)
- Rangér valgene dine — øverst = høyest prioritet
- Generer optimal rute: når to favoritter spiller samtidig, vinner den med høyest prioritet
- Vis pauser mellom sett og advarsel når du må sprinte til en annen scene
- Slå opp en hvilken som helst artist på Spotify
- Norsk/Engelsk språkbryter

## Kjøring lokalt

```bash
npm install
npm run dev
```

Åpne http://localhost:3000 (eller 3001 hvis 3000 er opptatt).

## Spotify-integrasjon (valgfritt men anbefalt)

For at "Play on Spotify" skal lande på artistens **ekte profilside** (ikke bare et søkeresultat),
sett opp en gratis Spotify Developer-app:

1. Gå til https://developer.spotify.com/dashboard
2. Logg inn med din vanlige Spotify-konto (free eller premium fungerer)
3. Klikk "Create app" → navn: "Intents Planner" (eller hva du vil)
4. Redirect URI: `http://localhost:3000` (kreves men ikke i bruk)
5. Lagre, åpne appen, gå til "Settings" → kopier Client ID og Client Secret
6. Kopier `.env.local.example` til `.env.local` og lim inn nøklene
7. Restart `npm run dev`

På Vercel: legg inn de samme to variablene under Project Settings → Environment Variables.

Uten nøkler faller appen tilbake til Spotify-søk — fungerer fortsatt, men treffer ikke alltid den riktige artisten.

## Deploy til Vercel

```bash
npm i -g vercel    # hvis du ikke har CLI fra før
vercel             # følg promptene
vercel --prod      # når du er fornøyd
```

Ingen miljøvariabler kreves.

## Stuktur

- `data/schedule.ts` — hele lineupen som strukturert data. **Hvis du finner en feil i timetable, rett det her** — UI plukker det opp automatisk.
- `lib/optimizer.ts` — algoritmen som løser konflikter ut fra prioritetsrekkefølge.
- `lib/i18n.ts` — alle strenger på NO + EN.
- `app/page.tsx` — UI (klient-komponent med React state + localStorage-persistens).

## Forbehold

Tidsplanen er hentet manuelt fra de offisielle IF26 timetables (bildene i mappen). Sjekk mot intentsfestival.nl før festivalen i tilfelle endringer.
