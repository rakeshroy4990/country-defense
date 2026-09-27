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

1. Start the game from the title screen.
2. Choose **Cannon** (cheap, short range) or **Flak** (pricier, longer range).
3. Click grass — not the road — to place a tower.
4. Click a placed tower to upgrade it.
5. Enemies walk the border-to-capital path. Leak too many and the capital falls.

## Scripts

| Command        | What it does        |
| -------------- | ------------------- |
| `npm run dev`  | Dev server          |
| `npm run build`| Typecheck + bundle  |
| `npm run preview` | Serve `dist/`    |
