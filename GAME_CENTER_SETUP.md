# Game Center Setup (one-time, in App Store Connect)

The app code is ready: it signs the player in on launch, submits every run's final
score, and shows the native leaderboard from the 🏆 buttons (start screen + game
over). What the code can't do is create the leaderboard itself — that's a one-time
setup in App Store Connect. Until it's done, score submissions silently no-op and
the 🏆 buttons stay hidden for players who aren't signed in.

## 1. Create the leaderboard

1. App Store Connect → **Apps → Dodge Mike's Newport Send → Services → Game Center**
   (on newer ASC layouts it's the **Game Center** item in the app sidebar).
2. Under **Leaderboards**, click **+** and choose **Classic (Single) Leaderboard**.
3. Fill in:
   - **Reference name:** `Newport Send High Score` (internal only)
   - **Leaderboard ID:** `newport_send_high_score`  ← must match `GC_LEADERBOARD` in `index.html` exactly
   - **Score format type:** Integer
   - **Sort order:** High to Low
   - **Score range:** leave blank (or 0 – 10,000,000)
4. Add at least one **localization** (English): display name e.g. `High Score`,
   score format `100,000`, no suffix.

## 2. Attach Game Center to the next version

On the **version page** for 1.1 (the same page where you fill in "What's New"),
scroll to the **Game Center** section, enable it, and add the
`newport_send_high_score` leaderboard to the version. Submit the version as usual.

## 3. Update the App Privacy labels (required for 1.1)

Game Center submits scores to Apple, so the old "Data Not Collected" label is no longer accurate.
App Store Connect → **App Privacy** → declare **Identifiers → User ID** and **Usage Data →
Product Interaction**, both *linked to identity*, *not used for tracking*, purpose *App
Functionality*. See the table in `APP_STORE_METADATA.md` for the exact answers. The hosted
privacy policy (`privacy.html`) already covers Game Center.

## 4. Test before release

- Internal TestFlight build → launch the app → iOS should show the Game Center
  sign-in bubble ("Welcome back, ...") at the top.
- Finish a run → App Store Connect leaderboard should show the score within a
  minute or two (there can be a short delay on freshly created leaderboards).
- The 🏆 **Leaderboard** buttons appear on the start screen and the game-over
  card once sign-in succeeds.

## Notes

- The Game Center entitlement (`ios/App/App/App.entitlements`) is already wired
  into the Xcode project; iOS App IDs have Game Center enabled by default, so no
  changes are needed in the Apple Developer portal or in Codemagic.
- The native code lives in `ios/App/App/GameCenterPlugin.swift` (registered by
  `MainViewController.swift`). The web build (GitHub Pages) is unaffected — the
  plugin is absent there, so all Game Center calls no-op and the buttons stay hidden.
- To add more leaderboards later (e.g. best combo), create them in ASC and call
  `GC.submitScore({score, leaderboardId: '...'})` with the new ID.
