# Restore Points

This project should keep a restore point before every production update.

## Process

1. Back up live production content and settings before deploying or syncing Firestore.
2. Save the backup under `restore-points/` with an ISO timestamp.
3. Record the timestamp, files, commit, and purpose in this file.
4. Push the restore log and code changes to GitHub after verification.

## 2026-07-08T11-34-15-224Z

Purpose: Back up the current live Firebase content/settings before replacing production Firestore with the local website content.

Git commit before update: `e24110f`

Backup files:

- `restore-points/2026-07-08T11-34-15-224Z-production-content.json`
- `restore-points/2026-07-08T11-34-15-224Z-production-settings.json`

Restore note:

To roll back the visible production content, write these JSON files back to Firestore documents:

- `site_config/content`
- `site_config/settings`
