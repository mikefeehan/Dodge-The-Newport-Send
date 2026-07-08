# Repository Audit — Dodge-The-Newport-Send

*Audit date: 2026-07-07. Method: read-only review — ran the game headlessly (Playwright/Chromium),
`npm audit`, `npm ci`/`npm run build`, and full git-history analysis. No code was modified as part
of the audit.*

---

## Executive Summary

**Grade: B−** — a healthy, shipped hobby game with clean runtime behavior and a working cloud
build pipeline, dragged down by listing/compliance drift that poses a real risk to the imminent
v1.1 App Store submission, one advertised feature that doesn't exist, and zero automated safety
net in front of a repo that deploys to production on every merge to `main`.

**Top 3 risks**
1. **App Review rejection for v1.1** — the repo's own review notes and privacy policy say "no
   online leaderboard" and "data never leaves the device," while v1.1's headline feature is a
   Game Center leaderboard (F1).
2. **The App Store listing advertises tilt controls that do not exist** — tilt input is dead code;
   the values are read by nothing (F2).
3. **No automated checks anywhere** — merging to `main` deploys the web game to GitHub Pages
   instantly with no smoke test, and the iOS build is only validated when a human runs Codemagic (F5).

**Top 3 opportunities**
1. A one-file docs/compliance sweep (an hour of work) removes the biggest launch risk.
2. Committing the Playwright smoke harness already proven during v1.1 QA gives CI for near-zero cost.
3. Re-encoding the 22 MB soundtrack (~4 MB AAC) cuts the web version's biggest load-time cost and
   the repo's clone weight by ~70%.

---

## Phase 1 — Repo Map

**Purpose.** "Dodge Mike's Newport Send" — a neon arcade dodger (dodge falling bar-sign obstacles
across 10 timed levels). Live in two channels: free web build on GitHub Pages served from repo
root, and an iOS app (App Store ID 6777284091) via a Capacitor 8 wrapper. v1.0 shipped; v1.1
merged to `main` 2026-07-07, awaiting Codemagic build + ASC submission.

**Stack.**
- **Game:** one self-contained file — `index.html` (1,048 lines: CSS + DOM + a single IIFE of
  vanilla JS, canvas 2D renderer, WebAudio SFX, `<audio>` music). No framework, no build step for the web.
- **iOS wrapper:** Capacitor 8 (SPM, no CocoaPods) in `ios/`; one npm plugin (`@capacitor/haptics`)
  plus two local Swift plugins (`GameCenterPlugin.swift`, `AppReviewPlugin.swift`) registered via
  `MainViewController.swift`.
- **Build/CI:** `scripts/build-web.js` copies assets to `www/`; `codemagic.yaml` defines a
  manual-trigger cloud Mac build → sign → upload to App Store Connect. **No GitHub Actions.**

**Data flow.** Input (keys/mouse/touch) → `step()` physics/collision → `render()` canvas → HUD DOM.
Persistence is `localStorage` (best score, top-5 board, mute, runs, furthest level) plus, as of
v1.1, score submission to Apple Game Center.

**Maturity & history.** Solo project: 62 commits by mikefeehan + 5 by Claude, in three bursts
(2026-06-05 mass build-out, 06-09 content fix, 07-02 v1.1). Churn is where you'd expect:
`index.html` (43 touches), `codemagic.yaml` (9 — CI bring-up, since stabilized). Bus factor is 1,
which is normal here and not treated as a finding.

**Surprises.** ① Repo doubles as the production CDN (Pages serves repo root) — so a 22 MB MP3,
7 MB of screenshots, and 2.7 MB of icons ride along in every clone *and* the deployment.
② Bundle-ID history (`bet2sweat` → `sailwestcapital`) explains the odd support email. ③ Docs
culture is unusually good for a hobby repo (9 markdown guides), which makes their current
staleness more misleading, not less.

---

## Phase 2 — Audit Report

### Compliance / listing accuracy

**F1 — Privacy policy and App Review notes contradict the v1.1 Game Center feature.
Severity: High · Verified.**
`APP_REVIEW_NOTES.md:25` ("The current version does not use an online leaderboard"),
`PRIVACY_POLICY.md:13` ("It is not sent to the developer by the game") and `PRIVACY_POLICY.md:33`
(all data local) predate Game Center. v1.1 submits every run's score to Apple's servers
(`index.html:359` `gcSubmit`, `ios/App/App/GameCenterPlugin.swift:12`). Consequence:
reviewer-visible metadata mismatch → rejection risk, and the ASC privacy nutrition labels are now
inaccurate. This drift was introduced by the v1.1 work — the code moved and the compliance docs
didn't. Must be fixed **before** submitting 1.1.

**F2 — Tilt controls are advertised but 100% dead. Severity: High · Verified.**
`APP_STORE_METADATA.md:41` ("Drag to steer, tilt the phone…") and `README.md:26,28` advertise
tilt. In code: `tiltX/tiltY/tiltActive/baseX/baseY` are written (`index.html:465,472`) and **read
by nothing** — the movement code in `step()` only consults pointer and keyboard; `askMotion()`
(`index.html:466`) is never called; `ios/App/App/Info.plist` has no `NSMotionUsageDescription`.
Git explains it: commit `7ee93e4` "drop tilt" removed the input path but left the listeners, the
permission helper, and every doc claim. Consequence: App Store listing describes a nonexistent
feature (Apple guideline 2.3.1 territory) and confuses players. Fix is a choice: delete the ~10
dead lines + scrub docs (S), or actually re-implement tilt (M).

### Testing

**F5 — Zero automated tests; production deploys on merge. Severity: High (combined) · Verified.**
No test files, no linter config, no GitHub Actions. Merging to `main` *is* the web deployment
(Pages serves root), so merges go to production validated only by ad-hoc manual/headless runs
that live outside the repo. The game already exposes a purpose-built test handle
(`window.__DODGE__`, `index.html:1041`), so the hard part is done. Proportionate fix: commit one
Playwright smoke script + a ~20-line Actions workflow (boot, play 60 simulated seconds, force
win/lose, assert zero page errors).

### Performance

**F3 — 22 MB MP3 streamed to every web player. Severity: Medium · Verified.**
`niiko_x_swae.mp3` is 22 MB, loaded by `index.html:248` on first tap (`preload="none"` correctly
defers it). On cellular that's a long silent wait after pressing Play, and it's ~70% of clone
weight. A 128 kbps re-encode (~4–5 MB) is transparent for game audio. The iOS app is unaffected
(bundled locally).

**F4 — Canvas ignores devicePixelRatio → blurry on every retina screen. Severity: Medium · Verified.**
`fitScreen()` sizes the backing store in CSS pixels (`index.html:1011`: `c.width=VW`) and
stretches it to the full viewport. On a 3× iPhone the game renders at ⅓ resolution and upscales —
text-heavy obstacles (bar names) visibly soften. Fix: scale backing store by
`min(devicePixelRatio, 2)` and `ctx.scale()` accordingly; cap at 2 to bound fill cost (interacts
with F6).

**F6 — `shadowBlur` on nearly every draw call. Severity: Low · Likely.**
16 `shadowBlur` sites in the hot render path (`index.html:838,859,866,877,893` et al.) — canvas
shadows are among the slowest 2D operations, multiplied per obstacle/pickup/particle per frame.
No device profiling was done (hence *Likely*), and current entity counts are modest; but this is
the first suspect if older iPhones jank, and it compounds with any F4 fix. Cheap mitigation:
pre-render glowing sign plates to offscreen canvases keyed by color.

### Code quality

**F7 — `index.html` is a 1,048-line god file — accepted, with a caveat. Severity: Low · Verified.**
The single-file design is a stated feature (`README.md:4-5`) and right for this project's
culture; do not split it into modules. The caveat: it has no lint/format gate, and dead code is
accruing unnoticed — the tilt block (F2) and the unused `dz()` helper (`index.html:~294`, zero
call sites). One lint pass or periodic dead-code sweep is enough.

**F8 — Stored initials rendered via string-built `innerHTML`. Severity: Low · Verified.**
`index.html:937` interpolates leaderboard names into HTML. Input is capped at 3 chars
(`maxlength`, `.slice(0,3)`), so the worst case is a self-inflicted `<i>`/`<b>` tag from your own
localStorage — cosmetic, same-origin, no real exploit path. Hygiene fix: build `<li>` via
`textContent`.

**F9 — iOS ignores `bgm.volume`, so all music fades are no-ops in the app.
Severity: Low · Verified (code) / Likely (device).**
`fadeTo()` (`index.html:~427`) animates `bgm.volume`, which iOS's media element treats as
read-only; music will hard-start/hard-stop in the app instead of fading. Harmless, purely polish;
a WebAudio `GainNode` routing would fix it if it ever bothers anyone.

### Dependencies / security

Healthy: `npm audit` reports **0 vulnerabilities** across the 3 production deps (Verified); no
secrets in the repo — Codemagic signing uses named integrations and a secure env group
(`codemagic.yaml:19-22`, Verified); the game makes zero network calls of its own — no
fetch/XHR/analytics/trackers (grep-verified), so the "no tracking" privacy claims are true
*except* for F1's Game Center gap.

**F10 — Codemagic build-number fallback can regress to 1. Severity: Low · Likely.**
`codemagic.yaml:52`: if `get-latest-testflight-build-number` hiccups, the
`|| agvtool new-version -all 1` fallback stamps build **1**, which ASC will reject as a duplicate
(confusing failure, minutes lost, no data risk).

### Docs

**F11 — README and checklist drifted from the shipped game. Severity: Low · Verified.**
`README.md:4-5` "One single HTML file — no build step, no dependencies" (there's now an `ios/`
tree, npm deps, and a build script); `README.md:28` "Tap Play" (there are two orientation
buttons, `index.html:194-196`); no mention of v1.1 features; `LAUNCH_CHECKLIST.md:79-81` still
lists haptics and the start countdown as future upgrades. `CODE_FIX_NOTES.md` is a stale one-off
dev note. Cost: misleads contributors and future-you; the README is also user-facing marketing
for the web build.

**F12 — Version identifiers disagree. Severity: Low · Verified.**
`package.json:4` says `1.0.0`; the Xcode project says `MARKETING_VERSION = 1.1`
(`project.pbxproj:306,328`). Nothing consumes the npm version today, but it's a booby trap for
any future tooling.

### Strengths (preserve these)

- **The single-file, zero-dependency game** is genuinely portable and debuggable; the `__DODGE__`
  debug handle (`index.html:1041`) is a quietly excellent testing affordance.
- **Feature-detected native bridges done right**: haptics, Game Center, review prompt, and wake
  lock all no-op cleanly on web (`index.html:322,349,364,380`) — one codebase, two channels, no forks.
- **Local Swift plugins over npm plugin roulette** (`GameCenterPlugin.swift`) — the right call for
  Capacitor 8 SPM, and only ~70 lines.
- **Clean ops hygiene**: correct `.gitignore` (generated `www/`, `public/` excluded), lockfile
  committed, secrets externalized, clear commit messages.
- **Docs culture exists** — the fix for F1/F11 is updating files that already exist, not creating
  a practice from scratch.

*Review depth note:* `index.html` and the iOS wrapper got deep review; `bg/`, `icons/`,
`screenshots/` binaries and the marketing copy in `APP_STORE_LISTING.md`/`APP_STORE_COPY_SAFE.md`
got a lighter pass.

---

## Phase 3 — Strategy

**Theme 1: Truth in listing (F1, F2, F11, F12).** Everything Apple, players, or contributors read
must match the shipped binary. *Principle: docs are release artifacts — they change in the same
PR as the feature.* Done when: review notes/privacy policy mention Game Center; no doc claims
tilt (or tilt works); README matches the game; one version number of record.

**Theme 2: A proportionate safety net (F5, F10).** Not enterprise CI — one smoke test that would
catch a blank-screen regression before Pages serves it. *Principle: if merge = deploy, merge must
run something.* Done when: a committed Playwright script runs in GitHub Actions on PRs and
`main`, asserting boot + 60s play + win/lose paths with zero page errors; Codemagic fallback
fails loudly instead of stamping build 1.

**Theme 3: Web-channel weight and sharpness (F3, F4, F6, plus the 1.6 MB splash icon at
`index.html:246`).** The App Store build hides these costs; the free web funnel pays them on
every visit. *Principle: the web version is the demo — first impression is load time and
crispness.* Done when: audio ≤ 5 MB, splash image ≤ 200 KB, canvas is DPR-aware, and frame time
is verified on a mid-tier phone.

**Theme 4: Controlled dead-code burn-down (F2 code, F7, F8, F9).** One small sweep, not a
refactor. *Principle: delete what git can resurrect.* Done when: no unreferenced symbols in
`index.html`.

**Explicit non-goals:** splitting `index.html` into modules or adopting a framework/bundler (the
single file is the architecture, and it's working); TypeScript migration; online backend
leaderboard (Game Center covers it); unit-test coverage targets (a behavior smoke test beats
mocked unit tests here); Android support (nothing in the repo signals intent).

---

## Phase 4 — Task Plan

### Milestone 0 — Safety net
| ID | Task | Findings | Effort | Risk |
|---|---|---|---|---|
| T1 | Commit Playwright smoke test + GitHub Action (boot, 60s AI play, forced win & loss, assert no page errors; run on PR + main) | F5 | **M** | Low |
| T2 | Make Codemagic build-number step fail loudly: drop `\|\| agvtool new-version -all 1`, or gate on non-empty result | F10 | **S** | Low |

### Milestone 1 — Critical before v1.1 submission *(all quick wins)*
| ID | Task | Findings | Effort | Risk |
|---|---|---|---|---|
| T3 | Compliance sweep: update `PRIVACY_POLICY.md`, `APP_REVIEW_NOTES.md`, `privacy.html` for Game Center; update ASC privacy labels (manual step — document it in `GAME_CENTER_SETUP.md`) | F1 | **S** | None |
| T4 | Decide tilt: **(a)** delete dead tilt code + scrub tilt from `APP_STORE_METADATA.md`/`README.md`, or **(b)** implement tilt (wire `tiltX/tiltY` into `step()`, call `askMotion()` on Play tap, add `NSMotionUsageDescription`). Recommend (a) for 1.1, (b) later if wanted | F2 | S / M | Low / Med |

### Milestone 2 — High-leverage (web channel)
| ID | Task | Findings | Effort | Risk | Depends |
|---|---|---|---|---|---|
| T5 | Re-encode soundtrack to ~128 kbps (~4–5 MB); serve a ≤200 KB splash image variant | F3 | **S** | Low (verify license permits re-encode) | — |
| T6 | DPR-aware canvas (cap 2×), then profile on device; if jank, pre-render sign glows to offscreen canvases | F4, F6 | **M** | Med (perf regression — needs T1 + manual device check) | T1 |

### Milestone 3 — Polish
| ID | Task | Findings | Effort |
|---|---|---|---|
| T7 | README refresh (v1.1 features, real file list, two-button start) + delete `CODE_FIX_NOTES.md`, prune `LAUNCH_CHECKLIST.md` done-items | F11 | **S** |
| T8 | Dead-code sweep (`dz`, tilt leftovers if T4a) + `textContent` leaderboard rendering + sync `package.json` version to 1.1 | F7, F8, F12 | **S** |
| T9 | (Optional) WebAudio gain node for real music fades on iOS | F9 | **M** |

### Top-3 task sketches

- **T3 (do first, ~1 hr):** Privacy policy gains a "Game Center" section: scores + Game Center
  player ID go to Apple when signed in, governed by Apple's privacy policy; opt-out = don't sign
  in. Review notes: replace "no online leaderboard" with "Game Center leaderboard
  `newport_send_high_score`; local board still works signed-out." ASC: privacy labels add
  *Identifiers → Game Center* / *Usage Data → product interaction (Apple)* per current Apple guidance.
- **T1 (~half day):** Port the proven QA harness: static server + `__DODGE__` drive; assertions:
  intro renders, 3,600 stepped frames error-free, forced loss shows GAME OVER, forced win plays
  cinematic → card shows 10/10; artifacts: screenshots on failure. Workflow: `actions/setup-node`
  + Playwright container, <2 min runtime.
- **T4a (~1 hr):** Delete the tilt block (`index.html:465-472`) + `askMotion`; scrub "tilt" from
  `README.md:26,28` and `APP_STORE_METADATA.md:41`; `grep -i tilt` should return only the
  rotate-prompt copy.

---

## Open Questions for a Human

1. **Music rights:** `IOS_BUILD_GUIDE.md:66` says keep niiko x swae's written permission "handy" —
   does that license cover App Store distribution *and* re-encoding (T5)?
2. **Tilt:** delete or implement? The listing currently promises it (T4 decision).
3. **Support email:** `support@bet2sweat.com` (`PRIVACY_POLICY.md:43`) — leftover from the
   previous app's branding. Intentional, or should it move to a sailwestcapital/game-specific address?
4. **Is the web build a funnel you care about?** Milestone 2's value depends on it; if iOS-only
   matters, demote T5/T6.
5. **Screenshots in-repo (7 MB):** fine as the system of record, or move to ASC-only and slim the
   repo/Pages deploy?
