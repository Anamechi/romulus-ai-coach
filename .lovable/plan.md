

# Phase 1: Client Portal Database Migration

## Confirmed Scope
Database-only changes. No existing pages, routes, or components will be modified.

## Migration SQL

A single migration will execute the following:

### Enums
- `client_tier`: `self_directed`, `strategic_coaching`, `private_consulting`
- `program_phase`: `clarity`, `systems`, `expansion`

### 13 Tables
All with `id uuid PK DEFAULT gen_random_uuid()`, RLS enabled:

1. **portal_clients** — user_id (refs auth.users CASCADE), name, email, tier, program_phase, onboarding_status default 'pending', stripe_customer_id, created_at, updated_at
2. **client_sessions** — client_id (refs portal_clients CASCADE), session_date, recording_link, recording_file_url, session_notes, action_items jsonb default '[]', created_at
3. **client_worksheets** — client_id, worksheet_name, responses_json jsonb default '{}', completion_date, pdf_download_link, file_url, created_at
4. **client_wins** — client_id, reflection_text, application_text, video_link, video_file_url, testimonial_permission default false, created_at
5. **client_milestones** — client_id, milestone_type, description, date, video_link, video_file_url, created_at
6. **portal_resources** — title, description, category, resource_link, file_url, created_at
7. **client_resource_access** — client_id, resource_id (refs portal_resources CASCADE), access_status default 'granted'
8. **client_messages** — client_id, sender, message_text, attachment_file_url, created_at (realtime enabled)
9. **portal_offers** — title, description, price numeric, link, category, created_at
10. **client_progress** — client_id (unique), authority/automation/revenue/acquisition_score int default 0, updated_at
11. **client_onboarding** — client_id, step_name, completed default false, completed_at
12. **portal_integrations** — service_name (unique), api_key, webhook_url, updated_at
13. **Storage bucket**: `client-files` (private)

### RLS Policy Pattern
- **Admin tables** (portal_integrations): `has_role(auth.uid(), 'admin')` for ALL
- **Client-owned tables** (sessions, worksheets, wins, milestones, messages, progress, onboarding, resource_access): Admin ALL + client SELECT/INSERT/UPDATE own via subquery `client_id IN (SELECT id FROM portal_clients WHERE user_id = auth.uid())`
- **portal_clients**: Admin ALL + client SELECT own row
- **Public-read tables** (portal_resources, portal_offers): Admin ALL + authenticated SELECT

### Triggers
- `update_updated_at_column()` on: portal_clients, client_progress, portal_integrations

### Realtime
- `ALTER PUBLICATION supabase_realtime ADD TABLE public.client_messages`

### Storage
- Create `client-files` private bucket
- Storage RLS: admin full access, clients can read/upload under their user_id prefix

## What This Does NOT Touch
- No existing tables modified
- No existing routes changed
- No existing components replaced
- Nothing visible on the website changes

## Post-Migration Deliverable
A schema summary listing all 13 tables, their relationships, RLS policies, and storage configuration for verification before Phase 2.

