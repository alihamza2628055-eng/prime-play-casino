# Prime Play Casino — non-transactional web app

This starter contains two separate Next.js apps that can be deployed as separate Vercel projects:

- `player/` — player-facing game directory, account sign-in, inquiry form and player/admin messaging.
- `admin/` — separate admin sign-in and inquiry/message dashboard.
- `supabase/schema.sql` — database tables, triggers and Row Level Security policies.

This version is an informational game directory and customer-support inquiry system. Payment-method names are displayed as unavailable; it does not accept deposits, process payments, issue redeemable rewards, or operate wagering.

## 1. Create the Supabase project

1. Create a project at https://supabase.com.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In Authentication settings, enable Email/Password.
4. Create your own admin user through the player app's sign-up page or Supabase Authentication.
5. In Supabase SQL Editor, promote that account to admin (replace the email):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
);
```

Only do this for your own trusted account.

## 2. Environment variables

Copy `.env.example` to `.env.local` in BOTH `player/` and `admin/`.

Use the same Supabase project URL and anon/publishable key in both apps:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never put the Supabase service-role key in a browser app or commit it to GitHub.

## 3. Run locally

In each folder:

```bash
npm install
npm run dev
```

Player app: http://localhost:3000  
Admin app: http://localhost:3001 (run `npm run dev -- --port 3001`)

## 4. Deploy separately to Vercel

Import the same Git repository twice:

- First project Root Directory: `player`
- Second project Root Directory: `admin`

Add the two Supabase environment variables to each Vercel project.

## Included functionality

- Player email/password registration and login
- Unique player profile created automatically
- Supplied game names and destination links in a searchable-style directory
- Inquiry form: selected game, player name/email and message
- Payment-method information panel with unavailable status only
- Admin-only inquiry dashboard
- Admin reply to player inquiries
- Player inbox to read admin replies

## Important setup notes

- This is a starter implementation. Add your own verified domain, privacy notice, terms, abuse controls and production monitoring before public launch.
- The game links are external destinations supplied by the site owner. Check each destination, age requirements, geographic availability and applicable permissions before displaying it.
- Browser push notifications, image uploads, friend lists, group chat and live presence are not included in this first runnable code drop; they require additional storage, push-provider and moderation setup.
