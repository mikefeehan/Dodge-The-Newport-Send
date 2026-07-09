# 🌃 Dodge Mike's Newport Send

A neon arcade dodger. Pilot **Mike** through **10 Newport districts**, weave past falling
bar signs, snag coin chains, grab power-ups, survive district bosses, and skim past danger
for **near-miss combos**. The whole game is **one HTML file** — no framework, no build step;
a thin Capacitor wrapper (`ios/`) ships it as the iOS App Store app.

🎮 **Play it:** https://mikefeehan.github.io/Dodge-The-Newport-Send/
📱 **App Store:** Dodge Mike's Newport Send (iOS)

## ✨ Features

**Core game**
- **10 hand-themed Newport districts**, each with its own neon palette, photo backdrop, and rising difficulty.
- **30-second levels** with **3 lives** each; your **score carries** across the entire run.
- Two ways to play — pick **Horizontal** or **Vertical** on the start screen and the whole field reshapes to fit.
- **Near-miss combos**: skim a sign without touching it to build a **combo multiplier** (up to ×5) that boosts everything.
- **District-clear bonus** every time you beat the timer.
- **Victory celebration** — fireworks, confetti, gold rays, and a score count-up after all 10 districts.

**Obstacles that evolve** (see the [full table](#-obstacle-types))
- Straight droppers, **drifters**, **weavers**, fast **express** signs (with ⚡ telegraph), **splitters** that crack in two, and **seekers** that home in on you.

**Loot & power-ups** (see the [full table](#power-ups))
- **7 power-ups**: SLOW, SHIELD, VIP, 2×, +1 Life, **GHOST** (phase through everything), and **MAGNET** (vacuum up loot).
- **Coin chains** — 3–6 coins in a line or sine-snake for quick points and combo fuel.

**Boss showdowns**
- **THE BOUNCER** (level 5) and **LAST CALL** (level 10) arrive for the final stretch: they hover, track you, fire aimed 3-shot fans, and slam telegraphed express signs. Survive the clock to clear them.

**Look & feel**
- **2.5D depth**: signs scale up from the horizon, backdrops parallax-sway opposite your movement, and a combo "heat" glow builds at the screen edges.
- Procedural synthwave fallback (banded sun + parallax skyline) for any level whose photo hasn't loaded.
- Full-body **run animation**, motion-blur trail, screen shake, particle bursts, floating score text, and a cinematic vignette.
- Original **soundtrack** + a full **WebAudio sound-effects** engine (pickups, hits, near-misses, level-ups, victory).

**Quality of life**
- **Local Top-5 leaderboard** with initials, plus lifetime-runs and furthest-district tracking.
- **Pause** (with a 3-2-1 resume countdown), **mute**, auto-pause on tab/app switch, and a **rotate** prompt when your phone orientation doesn't match the chosen mode.
- **Share** your score via the native share sheet (or clipboard fallback).

**iOS-native extras** (feature-detected; the web build simply skips them)
- **Haptics**, **Game Center** leaderboard, a one-time **rate-the-app** prompt, and a **screen wake lock** during play.

## Files
- `index.html` — the entire game (graphics, audio, logic — all inline)
- `player.png` / `player2.png` — Mike's two-frame run animation
- `bg/1.jpg … 10.jpg` — per-district background art
- `niiko_x_swae.mp3` — the soundtrack (must sit next to `index.html`)
- `ios/` + `capacitor.config.json` + `codemagic.yaml` — iOS app wrapper and cloud build
- `scripts/smoke-test.js` — headless Playwright smoke test (runs in GitHub Actions)

## How to play
- **Survive 10 levels**, 30 seconds each. Score **carries** across levels.
- Each level starts with **3 lives**. A hit costs a life and gives you a moment of invulnerability.
- The rare **+1 life** power-up can boost you up to **5 lives** during that level.
- Clear the timer to advance to the next district and reset back to **3 lives** (plus a **district-clear bonus**).
- **Skim past signs** without touching them to rack up a **combo multiplier**. Grab **coin chains** for quick points.
- From level 3, signs **drift**; level 4, some **split in two** as they fall; level 5, **express signs**
  drop fast (flashing ⚡ warning); level 6, **weaver signs** snake side-to-side; level 7, **seeker signs**
  home in on your column.
- **Boss showdowns** close out levels **5** (THE BOUNCER) and **10** (LAST CALL): they track you, fire
  aimed shot-fans, and slam express signs. Survive the level clock to clear them.
- Beat all 10 districts for the full **victory celebration**. 🎆

### Controls
| Platform | Steer | Other |
|----------|-------|-------|
| **Desktop** | Arrow keys / **WASD**, or just **move the mouse** | **P** = pause · **M** = mute |
| **Mobile** | **Drag** anywhere to steer | on-screen pause / mute buttons |

> On the start screen, pick **Horizontal** or **Vertical** — each mode gets its own
> field shape. Music starts on that first tap.

## 🪧 Obstacle types
Bar signs are the danger. New behaviors unlock as you climb the districts:

| Sign | From | Behavior |
|------|------|----------|
| **Straight** | Level 1 | Drops straight down. |
| **Drifter** | Level 3 | Slides sideways, bouncing off the walls as it falls. |
| **Splitter** | Level 4 | Cracks into two half-signs partway down that peel left and right. |
| **Express** | Level 5 | Drops **fast** after a flashing ⚡ telegraph at the top. |
| **Weaver** | Level 6 | Snakes side-to-side in a sine wave on the way down. |
| **Seeker** | Level 7 | Pulses angrily and **homes in on your column**. |

## Power-ups
| | Name | Effect |
|---|------|--------|
| 🩵 | **SLOW** | Slows everything down (~5s) |
| 💚 | **SHIELD** | Absorbs one hit (~8s) |
| 💛 | **VIP** | Instantly clears every sign on screen |
| 💜 | **2×** | Doubles your score (~7s) |
| ❤️ | **+1** | Extra life for the current level (rare) |
| 💟 | **GHOST** | Phase straight through signs & boss shots (~5s) |
| 🧲 | **MAGNET** | Pulls in nearby coins and power-ups (~8s) |

## 👑 Bosses
Two districts end with a showdown instead of just a timer:

| Boss | District | Fight |
|------|----------|-------|
| **THE BOUNCER** | Level 5 · Newport Heights | Arrives for the final ~12s. Hovers up top, eases toward your column, fires aimed 3-shot fans, and slams telegraphed express signs. |
| **LAST CALL** | Level 10 · Sunset Send | Same playbook, faster and meaner — the last thing between you and the victory celebration. |

Regular signs thin out while a boss is on screen. **Survive the level clock** to clear it and bank the win (tracked in your run stats). **GHOST** phases you through boss shots.

## Scoring & leaderboards
- Score builds continuously, scaled by your **level** and **combo multiplier** (up to ×5).
- **Near-misses**, **coins**, and power-ups grow your combo; getting hit resets it.
- **Coins** (+5 × multiplier) and **near-misses** (+12 × multiplier) pay out instantly; clearing a district pays a **level bonus**.
- Game Over shows your full run stats — score, best, levels cleared, best combo, coins grabbed, near misses, bosses beaten, time survived, and district reached.
- Save your initials to the local **Top-5 leaderboard**.
- On iOS, scores also post to the **Game Center leaderboard** when you're signed in.
- The start screen tracks your **lifetime runs** and **furthest district**.

## iOS app extras
The Capacitor wrapper adds **haptic feedback**, **Game Center**, a one-time **rate-the-app
prompt**, and a **screen wake lock** during play. All of it is feature-detected — the web
build simply skips it.

## The 10 districts
The Peninsula · Balboa Pier · Cannery Village · Lido Marina · Newport Heights · Corona del Mar ·
Fashion Island · Back Bay · The Wedge · Sunset Send — each with its own neon palette and rising difficulty.

## Run it locally
It's a static page, so any web server works (audio needs `http://`, not `file://`):
```bash
python -m http.server 8000
# then open http://localhost:8000
```

## Test
```bash
npm install --no-save playwright && npx playwright install chromium
node scripts/smoke-test.js
```
The same test runs in GitHub Actions on every PR and push to `main`.

## Build the iOS app
See `IOS_BUILD_GUIDE.md` (Codemagic cloud build — no Mac needed) and `GAME_CENTER_SETUP.md`
for the one-time App Store Connect leaderboard setup.

## Publish on GitHub Pages
Pages serves the repo root from `main` — merging to `main` **is** the web deploy.

---
*Dev note: `window.__DODGE__` exposes a small debug handle (state + manual step/draw) for tinkering
in the console; the smoke test drives the game through it.*
