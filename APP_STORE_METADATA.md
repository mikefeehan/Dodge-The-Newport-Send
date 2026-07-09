# App Store Connect — Ready-to-Paste Metadata

Everything below is filled in and within Apple's character limits. Copy each field
straight into App Store Connect. (Same fields work for Google Play, except where noted.)

---

## App information

**App Name** (≤30 chars) — *currently 25*
```
Dodge Mike's Newport Send
```

**Subtitle** (≤30 chars) — *currently 26*
```
Neon Newport arcade dodger
```

**Promotional Text** (≤170 chars) — editable anytime without review
```
Survive the Send! Dodge falling neon signs, grab power-ups, and chain near-miss combos across 10 glowing Newport-inspired districts. Quick runs, big scores.
```

**Keywords** (≤100 chars, comma-separated, NO spaces) — *currently 89*
```
arcade,neon,dodge,runner,newport,synthwave,retro,casual,score,combo,run,party,beach,reflex
```

**Description** (≤4000 chars)
```
Dodge Mike's Newport Send is a fast neon arcade dodging game inspired by Newport Beach nightlife.

You play as Mike, weaving through falling glowing signs across 10 themed districts. Each level gives you 3 lives and 30 seconds to clear the timer. When you advance, your score carries forward and your lives reset for the next level. Skim past danger to build near-miss combos and stack a bigger score multiplier.

FEATURES
- 10 Newport-inspired neon districts, each with its own look and rising difficulty
- Fast, simple one-finger arcade dodging
- 7 power-ups: Slow, Shield, VIP Clear, 2x Score, Extra Life, Ghost, and Magnet
- Coin chains to grab for quick points and combo fuel
- Boss showdowns at levels 5 and 10 — dodge aimed shots and slamming signs
- Evolving hazards: drifting, splitting, express, weaving, and homing signs
- Near-miss combo scoring for huge points
- Drag to steer, or use keyboard/mouse on desktop
- Game Center leaderboard — compete for the top Send score
- Local Top-5 leaderboard, saved on your device
- Haptic feedback and an epic victory celebration
- Synthwave neon visuals and party arcade energy
- No account required. Plays offline.

Simple to learn. Hard to survive. Built for quick runs, big scores, and maximum Send energy.
```

**What's New** (version 2.0 release notes, ≤4000 chars) — paste into the "What's New in This Version" field
```
Version 2.0 — the biggest Send yet!

- BOSS SHOWDOWNS: survive THE BOUNCER at level 5 and LAST CALL at level 10 — they track you, fire shot-fans, and slam signs.
- COIN CHAINS: grab falling coins for quick points and combo fuel.
- TWO NEW POWER-UPS: Ghost (phase through danger) and Magnet (vacuum up loot).
- NEW HAZARDS: signs now split in two, and later districts throw signs that home in on you.
- DEEPER LOOK: 2.5D depth, parallax backdrops, and a combo heat-glow as your streak climbs.
- Plus a district-clear bonus and richer end-of-run stats.

Thanks for playing — chase that high score!
```

---

## URLs (live once GitHub Pages rebuilds — ~1 min after push)

| Field | URL |
|-------|-----|
| **Marketing URL** | https://mikefeehan.github.io/Dodge-The-Newport-Send/ |
| **Support URL** | https://mikefeehan.github.io/Dodge-The-Newport-Send/support.html |
| **Privacy Policy URL** | https://mikefeehan.github.io/Dodge-The-Newport-Send/privacy.html |

---

## Category
- **Primary:** Games → Casual
- **Secondary:** Games → Arcade

---

## Age Rating (questionnaire answers)
Answer these in App Store Connect → most map to **12+** for the App-Store-safe build:

| Question | Answer |
|----------|--------|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Sexual Content or Nudity | None |
| Profanity or Crude Humor | None |
| **Alcohol, Tobacco, or Drug Use or References** | **Infrequent/Mild** (nightlife/bar theme, cocktail in icon) |
| Mature/Suggestive Themes | None |
| Horror/Fear Themes | None |
| Gambling | None |
| Contests | None |
| Unrestricted Web Access | No |
| **Result** | **12+** |

> The signs use a curated list of real Newport venue names (no person names). The alcohol/nightlife theme keeps this at **12+**.

---

## App Privacy ("nutrition label") — updated for v1.1 (Game Center)
Local data (high scores, initials, mute setting, best-run stats) stays **on-device** — that part
is unchanged: no analytics, no ads, no tracking, no location, no contacts/photos/health/payment data.

**But v1.1 adds Game Center**, which submits run scores to Apple when the player is signed in, so
"Data Not Collected" is no longer accurate. In App Store Connect → App Privacy declare:

| Data type | Collected? | Linked to identity | Tracking | Purpose |
|-----------|-----------|--------------------|----------|---------|
| Identifiers → User ID (Game Center player) | Yes | Yes (to the Game Center account) | No | App Functionality |
| Usage Data → Product Interaction (submitted scores) | Yes | Yes (leaderboard entries) | No | App Functionality |

Everything else: **Not collected.** Note in the optional text that Game Center is optional and
handled by Apple; the developer runs no servers.

---

## Build & compliance answers
| Question | Answer |
|----------|--------|
| Export Compliance — uses encryption? | **No** (only standard HTTPS) → exempt |
| Sign in with Apple required? | **No** (no third-party login at all) |
| Made for Kids category? | **No** (general audience) |
| Third-party content rights (music)? | **Yes** — soundtrack used with the artist's permission. Keep the written OK on file. |
| In-app purchases / ads? | **None** |
| Copyright | © 2026 Mike Feehan |

---

## Screenshots
- Required: **iPhone 6.7"** at **2796 × 1290** (landscape) — provided in `/screenshots`.
- iPad screenshots only needed if you enable iPad support (you can ship iPhone-only).
- Suggested captions (per screenshot):
  1. Run the Newport Send
  2. Dodge 10 neon districts
  3. Grab power-ups
  4. Chain near-miss combos
  5. Chase the high score

---

## Note on names
The falling signs use a curated list of real Newport Beach venue names (the `BARS` array in
`index.html`). No person names are used, which removes the biggest rejection risk. Real trademarks
carry a small residual risk; if Apple ever objects to a specific name, it's a one-line edit.
