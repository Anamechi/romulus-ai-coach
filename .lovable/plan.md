

## Add Citation Picker to Blog & Q&A Editors

### What This Does
Adds a new "Citations" tab inside the Blog Article and Q&A Page edit dialogs. This lets you attach outbound citations from your citation library directly to individual content pages -- the missing link that connects your 28 authority sources to published content.

### Changes

**1. New Component: `src/components/admin/CitationPicker.tsx`**
A reusable citation picker panel that:
- Shows all active citations from the `citations` table
- Displays which citations are already attached (with remove button)
- Has a search/filter input to find citations by title or source name
- Shows Domain Authority badges for quick quality assessment
- Attach/detach with a single click

**2. Update `src/pages/admin/Articles.tsx`**
- Add a 5th tab called "Citations" (visible only when editing an existing post)
- Import and render `CitationPicker` with `contentType="blog_post"` and `contentId={editingPost.id}`
- Uses the existing `useBlogPostCitations`, `useAddBlogPostCitation`, and `useRemoveBlogPostCitation` hooks

**3. Update `src/pages/admin/QAPages.tsx`**
- Add a new "Citations" tab inside the edit dialog (visible only when editing)
- Import and render `CitationPicker` with `contentType="qa_page"` and `contentId={editingQA.id}`
- Requires new hooks: `useQAPageCitations`, `useAddQAPageCitation`, `useRemoveQAPageCitation`

**4. Add Q&A Citation Hooks to `src/hooks/useCitations.ts`**
- Add `useQAPageCitations(qaPageId)` -- queries a new `qa_page_citations` join table
- Add `useAddQAPageCitation()` and `useRemoveQAPageCitation()`

**5. Database Migration: Create `qa_page_citations` table**
- Mirrors the existing `blog_post_citations` and `faq_citations` pattern
- Columns: `id`, `qa_page_id` (UUID), `citation_id` (UUID), `sort_order`, `created_at`
- RLS: Admin full access, public read

### How to Use It (After Build)

1. Go to **Admin > Blog Articles** (or **Q&A Pages**)
2. Click the edit (pencil) icon on any article
3. In the edit dialog, click the **"Citations"** tab
4. You will see your full citation library with search
5. Click **"Attach"** next to any citation to link it to that article
6. Click the red **X** to remove a citation
7. Save the article -- the citations are linked instantly (no extra save needed)

### Technical Details
- The `CitationPicker` component manages its own state via React Query hooks, so attaching/detaching citations is immediate and independent of the main form save
- The existing `blog_post_citations` and `faq_citations` tables are already in place; only `qa_page_citations` needs to be created
- No existing files are modified beyond adding the new tab to the two editor dialogs

