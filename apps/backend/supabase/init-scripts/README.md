# Supabase Init Scripts

This directory contains SQL files executed automatically when you run `supabase start`.

- `roles.sql` updates the default service roles with the password from the `POSTGRES_PASSWORD` environment variable. It mirrors the official script from the [Supabase](https://github.com/supabase/supabase) repository.

You can add additional `.sql` files here to customize the initial state of the local database.
