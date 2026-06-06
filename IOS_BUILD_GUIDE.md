# Shipping the iOS app from Windows (Capacitor + Codemagic)

The game is now wrapped as a native iOS app (Capacitor, in `ios/`). You're on Windows,
so the build runs on **Codemagic's cloud Mac**. Here's the whole flow.

---

## What's already done (in this repo)
- ✅ `package.json` + Capacitor 8 (`@capacitor/core`, `@capacitor/ios`, `@capacitor/cli`)
- ✅ `capacitor.config.json` — appId **`com.sailwestcapital.dodgenewportsend`**, appName **Dodge Mike's Newport Send**
- ✅ `ios/` — the Xcode project (uses Swift Package Manager, no CocoaPods)
- ✅ App icon (Mike's face) + splash baked into the Xcode project
- ✅ `scripts/build-web.js` — copies the web game into `www/` for the app to bundle
- ✅ `codemagic.yaml` — the cloud build workflow

> Now Codemagic will detect a Capacitor app — go back and click **Retry**.

---

## Step 1 — Register the app in App Store Connect
1. https://appstoreconnect.apple.com → **Apps → + → New App**.
2. Platform **iOS**, name **Dodge Mike's Newport Send**, your language, **Bundle ID** = `com.sailwestcapital.dodgenewportsend`
   (if that exact Bundle ID isn't in the list: Apple Developer portal → **Identifiers → +** → register it first).
3. After creating, note the app's numeric **Apple ID** (shown under App Information) — you'll need it.

> Want a different Bundle ID? Change it in **both** `capacitor.config.json` and `codemagic.yaml`, then re-push.

## Step 2 — Make an App Store Connect API key (lets Codemagic sign + upload)
1. App Store Connect → **Users and Access → Integrations → App Store Connect API → Generate API Key**.
2. Access = **App Manager**. Download the **`.p8`** file (one-time!) and copy the **Key ID** and **Issuer ID**.

## Step 3 — Add the key to Codemagic
1. Codemagic → your app → **Settings → Distribution / Code signing / Integrations → App Store Connect**.
2. Add the key: upload the `.p8`, paste Key ID + Issuer ID. **Name it** (e.g., `Codemagic`).
3. Name it **exactly `Codemagic`** so it matches `codemagic.yaml`.

## Step 3b — Add a signing certificate private key
The build *creates* the distribution certificate + provisioning profile, which needs an RSA key.
1. Generate one (Git Bash on Windows, or any Terminal):
   ```
   ssh-keygen -t rsa -b 2048 -m PEM -f codemagic_cert_key -q -N ""
   ```
   That writes `codemagic_cert_key` — the private key, starting with `-----BEGIN RSA PRIVATE KEY-----`.
2. Codemagic → your team/app → **Environment variables**, add:
   - **Name:** `CERTIFICATE_PRIVATE_KEY`
   - **Value:** the entire contents of `codemagic_cert_key` (include the BEGIN/END lines)
   - **Group:** `appstore_credentials`  ·  mark **Secure** ✓  ·  then **Add**
3. Delete the local `codemagic_cert_key` / `.pub` files afterward.

## Step 4 — placeholders in `codemagic.yaml` (already filled in this repo) ✅
`app_store_connect: Codemagic` · `bundle_identifier: com.sailwestcapital.dodgenewportsend` · `APP_STORE_APPLE_ID: 6777284091`

## Step 5 — Build
- In Codemagic, pick the **`ios-app-store`** workflow and **Start new build** (branch `main`).
- It will: install deps → build web → sync iOS → sign → build `.ipa` → upload to **TestFlight**.
- First build ≈ 8–15 min.

## Step 6 — Submit
- App Store Connect → your app → add the **screenshots** (in `/screenshots`), **description/keywords** (in `APP_STORE_METADATA.md`), the **Privacy Policy URL** (`/privacy.html`), age rating, etc.
- Select the TestFlight build → **Submit for Review**.

---

## ⚠️ Two things to decide before submitting
1. **Names:** for Apple review, the real bar names + "Riley Reid" are the biggest rejection risk. The safe list is in `APP_STORE_COPY_SAFE.md` — swapping the `BARS` array in `index.html` is a one-line change. Strong rec for the App Store build.
2. **Music rights:** keep niiko x swae's written permission handy in case review asks.

## Local commands (reference)
```bash
npm install          # install deps
npm run build        # copy web game -> www/
npx cap sync ios     # push web + config into the iOS project
npx cap open ios     # (Mac only) open in Xcode
```
