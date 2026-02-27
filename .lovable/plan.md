

## Favicon and Identity Optimization

### Overview
Download the provided favicon source image, generate properly sized local copies, update all HTML and structured data references, and remove any legacy/default favicon declarations.

### Important Note on OG Image
The site already has a proper branded OG image (`og-image.jpg`) configured in `SEOHead.tsx` and `index.html`. Using a 64px favicon as the OG/Twitter image would significantly degrade social sharing quality (recommended minimum is 1200x630). The current `og-image.jpg` will be preserved. If you'd like a new full-size OG image, that can be handled separately.

### Step 1: Download and Generate Favicon Files

Fetch the source image from the provided Filesafe CDN URL and save locally as:
- `public/favicon-32.png` (32x32)
- `public/favicon-64.png` (64x64)
- `public/apple-touch-icon.png` (180x180)

The existing `public/favicon.png`, `public/favicon.svg`, and `public/favicon.ico` will be removed.

### Step 2: Update `index.html` Favicon References

**Replace** lines 47-51 with:

```html
<!-- Favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
```

This removes:
- SVG favicon reference
- Old PNG favicon reference
- ICO favicon reference
- Duplicate apple-touch-icon declaration

### Step 3: Update Organization Schema Logo

In `src/components/seo/StructuredData.tsx`, line 14, change:

```typescript
// FROM:
"logo": `${BASE_URL}/logo.png`,
// TO:
"logo": `${BASE_URL}/favicon-64.png`,
```

### Step 4: Clean Up Old Favicon Files

Delete:
- `public/favicon.svg`
- `public/favicon.ico`
- `public/favicon.png`

### Step 5: Verify

After deployment, confirm:
- `/favicon-32.png` loads
- `/favicon-64.png` loads
- `/apple-touch-icon.png` loads
- No SVG/ICO/Lovable default favicon references remain
- No Filesafe CDN references in code
- Organization schema uses local favicon-64.png as logo

### Files Changed
| File | Action |
|------|--------|
| `public/favicon-32.png` | Create (from source) |
| `public/favicon-64.png` | Create (from source) |
| `public/apple-touch-icon.png` | Create (from source) |
| `index.html` | Update favicon links |
| `src/components/seo/StructuredData.tsx` | Update logo URL |
| `public/favicon.svg` | Delete |
| `public/favicon.ico` | Delete |
| `public/favicon.png` | Delete |

