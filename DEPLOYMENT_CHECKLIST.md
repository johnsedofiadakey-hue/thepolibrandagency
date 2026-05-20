# Deployment Checklist

Use this before deploying the hardening changes.

## Required Environment Variables

Set these in Firebase App Hosting / Cloud Functions environment config:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `AUTH_SECRET` or `ADMIN_SESSION_SECRET`
- `CLIENT_PORTAL_ACCESS_CODE`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_SERVICE_ACCOUNT_KEY` if the runtime does not provide application default credentials

## Pre-Deploy Checks

1. Run `npm run build`.
2. Confirm no local `.env` file is committed.
3. Confirm Firestore is enabled for project `thepolibrandagency-d4263`.
4. Confirm Firebase Storage is enabled and the bucket matches `FIREBASE_STORAGE_BUCKET`.
5. Run `npm run seed:firebase` with Firebase credentials available to seed `site_config/content`, `site_config/settings`, and sample applications before expecting admin changes to persist.

## Post-Deploy Verification

Run these against production:

1. `GET /admin/dashboard` without cookies should redirect to `/admin/login`.
2. `GET /api/applications` without cookies should return `401`.
3. `POST /api/content` without cookies should return `401`.
4. Login through `/admin/login` with `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
5. Admin content/settings save should succeed only when Firebase Admin can write to Firestore.
6. `GET /api/content` and `GET /api/settings` should return `_source: "firebase"` after Firestore is seeded.
7. Portal profile should return `401` before login and `200` after `/portal` login with either a Firebase email-link session for an approved email or a valid approved email plus `CLIENT_PORTAL_ACCESS_CODE`.

## Still Recommended

- Enable Firebase Auth email-link sign-in in the Firebase console and add the production domain to authorized domains.
- For Firebase admin users, set an `admin` custom claim or use the `ADMIN_EMAIL` account; `/api/admin/login` accepts verified Firebase ID tokens too.
- Connect payments, analytics, and documents to real providers before treating those admin pages as operational.
- Finish source lint cleanup.
