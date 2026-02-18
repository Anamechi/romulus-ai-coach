

## Dashboard Fixes: Phase Progress + Q&A Stats

### Problem 1: Phase 10 Shows "Up Next" Despite Being Complete
The Build Progress section is a **hardcoded list** in `Dashboard.tsx`. Phase 10 ("SEO/Sitemap Hardening") is set to `status: 'next', progress: 0` — this never updates automatically. Given all the SEO work completed (sitemaps, structured data, IndexNow, prerendering, speakable schema), this should be marked complete.

**Fix:** Update the hardcoded phase list to mark Phase 10 as complete with 100% progress.

### Problem 2: Missing Q&A Pages from Dashboard Stats
The stats grid shows Blog Articles, FAQs, Leads, and Applications — but **Q&A Pages are missing** despite being a major content type (you have 30+ published Q&A pages).

**Fix:** Add a Q&A Pages stat card to the dashboard and update the `useDashboardStats` hook to fetch Q&A page counts.

### Changes

**`src/hooks/useDashboardStats.ts`:**
- Add Q&A pages query (`qa_pages` table, count total and published)
- Return `qaPages: { total, published }` in the stats object

**`src/pages/admin/Dashboard.tsx`:**
- Update Phase 10 from `status: 'next', progress: 0` to `status: 'complete', progress: 100`
- Add a Q&A Pages stat card with a `MessageSquare` or similar icon linking to `/admin/qa-pages`
- Reorder stat cards to: Blog Articles, FAQs, Q&A Pages, Leads, Applications (5 cards)

### Technical Details

The stat grid currently uses `lg:grid-cols-4`. With 5 cards, we can switch to `lg:grid-cols-5` or keep 4 columns and let the 5th wrap naturally.

