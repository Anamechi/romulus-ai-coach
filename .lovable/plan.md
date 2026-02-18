

## Bulk-Attach Authority Sources as Outbound Citations

### Current State
- **28 authority sources** configured (12 Primary, 16 Secondary) across 6 categories
- **0 citations** in the `citations` table (which the Citation Picker uses)
- **0 attachments** in `blog_post_citations` or `qa_page_citations`
- **12 published blog posts** across 3 topics
- **15 published Q&A pages** across 2 topics

### What This Does
Creates a backend function that:
1. Seeds the `citations` table from your `authority_sources` (so they appear in the Citation Picker going forward)
2. Bulk-attaches 3-4 relevant citations to each of the 27 published content pages using smart topic-to-category matching

### Smart Topic-Category Matching

| Content Topic | Authority Categories Matched | Example Sources |
|---|---|---|
| Automation, AI & Operational Systems | AI_Automation, Tech_Security | OpenAI, Google AI Blog, Zapier, AWS, Cloudflare |
| Education, Leadership & Sustainable Growth | Business_Leadership, Data_Research | Forbes, HBR, SBA, World Economic Forum |
| Financial Self-Efficacy & Decision-Making | Business_Leadership, Data_Research, Explainers | IRS, Investopedia, Bureau of Labor Statistics |
| Business Structure & Credibility Foundations | Business_Leadership, Data_Research | SBA, Forbes, Entrepreneur, OECD |
| Client Acquisition & Offer Infrastructure | Business_Leadership, AI_Automation | McKinsey, HBR, Inc., Zapier |

Each content page gets **3-4 citations** (prioritizing Primary sources first, then Secondary).

### Changes

**1. New Edge Function: `supabase/functions/bulk-attach-citations/index.ts`**
- Reads all active authority sources
- Creates corresponding records in the `citations` table (skipping duplicates by URL)
- Fetches all published blog posts and Q&A pages with their topic names
- Maps each topic to relevant authority categories
- Inserts `blog_post_citations` and `qa_page_citations` records (3-4 per content page)
- Returns a summary: how many citations created, how many attachments made

**2. New Admin Button: `src/pages/admin/Citations.tsx`**
- Add a "Bulk Attach to All Content" button at the top of the Citations admin page
- Calls the edge function and shows a progress toast
- Displays results (e.g., "Attached 94 citations across 27 pages")

### Expected Results After Running
- **~28 citations** seeded in the citations table (visible in Citation Picker)
- **~36-48 blog post citation links** (12 posts x 3-4 each)
- **~45-60 Q&A page citation links** (15 pages x 3-4 each)
- **Total: ~80-108 outbound authority links** across all published content

### How to Use
1. Go to **Admin > Citations**
2. Click the **"Bulk Attach to All Content"** button
3. Wait for the confirmation toast
4. Visit any blog post or Q&A page edit dialog and check the Citations tab to verify

### Technical Details
- The edge function is idempotent: running it twice won't create duplicate citations or attachments
- Uses `ON CONFLICT DO NOTHING` for safe re-runs
- Priority: Primary trust-level sources are attached first, then Secondary to fill remaining slots
- The seeded citations use the authority source's domain as the URL (`https://domain`) and name as the title
