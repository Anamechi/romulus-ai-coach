

# Client Invitation Flow

## Overview
Add an "Invite Client" flow to the admin Portal Clients page that creates a user account, portal_clients record, and sends a magic link -- all in one step.

## Architecture

### New Edge Function: `invite-portal-client`
An edge function that uses the Supabase Admin API (service role key) to:
1. Create a new auth user with `supabase.auth.admin.createUser()` using `email_confirm: true` (auto-confirms email)
2. Insert a `portal_clients` record linked to the new user
3. Generate a magic link via `supabase.auth.admin.generateLink({ type: 'magiclink' })` and return it
4. Alternatively, use `supabase.auth.admin.inviteUserByEmail()` which sends an invite email automatically

The function requires admin authentication (checks `has_role` for the calling user).

### Approach: `inviteUserByEmail`
This is the cleanest path. The edge function will:
1. Call `supabase.auth.admin.inviteUserByEmail(email, { redirectTo })` -- this creates the user AND sends an invite email in one call
2. Get the created user's ID from the response
3. Insert a `portal_clients` record with the provided tier/phase
4. Return success

The invited user receives an email with a login link. When they click it, they land on the auth page, get auto-logged in, and the existing `routeAfterAuth` logic routes them to `/portal/dashboard`.

### UI Changes: `PortalClients.tsx`
Replace the current "Add Client" dialog with an "Invite Client" dialog:
- Same fields: email, name, tier, program phase
- Instead of requiring the user to already have an account, the system creates one
- Shows success message with instructions that an invite email was sent
- Remove the profile lookup logic (no longer needed since we create the account)

### Config Changes
- Add `[functions.invite-portal-client]` with `verify_jwt = false` to `supabase/config.toml`
- The function validates admin role internally using the auth header

### Files to Create/Edit
| File | Action |
|------|--------|
| `supabase/functions/invite-portal-client/index.ts` | Create -- edge function |
| `src/pages/admin/PortalClients.tsx` | Edit -- update dialog to use invite flow |
| `supabase/config.toml` | Auto-updated with new function entry |

### No Database Changes Required
The existing `portal_clients` table and `profiles` trigger (`handle_new_user`) handle everything. When the admin API creates a user, the trigger auto-creates the profile row.

