# The Polibrand Agency Website Audit Report

Date: 2026-05-20  
Scope: local codebase plus safe read-only checks of the prior deployment and remediation for Firebase Hosting / Firebase App Hosting  
Credentials: none provided, so credentialed destructive testing was not performed.

## Remediation Status

Updated after the hardening pass on 2026-05-20:

- Implemented signed HttpOnly admin sessions and protected `/admin/:path*` with Next proxy middleware.
- Added `/api/admin/login` for server-verified admin login/logout.
- Protected admin APIs for content, settings, applications, newsletter subscriber reads, and uploads.
- Added signed HttpOnly client portal sessions via `/api/portal/login`.
- Blocked unauthenticated `/api/portal/profile` reads/writes.
- Removed the production-facing demo portal bypass from the dashboard flow.
- Pivoted persistence to Firebase Admin SDK: Firestore now backs content, settings, applications, newsletter subscribers, portal progress, and portal discussions.
- Pivoted persistent media uploads to Firebase Storage.
- Added Firebase Auth ID token support to admin and portal login APIs.
- Added browser-side Firebase Auth email-link support to the portal login screen.
- Added basic validation for application and newsletter submissions.
- Added in-memory rate limiting to admin login, portal login/profile, application, and newsletter endpoints.
- Removed an unsafe `dangerouslySetInnerHTML` success-message render.
- Ignored generated `.firebase/**` artifacts in ESLint and cleaned Next build warnings for metadata/root/proxy.
- Added `.env.example`, `DEPLOYMENT_CHECKLIST.md`, and `npm run seed:firebase`.
- Marked mock analytics/payments/documents admin areas as non-production and disabled non-persistent action buttons.
- Added Firebase Firestore/Storage rules and indexes config.
- Updated Next.js to the latest published 16.2.6 release and added a PostCSS override to reduce production audit exposure.

Remaining work:

- Configure production env vars before deployment: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` or `ADMIN_SESSION_SECRET`, `CLIENT_PORTAL_ACCESS_CODE`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, optional `FIREBASE_SERVICE_ACCOUNT_KEY`, and `NEXT_PUBLIC_SITE_URL`.
- Run `npm run seed:firebase` once with Firebase credentials available so Firestore starts with the current local content/settings.
- Enable Firebase Auth email-link sign-in in the Firebase console and add the Firebase Hosting domain to authorized domains.
- Finish the broader source type cleanup; generated-artifact noise is removed and lint passes, but existing `any`/image warnings remain as warnings.
- `npm audit --omit=dev` still reports low-severity Firebase Admin transitive dependency advisories; npm's suggested fix is a breaking downgrade to older Firebase Admin, so this should be revisited when Firebase/Google packages publish a non-breaking patch.

## Executive Summary

The site is functional at a basic rendering level, and `npm run build` completes successfully. The original audit found critical security and persistence problems that should have been treated as launch blockers.

The hardening pass has now added signed HttpOnly sessions, admin route protection, admin API protection, portal API protection, rate limiting, Firebase Admin SDK persistence, Firebase Storage uploads, Firebase Auth ID-token verification support, and portal email-link login support.

The reported client complaint that admin changes do not reflect on the public site was caused by production serving content/settings from local fallback data instead of durable cloud data. The implemented fix moves content/settings to Firestore. After deployment, live `/api/settings` and `/api/content` should return `_source: "firebase"` once Firestore is seeded.

## Verification Performed

- `npm run build`: passed after remediation.
- `npm run lint`: passed after remediation; remaining source cleanup items are warnings, not blocking errors.
- Local dev server: started on `http://localhost:3100` after sandbox escalation.
- Local read-only smoke checks:
  - `/`: `200`
  - `/admin/dashboard`: `200` without authentication
  - `/api/settings`: returned `_source: "local_disk"`
  - `/api/applications`: returned application data without authentication
- Live read-only smoke checks:
  - `/`: `200`, prior production deployment
  - `/admin/dashboard`: `200` without authentication
  - `/api/content`: `200`, `Cache-Control: no-store, max-age=0`, returned `_source: "local_disk"`
  - `/api/settings`: `200`, returned `_source: "local_disk"`
  - `/api/applications`: `200`, returned application data without authentication

No production POST/PATCH/upload tests were run because those would mutate live data.

## Critical Findings

### C1. Admin Portal Has No Real Authentication

Evidence:
- `app/admin/login/page.tsx:34-45` redirects to `/admin/dashboard` if both fields are non-empty.
- `app/admin/layout.tsx:18-28` renders admin routes directly with no session or role check.
- Live `/admin/dashboard` returned `HTTP 200` without credentials.

Impact:
- Anyone who knows or guesses admin URLs can access admin UI pages.
- Since the APIs are also unprotected, visitors can potentially alter public site content, settings, applications, partner records, and uploads.

Recommended fix:
- Add server-side authentication using NextAuth/Auth.js, Clerk, Supabase Auth, Firebase Auth, or a minimal signed cookie/session implementation.
- Add middleware protecting all `/admin/:path*` routes.
- Redirect unauthenticated users to `/admin/login`.
- Store and verify password hashes server-side; never trust client-only login checks.

Acceptance criteria:
- `/admin/dashboard` returns redirect/401 without a valid session.
- A non-empty fake login no longer grants access.
- All admin routes are covered by one server-side guard.

### C2. Admin Write APIs Are Public

Evidence:
- `app/api/content/route.ts:20-24` accepts POST and calls `setContent` with no auth check.
- `app/api/settings/route.ts:19-23` accepts POST and calls `setSettings` with no auth check.
- `app/api/applications/route.ts:12-36` exposes application list with no auth check; PATCH is also unauthenticated.
- `app/api/upload/route.ts:16-46` accepts image uploads without auth.

Impact:
- Public visitors can modify site copy, SEO metadata, colors, logo, hero image, application statuses, and uploaded assets if they call the endpoints directly.
- This enables defacement, data tampering, spam storage abuse, and privacy violations.

Recommended fix:
- Require an admin session or signed bearer token for all admin mutation APIs.
- Split public endpoints from admin endpoints. Public routes should include only intentionally public behavior.
- Add CSRF protection for cookie-authenticated mutations.
- Add audit logging for all admin mutations.

Acceptance criteria:
- Unauthenticated POST/PATCH requests to `/api/content`, `/api/settings`, `/api/upload`, and `/api/applications` return `401` or `403`.
- Authenticated admin requests succeed.
- Mutation events record actor, timestamp, action, and changed resource.

### C3. Application Data Is Publicly Exposed

Evidence:
- Live `/api/applications` returned `HTTP 200` and application fields including name, email, phone, country, role, essay, status.
- Local `/api/applications` behaves the same.

Impact:
- Applicant PII is publicly accessible.
- This creates privacy, trust, and compliance risk.

Recommended fix:
- Make `GET /api/applications` admin-only.
- Create separate public submission route for applications and never return all applications to public clients.
- Consider redacting legacy seed/demo records from production.

Acceptance criteria:
- Unauthenticated `GET /api/applications` returns `401` or `403`.
- Admin applications page still loads when authenticated.
- Public application submission remains available through `/api/apply`.

### C4. Client Portal Authentication Is Email-Based and Bypassable

Evidence:
- `app/portal/page.tsx:28-40` logs in by calling `/api/portal/profile?email=...`; password input is not used.
- `app/portal/dashboard/page.tsx:58-72` defaults to `jane@example.com` if no localStorage value exists.
- Portal state is stored in localStorage as `fellowEmail`.

Impact:
- Anyone who knows an approved email can access that client portal.
- Anyone visiting `/portal/dashboard` can enter demo mode automatically.
- Module progress and discussion posting are tied to email only, not a verified user session.

Recommended fix:
- Add real client authentication: magic links, OTP, password auth, or invite-based account creation.
- Remove automatic demo fallback from the production portal.
- Protect `/portal/dashboard` and `/api/portal/profile` with a verified session.
- Keep demo mode isolated behind a separate non-production or read-only demo route.

Acceptance criteria:
- `/portal/dashboard` redirects to login without a valid client session.
- Passwordless login requires a verified magic link/OTP.
- Knowing an email alone is insufficient to read or mutate portal data.

## High Findings

### H1. Admin Changes Did Not Reliably Persist to Public Site

Evidence:
- Live `/api/settings` returned `_source: "local_disk"`.
- Live `/api/content` returned `_source: "local_disk"`.
- Before remediation, the app used optional cloud persistence and local JSON fallback, so the live APIs served `_source: "local_disk"`.
- After remediation, `lib/db.ts` uses Firebase Admin SDK and stores content/settings in Firestore documents `site_config/content` and `site_config/settings`.
- `app/admin/content/page.tsx` still saves through `/api/content` and `/api/settings`, but those routes now require admin session auth and write to Firestore.

Likely root cause:
- Production was not using Firebase/Firestore content/settings as the active source.
- Runtime writes to checked-in JSON are not durable in hosted/serverless production and should only be treated as local development fallback.
- The public site hydrates from `/api/content` and `/api/settings`, but if those APIs return fallback data, admin edits will appear only temporarily or only in the server instance that handled the write.

Additional contributing factors:
- Browser `localStorage` is used as a cache in `components/SettingsProvider.tsx:52-88`, which can briefly show stale data.
- Static metadata and layout styling can lag behind runtime content changes even if client content updates.
- Deployment docs now point to Firebase as the canonical target.

Recommended fix:
- Choose one durable content store and make it mandatory in production. Firestore is now wired as that store.
- Fail admin saves loudly if Firebase Admin is not configured or if Firestore writes fail.
- Stop writing production content to local JSON files except as a local development fallback.
- Add a `/api/admin/persistence-health` endpoint for authenticated admins showing active source: `cloud`, `local_disk`, or `fallback`.
- Seed Firestore from `data/content.json` and `data/settings.json` with `npm run seed:firebase`.

Acceptance criteria:
- Live `/api/content` and `/api/settings` return `_source: "firebase"`.
- Admin save followed by a fresh unauthenticated public GET returns the new value.
- A cold start or redeploy does not revert content.
- Admin save APIs return an error when Firebase persistence is unavailable in production.

### H2. Uploads Are Public and May Be Ephemeral

Evidence:
- `app/api/upload/route.ts:16-46` accepts public image uploads.
- Before remediation, production uploads depended on optional non-Firebase storage or local file fallback.
- After remediation, uploads use Firebase Storage through the Admin SDK and return Firebase Storage download-token URLs.

Impact:
- Public users can upload image files up to 5MB.
- In production without Firebase Storage configuration, uploaded logos/hero images will fail instead of pretending to persist.
- There is no image dimension validation, malware scanning, rate limiting, or auth.

Recommended fix:
- Require admin auth for uploads.
- Make Firebase Storage configuration mandatory in production.
- Validate MIME type using content sniffing, dimensions, and extension.
- Add rate limits and storage quotas.

Acceptance criteria:
- Unauthenticated upload returns `401` or `403`.
- Production uploads always return a durable Firebase Storage URL.
- Invalid or oversized images are rejected before storage.

### H3. Public Forms Have Weak Validation and No Abuse Controls

Evidence:
- `app/api/apply/route.ts:6-37` accepts arbitrary JSON and stores it.
- `app/api/newsletter/route.ts` validates only that email contains `@`.
- No rate limiting, CAPTCHA/turnstile, schema validation, or spam protection is present.

Impact:
- Application and newsletter storage can be spammed or polluted.
- Stored malformed data can break admin pages that assume fields exist.

Recommended fix:
- Add zod schema validation for applications/newsletter.
- Add rate limiting by IP/email.
- Add bot protection to public forms.
- Normalize and sanitize all stored fields.

Acceptance criteria:
- Invalid/missing application fields return `400`.
- Repeated submissions are throttled.
- Admin pages do not crash when records are incomplete.

### H4. Stored Content Can Reach Unsafe HTML Sinks

Evidence:
- `app/apply/page.tsx:83` uses `dangerouslySetInnerHTML` on success copy sourced from editable content and interpolated form values.

Impact:
- If an attacker gains admin/content API access, they can inject script-capable HTML into user-facing pages.
- Even after auth is fixed, unsafe HTML sinks increase blast radius of compromised admin credentials.

Recommended fix:
- Replace `dangerouslySetInnerHTML` with React text rendering.
- If rich text is required, sanitize with a strict allowlist before rendering.

Acceptance criteria:
- User-entered name/program text renders as text, not HTML.
- Content-managed rich text cannot execute scripts or event handlers.

## Medium Findings

### M1. Lint Configuration Scans Generated Firebase Artifacts

Evidence:
- `eslint.config.mjs:9-15` ignores `.next`, `out`, `build`, and `next-env.d.ts`, but not `.firebase`.
- `npm run lint` reported 9,533 issues, many under `.firebase/thepolibrandagency-d4263/functions/.next/...`.
- Status after remediation: generated Firebase and build artifacts are now ignored, and `npm run lint` passes with warnings only.

Impact:
- CI lint signal is noisy and slow.
- Real source issues are buried.

Recommended fix:
- Add `.firebase/**`, `.vercel/**`, coverage, generated functions output, and other build artifacts to ESLint ignores.
- Then fix remaining source lint errors incrementally.

Acceptance criteria:
- `npm run lint` only reports source-owned issues.
- Generated deployment artifacts are ignored.

### M2. Deployment Configuration Is Ambiguous

Evidence:
- README previously said production was Vercel.
- `netlify.toml` and `firebase.json` also exist.
- Build/dev both warn that Next inferred `/Users/truth` as workspace root because multiple lockfiles exist.
- Status after remediation: README, `.env.example`, deployment checklist, `metadataBase`, and Firebase rules now point to Firebase as the canonical target; `next.config.ts` sets `outputFileTracingRoot`.

Impact:
- Developers may deploy to the wrong platform.
- Build tracing may include wrong files or miss required files.
- Environment variables may be configured in one platform but not the active one.

Recommended fix:
- Declare Firebase as the canonical deployment target or document all targets explicitly.
- Remove stale deployment config or move it to docs/archive.
- Set `outputFileTracingRoot` or `turbopack.root` in `next.config.ts`.

Acceptance criteria:
- Build no longer warns about workspace root.
- README and deployment files agree on the active platform.

### M3. Admin Feature Pages Contain Non-Functional or Mock Data

Evidence:
- Analytics page uses hard-coded metrics.
- Documents page uses hard-coded document list and non-functional upload/download/delete controls.
- Payments page derives fake completed transactions from approved applications and has Save/Create buttons without persistence.
- Applications page computes a mock score from essay length.

Impact:
- Admin users may trust fake operational data.
- Buttons imply actions that do not persist.

Recommended fix:
- Label these sections as demo-only or wire them to real backend storage.
- Disable non-functional actions until implemented.
- Replace fake analytics/payment data with real integrations or remove from production.

Acceptance criteria:
- Every admin button either performs a real persisted action or is clearly disabled.
- Admin dashboards do not display fake data as production metrics.

### M4. Content Shape Assumptions Can Crash Pages

Evidence:
- Many pages access nested content directly, such as `content.pages.apply`, `content.navbar`, and page-specific arrays.
- Admin content editor allows broad editing of the content tree.

Impact:
- A malformed admin save can break public pages.

Recommended fix:
- Define a content schema and validate before saving.
- Use typed fallback helpers for every editable page section.
- Add a preview validation step in admin before publish.

Acceptance criteria:
- Invalid content saves fail with field-level errors.
- Public pages render graceful fallbacks when optional fields are missing.

## Low Findings

### L1. Social and Legal Links Are Placeholder Links

Evidence:
- Content includes footer social and legal hrefs as `"#"`.

Impact:
- Users cannot access privacy, terms, cookies, or real social channels.

Recommended fix:
- Replace placeholders with real URLs or hide until ready.

Acceptance criteria:
- Footer legal/social links navigate to real resources.

### L2. Metadata Base and Canonical Domain Need Cleanup

Evidence:
- Build warned that `metadataBase` is not set.
- Live output included Open Graph image URL using `https://thepolibrandagency.com/logo.png`, while README previously pointed to Vercel.
- Status after remediation: `metadataBase` is set from `NEXT_PUBLIC_SITE_URL` with Firebase Hosting as the fallback.

Impact:
- Social previews may resolve incorrectly.
- Canonical domain behavior is unclear.

Recommended fix:
- Set `metadataBase` to the canonical production domain.
- Configure canonical URLs and social image assets.

Acceptance criteria:
- Build warning is gone.
- Social debugger tools resolve Open Graph/Twitter images correctly.

## Remediation Backlog

### Immediate Hotfixes

1. Add server-side admin authentication and middleware for `/admin/:path*`.
2. Require admin auth for `/api/content`, `/api/settings`, `/api/applications`, and `/api/upload`.
3. Lock down `/api/applications` so public visitors cannot read applicant data.
4. Disable production admin saves unless Firebase Admin / Firestore persistence is configured and active.
5. Remove automatic demo login from production `/portal/dashboard`.

### Short-Term Hardening

1. Add durable production persistence checks and migration/seed tooling for Firestore.
2. Add schema validation for content, settings, applications, newsletter, portal profile actions, and uploads.
3. Add rate limiting and bot protection to public forms.
4. Replace unsafe HTML rendering or sanitize content.
5. Fix ESLint ignores, then clean source lint errors.
6. Add smoke tests for protected routes and public forms.

### Longer-Term Improvements

1. Continue replacing local JSON fallback paths with Firestore-backed production models for content, applications, partners, portal progress, documents, and subscribers.
2. Add role-based admin permissions and audit logs.
3. Add a real client portal account/invite flow.
4. Wire analytics, payments, documents, and partner CRM to real services or remove mock interfaces.
5. Add monitoring for API errors, persistence failures, and failed auth attempts.

## Recommended First Fix Design

Use the smallest safe production hardening path:

1. Add an auth layer.
   - Admin session cookie signed with a secret.
   - Middleware protects `/admin/:path*`.
   - API helper `requireAdmin(request)` protects admin APIs.

2. Make Firebase persistence mandatory in production.
   - If `process.env.NODE_ENV === "production"` and Firebase Admin cannot initialize, admin mutation APIs return `503` or fail loudly.
   - Read APIs can still return bundled fallback for public uptime, but include `_source` and warn admins.

3. Protect applicant/client data.
   - Move application list/status APIs under an admin-only contract.
   - Add a separate public `/api/apply` submission schema.

4. Stabilize portal login.
   - Remove localStorage-only authentication.
   - Add magic-link or OTP verification before storing a server-side session.

## Final Risk Rating

Current risk after local remediation: Medium until Firebase production configuration, Firestore seeding, and live deployment verification are complete.

The public marketing site renders, and the repo now includes the main security and Firebase persistence fixes. The first release-quality milestone should be verified in production: protected admin APIs, protected applicant data, Firestore-backed persistence verified by `_source: "firebase"`, and a Firebase Auth email-link portal login flow on an authorized Firebase domain.
