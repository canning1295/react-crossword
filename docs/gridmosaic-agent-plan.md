# GridMosaic Build Blueprint

This document is a step-by-step guide for turning the existing `react-crossword` project into **GridMosaic**, a responsive progressive web app (PWA) that curates, plays, and synchronizes classic IPUZ-format crossword puzzles for users of all skill levels. It assumes you are a coding agent with access to this repository, the ability to install dependencies, and collaboration with a human operator who can provision third-party services.

---

## 1. Product Pillars
- **Responsive PWA**: Works gracefully on phones, tablets, and desktops; installable with offline support.
- **Puzzle Library**: Ships with curated IPUZ puzzles grouped by size (small/medium/large); new imports become globally available.
- **Shared Progress**: Uses Firebase for authentication, puzzle storage, and syncing play history across devices.
- **Import Friendly**: Accepts user-supplied IPUZ puzzles through a guided flow; validates and persists them.

---

## 2. Tech Stack Overview
1. **UI**: React 18 + TypeScript; reuse existing `@jaredreisinger/react-crossword` components.
2. **App Shell**: Vite + `vite-plugin-pwa` for fast builds and service worker generation. (Docs: https://vitejs.dev/guide/ & https://vite-pwa-org.netlify.app/)
3. **Styling**: Tailwind CSS or CSS Modules + ThemeProvider for crossword theming; pick whichever matches contributor preference.
4. **State Management**: React Query (`@tanstack/react-query`) for async data flows + context providers for lightweight global state.
5. **Firebase**: Use Firestore for data, Authentication for user identity (Google & email providers), Storage for optional bulk puzzle uploads, and Hosting if desired. (Docs: https://firebase.google.com/docs)
6. **IPUZ Support**: Rely on existing `ipuz.ts` utilities; extend as needed for validation and conversion.

---

## 3. Repository Topology
```
root/
  packages/
    crossword-lib/       # existing library, extracted from current src
  apps/
    gridmosaic/          # new PWA app
  docs/
    gridmosaic-agent-plan.md
    gridmosaic-user-actions.md
```
1. Convert current library source (`src/`) into `packages/crossword-lib`. Update build tooling (tsup/rollup) to publish reusable component.
2. Scaffold GridMosaic app with Vite (`npm create vite@latest gridmosaic -- --template react-ts`), then relocate to `apps/gridmosaic`.
3. Set up shared TypeScript project references or path aliases so the app consumes the local library. Consider pnpm or npm workspaces.

---

## 4. Data Model (Firestore)
| Collection | Document ID                         | Fields (Type)                                                                                                   | Notes |
|------------|-------------------------------------|------------------------------------------------------------------------------------------------------------------|-------|
| `puzzles`  | Auto-ID or slug (e.g., `nyt-2023-09-02`) | `title` (string), `size` (`'small'|'medium'|'large'`), `sourceUrl` (string \| null), `importedBy` (uid), `createdAt` (timestamp), `ipuz` (map), `tags` (array<string>), `visibility` (`'public'|'draft'`) | IPUZ payload is stored as JSON. Include checksum for dedupe. |
| `userProgress` | `${uid}_${puzzleId}`                 | `uid` (string), `puzzleId` (string), `filledCells` (map<string,string>), `startedAt` (timestamp), `updatedAt` (timestamp), `completed` (boolean), `completionTimeSec` (number \| null) | `filledCells` holds coordinates -> letter. |
| `imports`  | Auto-ID                              | `uid`, `status` (`'pending'|'validated'|'published'|'error'`), `ipuz`, `errorMessage`, `createdAt`, `publishedPuzzleId` | Supports async validation and moderation. |
| `users`    | `uid`                                | `displayName`, `email`, `avatarUrl`, `role` (`'player'|'curator'|...)`, `createdAt`, `lastLoginAt`              | Use Firestore auth triggers to populate. |

> 🔗 Firestore modeling best practices: https://firebase.google.com/docs/firestore/data-model

---

## 5. Authentication & Security
1. Enable Firebase Authentication with Google and Email/Password providers.
2. Implement client-side auth flow via Firebase SDK v9 modular API.
3. Configure Firestore security rules:
   - `puzzles`: read allowed to authenticated users; writes restricted to trusted curators or import functions.
   - `userProgress`: users can read/write their own docs.
   - `imports`: users can create, read own; curators can approve/publish.
4. If moderation is required, create Cloud Function to approve imports before publication.

> 🔗 Firebase Rules: https://firebase.google.com/docs/rules

---

## 6. PWA & Offline Strategy
1. Add `vite-plugin-pwa` with a manifest describing GridMosaic (icons, theme colors, categories `["games","education"]`).
2. Cache static assets via Workbox `generateSW` mode.
3. Pre-cache a small default puzzle set for offline play by bundling fallback JSON files in the app.
4. Implement runtime caching for Firestore data using React Query + IndexedDB persistence (`@tanstack/query-persist-client` with `localforage`).
5. Detect offline state and surface UI messaging + fallback to cached progress.

> 🔗 Workbox strategies: https://developer.chrome.com/docs/workbox/modules/workbox-strategies/

---

## 7. UI/UX Milestones
1. **Shell Layout**: responsive nav with puzzle filters (`small | medium | large | all`), hamburger menu for mobile.
2. **Puzzle Browser**: card grid with difficulty tags, completion badges, and saved progress indicators.
3. **Play View**:
   - Integrate `<Crossword />` from library.
   - Add clue pane toggles, progress meter, timer, reveal/check controls.
   - Display metadata (title, author, source).
4. **Import Flow**:
   - Upload IPUZ JSON or paste in text.
   - Client-side validation (schema + duplicates) before writing to Firestore.
   - Confirmation screen summarizing new puzzle; on success, trigger cloud function (or elevated client) to publish.
5. **Profile & History**: show recent puzzles, stats (streaks, completion time), ability to reset progress.

Design inspiration references:
- NYT Crossword mobile UI
- https://crosswordnexus.com/apps/ipuz/
- PWA design patterns: https://web.dev/pwa-checklist/

---

## 8. Implementation Phases
1. **Bootstrap Workspace**
   - Enable npm workspaces.
   - Move library code to `packages/crossword-lib`, update imports, ensure tests pass.
   - Publish workspace symlink so app consumes local build.
2. **Scaffold GridMosaic**
   - Generate Vite React app.
   - Configure ESLint/Prettier/Tailwind (if chosen).
   - Add absolute path aliases (`@app/*`, `@lib/*`).
3. **Firebase Integration**
   - Install `firebase` SDK.
   - Initialize app via modular API; wrap in provider.
   - Implement auth context + login/logout UI.
   - Build Firestore service modules (puzzles, progress, imports).
4. **Puzzle Data Layer**
   - Seed Firestore with baseline puzzles (see §9).
   - Build React Query hooks (`usePuzzleList`, `usePuzzle`, `useUserProgress`).
   - Add optimistic updates for progress saving.
5. **Gameplay Experience**
   - Build puzzle browser.
   - Integrate crossword component with progress sync.
   - Add timer, reveal/check interactions.
6. **Import Pipeline**
   - Client upload form with validation (schema via `zod` or `ajv`).
   - Write to `imports` collection with `status: 'pending'`.
   - Cloud Function or admin pathway publishes to `puzzles`.
7. **PWA Hardening**
   - Configure service worker & manifest.
   - Implement offline detection + cached data hydration.
   - Add `app/install` prompt.
8. **Testing & QA**
   - Unit tests for data hooks and reducers.
   - Integration tests with Testing Library + MSW.
   - E2E smoke test via Playwright or Cypress.
9. **Deployment**
   - Build pipeline via GitHub Actions.
   - Deploy to Firebase Hosting (or Vercel); ensure service worker served correctly.

---

## 9. Seeding Puzzles
1. Collect IPUZ files from reputable sources (e.g., Crossword Nexus, American Values Club). Ensure licensing permits redistribution.
2. Normalize puzzle metadata (title, author, grid size, difficulty).
3. Create a Node script in `tools/seed-puzzles.ts`:
   - Reads `seed/puzzles/*.ipuz`.
   - Validates via shared IPUZ validator.
   - Uploads to Firestore using Firebase Admin SDK with batch writes.
4. Tag puzzles by size:
   - `small`: <= 11x11
   - `medium`: 12x12–15x15
   - `large`: > 15x15

> 🔗 IPUZ spec: https://www.ipuz.org/

---

## 10. Import Validation Rules
1. Schema check against IPUZ Crossword v2 specification.
2. Ensure `dimensions.width`/`height` <= 25 and >= 7.
3. Reject puzzles lacking `clues` or `solution`.
4. Calculate checksum (e.g., SHA-256 of sorted clue text + grid) to prevent duplicates.
5. Sanitize HTML/markdown in clues to prevent XSS.
6. If puzzle includes metadata such as `copyright`, surface to user.

---

## 11. Analytics & Telemetry
- Integrate Firebase Analytics (if privacy policy covers it).
- Track events: `puzzle_started`, `puzzle_completed`, `puzzle_imported`, `pwa_installed`.
- Provide opt-out toggle in settings.

---

## 12. Accessibility Checklist
- Ensure crossword grid supports keyboard navigation (existing library handles base navigation; test with screen readers).
- Provide ARIA labels for clue lists and controls.
- Respect prefers-reduced-motion; offer high-contrast theme toggle.
- Add language attribute and metadata for puzzle locale.

> 🔗 WCAG quick reference: https://www.w3.org/WAI/WCAG21/quickref/

---

## 13. Documentation Deliverables
1. `README.md` updates covering GridMosaic overview, setup, and scripts.
2. `/docs/gridmosaic-user-actions.md` (see companion doc) for operator steps.
3. In-app onboarding modal explaining controls and import policy.
4. Changelog entries for workspace restructuring and PWA launch.

---

## 14. Definition of Done
- GridMosaic passes Lighthouse PWA audit (installable, offline-capable, >90 score in Performance/Accessibility/Best Practices).
- Firestore contains seeded puzzles; import flow promotes new puzzles after validation.
- Authenticated users can resume puzzles across devices and see completion history.
- CI pipeline runs lint, tests, type checks, and builds without warnings.
- Documentation reflects final architecture and provides operator guidance.

---

Proceed sequentially through the phases, keeping the human operator informed when manual Firebase configurations or seed approvals are required. Refer to the companion user-actions document for those checkpoints.
