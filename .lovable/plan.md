

# Fix: Admin Portal Client Visibility

## Problem
Two issues prevent the admin from seeing/creating portal clients:

1. **Expired auth session** — console shows `Refresh Token Not Found`. User must re-login.
2. **Profiles RLS blocks admin queries** — The `createClient` mutation queries `profiles` by email to find the user_id, but `profiles` only has a SELECT policy for `auth.uid() = id`. Admins cannot look up other users' profiles.

## Solution

### Database Migration
Add an RLS policy on `profiles` allowing admins to read all profiles:

```sql
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
```

This is safe — admins already have full access to `portal_clients`, `user_roles`, etc. The `profiles` table only contains `id`, `email`, `full_name`, `avatar_url`.

### No Code Changes Required
The `PortalClients.tsx` component and query logic are correct. Once the RLS policy is added and the admin re-authenticates, everything will work.

## What This Does NOT Touch
- No existing RLS policies modified or removed
- No existing pages, routes, or components changed
- Only adds one new SELECT policy to `profiles`

