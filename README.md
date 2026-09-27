# Country Defense

Lane-based 3D tower defense. Hold the border, protect the capital.

**Stack:** Three.js · TypeScript · Vite

## Run locally

```bash
cd /Users/rakeshroy/Documents/games/country-defense
npm install
npm run dev
```

Open the URL Vite prints (uncommon port, not 3000/5173/8080).

## Build

```bash
npm run build
```

Static output lands in `dist/`.

## Play

The full base fills the window. Tanks start immediately; a new wave launches every 14 seconds.

1. Choose **Cannon** (cheap, short range) or **Flak** (pricier, longer range).
2. Click grass — not the road — to place a tower.
3. Click a placed tower to upgrade it.
4. Leak too many tanks and the capital falls. Esc or P pauses.

## Scripts

| Command        | What it does        |
| -------------- | ------------------- |
| `npm run dev`  | Dev server          |
| `npm run build`| Typecheck + bundle  |
| `npm run preview` | Serve `dist/`    |
