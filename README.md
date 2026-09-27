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

Five levels of named attackers (Starscream → Megatron). Kingdom hits are listed in the damage log.

1. Choose **AK-47** or **Apache Helicopter** and click grass to build. Early levels crawl; later levels speed up.
2. Click a placed tower to upgrade it.
3. If an attacker reaches the capital, the log records their name and damage. Esc or P pauses.

## Scripts

| Command        | What it does        |
| -------------- | ------------------- |
| `npm run dev`  | Dev server          |
| `npm run build`| Typecheck + bundle  |
| `npm run preview` | Serve `dist/`    |
