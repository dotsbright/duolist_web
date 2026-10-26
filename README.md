# duolist_web

The public Duolist site: landing page, privacy policy, account-deletion flow.

Deployed by Vercel from this repo (public, so the free plan can link it) at
**https://duolist.dotsbright.com**. The domain is a CNAME from the Cloudflare
zone to Vercel; DNS is untouched by deploys.

The Android app, the Cloud Functions and the Firestore rules live in a separate
repo: `dotsbright/duolist`. Locally that repo usually sits beside this one, and
its `web` symlink points here.

## Rule that matters

**The privacy page tracks app behavior.** Anything that changes what the app
collects, sends or stores must be reflected in `app/privacy/page.tsx` in the
same breath. The page is a Play Store compliance surface, not marketing copy.

## Commands

```
just install   # yarn install
just dev       # local dev server
just build     # production build
just start     # serve the build
just lint
```

Env lives in `.env.local` (gitignored); `.env.local.example` lists the keys.

## Routes

| Route | Purpose |
|---|---|
| `/` | landing page |
| `/privacy` | privacy policy |
| `/delete-account` → `POST /api/request-delete` | emails a signed confirmation link |
| `/confirm-delete` → `POST /api/confirm-delete` | deletes the account and its data |

The admin console was removed on 26-10-2026 — with the app free there was
nothing left to administer.
