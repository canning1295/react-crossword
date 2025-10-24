# GridMosaic Operator Checklist

This file lists the manual steps the human operator must perform to support the GridMosaic PWA. Work through the sections in order, collaborating with the development agent as needed.

---

## 1. Firebase Project Initialization
1. Create a new Firebase project named **GridMosaic** (or reuse an existing sandbox).
2. Enable Firestore in **Native mode** and select a region close to your users.
3. Enable Firebase Authentication and turn on the following providers:
   - Google (configure OAuth consent screen in Google Cloud if prompted)
   - Email/Password
4. Optional: Enable Firebase Hosting if you intend to deploy there.

Helpful link: https://firebase.google.com/docs/projects/learn-more

---

## 2. Service Accounts & Credentials
1. Generate a Web App within the Firebase console; copy the config snippet (`apiKey`, `authDomain`, etc.).
2. Create a service account with `Firestore Admin` role for seeding scripts.
3. Download the service-account JSON and store it securely (not in the repo). Provide path to the agent when seeding puzzles.

Helpful link: https://firebase.google.com/docs/admin/setup

---

## 3. Firestore Security Rules Deployment
1. Coordinate with the agent to review proposed security rules.
2. In the Firebase console, paste and publish the rules or deploy via Firebase CLI (`firebase deploy --only firestore:rules`).
3. After deployment, run Firestore Rules Simulator to confirm:
   - Authenticated users can read `puzzles`.
   - Users can only read/write `userProgress` documents matching their UID.
   - Only users with custom claim `role: 'curator'` (or service account) can write `puzzles`.

Helpful link: https://firebase.google.com/docs/rules/insecure-rules

---

## 4. Authentication Roles
1. Decide who should act as **curators** able to approve imports.
2. Using Firebase CLI or Admin SDK, set custom claims for curator accounts (example command the agent can provide).
3. Maintain a secure record of curator emails for future audits.

Helpful link: https://firebase.google.com/docs/auth/admin/custom-claims

---

## 5. Environment Configuration
1. Create `.env.local` in `apps/gridmosaic/` with the Firebase web config values provided earlier:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_MEASUREMENT_ID=... # optional if Analytics enabled
   ```
2. Add the `.env.local` file to your local environment and keep it out of version control.
3. Share sanitized values with teammates as required.

---

## 6. Seed Puzzle Library
1. Collect IPUZ crossword files you are permitted to redistribute.
2. Review licensing for each puzzle source and document attribution (title, author, source URL).
3. Place the IPUZ files in a local directory (e.g., `seed/puzzles/`).
4. Provide the directory path and service-account key to the agent so they can run the seeding script.
5. After seeding, verify Firestore `puzzles` collection in the console to confirm metadata appears correctly.

Helpful link: https://www.ipuz.org/

---

## 7. Cloud Function Deployment (Optional Moderation)
1. Enable **Cloud Functions** in Firebase if import moderation is required.
2. Install Firebase CLI locally (`npm install -g firebase-tools`), login, and initialize functions (`firebase init functions`).
3. Collaborate with the agent to review function code that publishes puzzles from the `imports` queue.
4. Deploy functions (`firebase deploy --only functions`) and monitor logs in Google Cloud console.

Helpful link: https://firebase.google.com/docs/functions/get-started

---

## 8. PWA Assets & Branding
1. Approve the final GridMosaic logo and color palette.
2. Supply multi-resolution icons (at least 192x192, 512x512 PNG) and a maskable icon if possible.
3. Confirm the manifest metadata (name, short_name, background_color, theme_color) matches brand guidelines.

Helpful link: https://web.dev/customize-install/

---

## 9. Deployment Pipeline
1. If deploying to Firebase Hosting:
   - Run `firebase init hosting` in the project root (choose `apps/gridmosaic/dist` as the public directory after build).
   - Configure rewrite rules if using SPA fallback (`"rewrites": [{ "source": "**", "destination": "/index.html" }]`).
2. Set up CI secrets (Firebase token, service-account data) in GitHub or your chosen CI provider.
3. Coordinate with the agent to finalize GitHub Actions or alternative pipelines.

Helpful link: https://firebase.google.com/docs/hosting/quickstart

---

## 10. QA & Launch Checklist
1. Test authentication flows on production Firebase project.
2. Install the PWA on iOS and Android; verify offline puzzle access works.
3. Review analytics dashboards (if enabled) to confirm events stream in.
4. Publish privacy policy and terms covering puzzle data, analytics, and imports.
5. Announce launch plans and monitor for early feedback.

---

Keep this checklist updated as the project evolves. Notify contributors whenever new manual steps are introduced.
