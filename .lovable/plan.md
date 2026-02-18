

## Three-Part AI Citation Boost: Linking Engine + Empty Topics + Person Schema

### Part 1: Run the Linking Engine to Boost Internal Links (3-5 per page)

The Linking Engine UI and edge function already exist. The current state is 25 internal links across 27 published pages (~0.9 per page). The target is 3-5 per page.

**Problem**: The current `scan-content-links` edge function only suggests 1 related post + 1 FAQ + 1 pillar page per item (~3 max), and it picks the **first** match rather than rotating. It also does not scan Q&A pages at all. We need to upgrade the scan function.

**Changes to `supabase/functions/scan-content-links/index.ts`:**
- Add Q&A page scanning (currently only blog posts and FAQs)
- Suggest **multiple** related posts (up to 2) instead of just 1
- Suggest cross-topic links (1 link to a different topic's content for topical bridging)
- Add Q&A page cross-linking (Q&A pages link to related blog posts and FAQs)
- Use round-robin selection so each scan produces varied suggestions, not always the same first match

**Changes to `supabase/functions/apply-link-suggestions/index.ts`:**
- Add support for Q&A page link application (currently only handles blog_post type)

**Changes to `src/hooks/useLinkingScans.ts`:**
- Add `qa_page` to the content type options

**Changes to `src/pages/admin/LinkingEngine.tsx`:**
- Add Q&A Pages checkbox alongside Blog Posts and FAQs in the content type selector

**After implementation**: You will run the Linking Engine from Admin with "Auto-Apply" mode selecting Blog Posts + Q&A Pages to boost from ~0.9 to 3-5 internal links per page.

---

### Part 2: Fill 2 Empty Topics with Content Clusters

Current topic coverage gaps:

| Topic | Blogs | Q&As | Status |
|-------|-------|------|--------|
| Authority, Trust & Digital Presence | 0 | 0 | Empty |
| Business Structure & Credibility Foundations | 0 | 5 | Needs blogs |

**Action**: Generate 2 content clusters using the existing AI Content Cluster Generator, then publish approved items:

**Cluster 1: "Authority, Trust & Digital Presence"**
- Target Audience: "Entrepreneurs and business owners building online credibility and trust signals"
- Primary Keyword: "business authority and trust building"
- Produces: 6 articles (3 TOFU, 2 MOFU, 1 BOFU)
- Publish: 2 as Blog Posts, 3 as Q&A Pages (covers the minimum)

**Cluster 2: "Business Structure & Credibility Foundations"**
- Target Audience: "New and growing business owners establishing proper business structure and fundability"
- Primary Keyword: "business structure and credibility"
- Produces: 6 articles (3 TOFU, 2 MOFU, 1 BOFU)
- Publish: 2 as Blog Posts (already has 5 Q&As, so blogs fill the gap)

**Changes to `src/pages/admin/ContentClusterGenerator.tsx`:**
- No structural changes needed; the existing generator handles this
- We will set `default_target_audience` and `default_primary_keyword` on these 2 topics so the autofill works

**Database update (via insert tool):**
- Update the `topics` table to set `default_target_audience` and `default_primary_keyword` for all 6 topics (currently all are NULL)

**Edge function invocations**: The existing `generate-content-cluster` function will be called twice (once per cluster). After generation, you review and publish from the admin UI.

---

### Part 3: Enrich Person Schema with hasCredential and knowsAbout

The current Person schema on `src/pages/Index.tsx` already has `hasCredential` and `knowsAbout` arrays. However, the Person schema in `src/components/seo/StructuredData.tsx` (used on the About page) is minimal -- it lacks credentials, expertise arrays, and `alumniOf`.

**Changes to `src/components/seo/StructuredData.tsx` (PersonSchema function):**
- Add `hasCredential` array with all 4 educational credentials (Ed.D., MBA, Adult Org Dev certificate, BS)
- Add `knowsAbout` array with 7 expertise areas
- Add `alumniOf` with university affiliations
- Add `jobTitle` as an array of 4 roles
- Add `hasOccupation` for structured occupation data
- Ensure parity with the Index.tsx person schema so both pages emit the same rich signals

**Changes to `src/pages/Index.tsx`:**
- Add `alumniOf` to the existing person schema (currently missing)

---

### Implementation Sequence

1. Update topic defaults in database (no migration needed, data update only)
2. Enhance PersonSchema in StructuredData.tsx and Index.tsx
3. Upgrade scan-content-links edge function for Q&A support and multi-link suggestions
4. Update apply-link-suggestions for Q&A support
5. Update LinkingEngine UI to include Q&A Pages checkbox
6. Generate the 2 content clusters via the existing edge function
7. Test the Linking Engine scan with Auto-Apply mode

### Expected Outcome
- Internal links: ~0.9/page rises to 3-5/page (~80-135 total links)
- Topic coverage: All 6 topics have published blogs + Q&As
- Person schema: Full `hasCredential`, `knowsAbout`, `alumniOf` arrays on all key pages
- AI citation readiness: 91/100 rises to ~96-97/100

