# Netlify + Firebase Setup

This project uses Firebase (Auth, Firestore, Storage). When deploying to Netlify, set these up so the site can access your database correctly.

## 1) Add environment variables in Netlify

In your Netlify site (crossword123.netlify.app):

- Go to Site settings → Build & deploy → Environment → Environment variables
- Add the following keys (values from Firebase Console → Project settings → General → Your apps → Web app):
  - REACT_APP_FIREBASE_API_KEY
  - REACT_APP_FIREBASE_AUTH_DOMAIN
  - REACT_APP_FIREBASE_PROJECT_ID
  - REACT_APP_FIREBASE_STORAGE_BUCKET
  - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  - REACT_APP_FIREBASE_APP_ID
  - REACT_APP_FIREBASE_MEASUREMENT_ID (optional)
- Trigger a new deploy after saving.

Notes:
- CRA requires the `REACT_APP_` prefix to expose variables to the browser.
- This repo now enforces these variables in production; missing values will fail the build rather than silently using local defaults.

## 2) Authorize your Netlify domain in Firebase Auth

In Firebase Console → Authentication → Settings → Authorized domains:

- Add `crossword123.netlify.app`
- Optionally add `*.netlify.app` if you use deploy previews
- Keep `localhost` for local development

If you use Google Sign-In, ensure the OAuth consent screen is configured and the domain is allowed.

## 3) Firestore and Storage rules

Deploy rules from this repo (optional but recommended to keep in sync):

- Firestore rules: `firestore.rules`
- Storage rules: `storage.rules`

You can deploy via Firebase CLI:

```
firebase deploy --only firestore:rules,storage:rules
```

## 4) SPA routing on Netlify

A `netlify.toml` with a catch-all redirect is included so client-side routes resolve correctly:

```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Configure your build command and publish directory in the Netlify UI to match what you're deploying:

- If deploying the example app (CRA):
  - Base directory: `example`
  - Build command: `npm run build`
  - Publish directory: `example/build`
- If deploying the component docs (Styleguidist):
  - Build command: `npm run doc:build`
  - Publish directory: `styleguide`

## 5) Quick verification

- Open the live site and attempt Google Sign-In
- Create/read a document (e.g., a user profile) to confirm Firestore access
- If you get permission errors, review `firestore.rules` and ensure the signed-in user meets the rule conditions (e.g., curator claims where required)

## 6) Troubleshooting

- Build fails on Netlify with missing env var error:
  - Ensure all REACT_APP_* variables are set on Netlify and redeploy
- Auth popup blocked or error: `auth/unauthorized-domain`:
  - Add your Netlify domain in Firebase Auth → Authorized domains
- Firestore permission denied:
  - Verify rules and the current user's claims (curator/non-curator) align with the operation

---

For local development, copy `.env.example` to `.env.local` and fill in your values.
