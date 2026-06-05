# App Store Readiness Notes

## Packaging route

This project uses Capacitor to package the existing HTML/CSS/JavaScript canvas game as an iOS app. Capacitor was selected because the game already runs as a browser-based canvas app and can be bundled into a native iOS shell without rewriting gameplay in Swift or React Native.

## Production metadata

- App name: Dodge Dash Newport
- Bundle ID: `com.dodgedash.newport`
- Version: `1.0.0`
- iOS platform target: generated Capacitor iOS project under `ios/`
- Privacy policy draft: `PRIVACY.md`

## App privacy answers draft

- Data collected: none
- Tracking: no
- Third-party advertising: no
- Network required for gameplay: no
- Local-only storage: best score

## Remaining pre-submission tasks

- Open `ios/App/App.xcworkspace` in Xcode on macOS.
- Confirm signing team, bundle identifier ownership, build number, deployment target, and release configuration.
- Archive and upload through Xcode/App Store Connect.
- Capture required App Store screenshots on real devices or simulators.
- Run real-device testing on iPhone and iPad form factors.
