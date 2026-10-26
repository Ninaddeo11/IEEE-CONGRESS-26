# Supabase setup

The public registration page uses the Supabase **anon** key from `supabase-config.js`. That key is intended to be visible in browser code; row-level security in `supabase/schema.sql` protects registration records. Never put a database password or service-role key in this repository or browser code.

## Create the table and access policies

1. Open the Supabase project `njlowyjrqxryzondenri`.
2. In **SQL Editor**, run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
3. Keep row-level security enabled on `public.registrations`.

The public website can insert registrations. Only signed-in users whose `app_metadata.role` is `admin` can read them.

## Create an admin login

1. In **Authentication → Users**, create an organizer user with an email and a unique password.
2. In **Authentication → Providers → Email**, disable public sign-ups if only organizers should be able to create accounts.
3. In **SQL Editor**, replace the email below and run:

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'organizer@example.com';
   ```

4. Confirm that one user was updated. Sign in at `/admin` with that account. If it was already signed in, sign out and back in so the updated role is included in its session.

## Credential safety

The service-role key and database password were shared in chat. Treat them as exposed: rotate the Supabase JWT signing secret (which invalidates legacy anon/service-role JWT keys) and change the database password before relying on this project. After rotating the signing secret, replace the anon key in `supabase-config.js` with the new publishable/anon key from Supabase. The browser only needs that public key. Do not configure the service-role key as a Vercel browser environment variable or commit it to Git.
