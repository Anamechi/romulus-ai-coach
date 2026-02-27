

## Implement Unified @graph Schema Update

### Overview
Replace the three separate JSON-LD blocks on the homepage with a single unified `@graph` array, update the site name constant, and expand social profiles across the codebase.

### Step 1: Update `src/pages/Index.tsx`
- Remove imports of `OrganizationSchema`, `WebSiteSchema`, `PersonSchema` from StructuredData
- Remove the old inline `personSchema` constant (lines 10-66)
- Remove the three separate schema component calls (`<OrganizationSchema />`, `<WebSiteSchema />`, inline `<Helmet>`)
- Add a single `homepageSchema` constant with the unified `@graph` array containing Person, Organization, and WebSite nodes with `@id` cross-references
- Render it in one `<Helmet>` block

### Step 2: Update `src/components/seo/StructuredData.tsx`
- Change `SITE_NAME` from `"Dr. Romulus MBA"` to `"Dr. Deanna Romulus"`
- Expand `PersonSchema` sameAs from LinkedIn-only to all 9 social profiles (Instagram, TikTok, YouTube, Facebook, Threads, X, Pinterest, LinkedIn, Bluesky)
- All other schema components (Article, FAQ, Breadcrumb, Service) remain unchanged -- they inherit the updated `SITE_NAME`

### Step 3: Update `src/pages/About.tsx`
- Update the inline `personSchema` sameAs array to include all 9 social profiles (matching the homepage)

### No Changes To
- `index.html` (favicon references already correct)
- `SEOHead.tsx` (OG image stays as `og-image.jpg`)
- Edge functions (prerender already uses correct logo URL)
- Any existing E-E-A-T data on the About page (credentials, expertise, alumni all preserved)

