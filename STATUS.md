# Prime Play Casino — status

## Extracted
`~/workspace/prime-play-casino/` — from `~/workspace/user/files/prime-play-casino-vercel-starter.zip` (14 KB, 21 files, 2026-11-24).

## What the starter is
A scoped, NON-TRANSACTIONAL starter, same pattern as Destiny Gameroom. The README states it plainly: an informational game directory and customer-support inquiry system. Payment-method names are displayed as unavailable. No deposits, no payment processing, no redeemable rewards, no wagering.

## Build verification (2026-11-24, local, Node + Next.js 14.2.15)
- `player/`: `npm install` OK (36 packages). `npm run build` FAILS without env vars (`supabaseUrl is required` at prerender, because the Supabase client is created eagerly at import time). With placeholder env vars it builds CLEAN: route `/` 69.2 kB, First Load 157 kB.
- `admin/`: same. Builds CLEAN with placeholder env vars: route `/` 67.7 kB, First Load 155 kB.
- Conclusion: the code compiles and renders. The build failure without env vars is a missing-config failure, not a code bug. It will build on Vercel once the two Supabase env vars are set.

## What is implemented
- Player app: email/password sign-up and login (Supabase Auth), unique player profile auto-created on sign-up (player_id `PP-XXXXXXXX`), game directory with all 54 titles from the brief and their exact destination URLs (no duplicates found), external links open in a new tab with a "not operated by Prime Play" note, inquiry form (game, name, email, message), 8 payment methods each shown as "Currently Unavailable", player inbox showing own inquiries and admin replies.
- Admin app: admin sign-in, role check against `profiles.role` (non-admins are refused), inquiry list, admin reply (stored in `support_messages` + `admin_reply` on the inquiry), close inquiry.
- Database (`supabase/schema.sql`, 132 lines): `profiles`, `inquiries`, `support_messages`, auto-profile trigger, `is_admin()` function, RLS policies. Design: dark navy `#080b14` with gold `#e9b96b` accents, glass-style cards, hover lift, responsive (single column under 650px).

## Gap vs. the master prompt (NOT in this starter)
The README is explicit that these are not included and need a second phase: friends and friend requests, private groups and group chat, live online presence, browser push notifications, image attachments/uploads, seasonal themes, announcements, admin game-directory management (add/edit/disable/reorder games), dashboard analytics (totals, online count, unread messages). The schema has 3 of the 11 tables the prompt lists.

## Blockers (need the user)
1. No Supabase project exists and there is no Supabase connector here. The user must create a Supabase project, run `supabase/schema.sql` in the SQL Editor, enable Email/Password auth, and provide `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Never the service-role key.
2. Deployment: Vercel via the GitHub-import dashboard route (proven route from the chatbot; the Vercel API connection cannot do team operations). Two Vercel projects from one repo: Root Directory `player`, then Root Directory `admin`, each with the two env vars.
3. Admin account: create an account through the player sign-up page, then promote it with the SQL in the README (replace with your own email).

## Decision needed from the user
Deploy the starter as-is once Supabase is ready, or build the missing Phase 5 features (friends, groups, presence, push, seasonal themes, announcements, game management) before deployment?

## Deployment decision (2026-11-24 ~02:21 CST)
User confirmed: deploy Prime Play as-is, and ONLY Prime Play, not Destiny Gameroom. Destiny stays untouched.
- Local git repo initialized and committed (commit 45bc03c, "Prime Play Casino starter: player and admin apps, Supabase schema"). No remote yet.
- `gh` CLI is present but NOT logged in to any GitHub host, so the repo cannot be pushed from here. GitHub repo creation + push needs the user's GitHub sign-in in the browser (same route as the chatbot repo).
- Deployment checklist (in order): (1) user creates Supabase project, runs schema.sql, enables Email/Password auth, provides URL + anon key; (2) GitHub repo created and code pushed; (3) two Vercel projects via dashboard GitHub import (Root Directory `player`, then `admin`), each with the two Supabase env vars; (4) admin account created via player sign-up, promoted with the README SQL; (5) live test: sign up, sign in, submit inquiry, admin reply, player reads reply.


## Standing rules carried over
- No real-money features, no deposits, withdrawals, wagering or cash rewards, until licensing and legal approval are confirmed.
- Do not claim a feature works until it has been tested live. Do not deploy anything the user has not approved as a bounded step.
