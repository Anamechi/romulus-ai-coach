

## Unify Site Name to "Dr. Deanna Romulus"

Two edits to eliminate the last site name inconsistencies.

### Change 1: `src/components/seo/SEOHead.tsx`
- Line 17: Change `SITE_NAME` from `"Dr. Romulus MBA"` to `"Dr. Deanna Romulus"`
- This flows into every page's `<title>` suffix and `og:site_name`

### Change 2: `index.html`
- Line 22: Change `og:site_name` from `"Dr. Romulus MBA"` to `"Dr. Deanna Romulus"`

### Confirmation After Deploy
All references will use `"Dr. Deanna Romulus"`:
- `index.html` og:site_name
- `SEOHead.tsx` SITE_NAME (controls all page titles + OG tags)
- `StructuredData.tsx` SITE_NAME (already updated)
- Homepage `@graph` JSON-LD (already correct)

No other files contain "Dr. Romulus MBA".

