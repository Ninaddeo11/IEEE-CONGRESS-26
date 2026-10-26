# IEEE Pune Section Student Congress 2026

Responsive event website and registration portal for the one-day, in-person IEEE Pune Section Student Congress on October 31, 2026.

## Stack

- Vite, React 18, TypeScript (strict), React Router
- Tailwind CSS, with a responsive custom visual system
- Supabase Postgres, RLS, Realtime and Auth for administration
- React Hook Form + Zod, TanStack Query, Framer Motion

## Local development

Requirements: Node.js 20+ and npm.

```sh
npm install
cp .env.example .env.local
npm run dev
```

The site can be browsed without Supabase configuration. Live seats, registration and admin sign-in stay disabled until both public Vite variables are set.

## Supabase setup

1. Create a Supabase project.
2. Open the SQL editor and run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
3. Run [`supabase/seed.sql`](./supabase/seed.sql) to add the five tracks and three workshops.
4. In Supabase Authentication, create an administrator using email and password.
5. Add that Auth user's UUID to the admin allowlist:

   ```sql
   insert into public.admins (user_id)
   values ('REPLACE_WITH_AUTH_USER_UUID');
   ```

6. Copy the project URL and anon/public key into `.env.local`:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

7. Start the app with `npm run dev`. The admin dashboard is at `/admin`.

The anon key is designed to be public; never use a Supabase service-role key in the browser or commit private keys. Registration writes are only through the `register_student` database function. It locks the chosen track and workshop rows, checks remaining capacity and inserts the registration in one transaction. RLS and table grants prevent anonymous reads/inserts on personal registration data. Public users can read track/workshop availability only.

## Build, lint and deploy

```sh
npm run lint
npm run build
npm run preview
```

The Vite output is a static SPA in `dist/`. `vercel.json` rewrites client-side routes to the SPA entry. For Netlify, configure an equivalent `/* /index.html 200` rewrite. Set the two `VITE_SUPABASE_*` environment variables in the deployment provider before building.

## Capacity concurrency test

This test makes real registrations. Use a disposable Supabase project or test track/workshop, apply the migration and seed, and ensure the chosen track has exactly five seats left and the workshop has at least five. Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `TEST_TRACK_SLUG` and `TEST_WORKSHOP_SLUG` in the environment, then run:

```sh
npm run test:concurrency
```

It fires 80 concurrent RPC calls and verifies five successes, 75 `TRACK_FULL` rejections, the exact capacity count, and rejection of anonymous registration `SELECT` and `INSERT`. The five successful test registrations remain in the database; reset the disposable project before production use. Test this against a non-production Supabase project only.

## Pages and remaining event details

Routes include the home page, agenda, track and workshop listings, track details, Origin Stories, speakers, team, registration and ticket confirmation, FAQ, contact and admin dashboard. Track and workshop counts update through Supabase Realtime. The admin view includes fill bars, editable capacities, search/filter, CSV export and attendee check-in.

The logo, venue, speaker photos and full biographies, founder names, organizing team names and sponsor identities are placeholders pending details from the organizers. No registration confirmation email is sent yet.
