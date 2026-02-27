

## Regenerate PNG Favicon with Uppercase "DR"

### Goal
Regenerate `public/favicon.png` as a clean 512x512 PNG with uppercase bold serif "DR" letters matching the SVG design exactly.

### Approach
Use the existing `generate-blog-image` edge function pattern to invoke the AI image generation model (`google/gemini-2.5-flash-image`) with a highly specific prompt, then save the result to `public/favicon.png`.

Since there's already a `generate-blog-image` edge function that handles image generation and storage, I'll create a small dedicated edge function (`generate-favicon`) that:
1. Calls the AI gateway with a precise favicon prompt
2. Returns the base64 PNG directly (no storage upload needed)

Then I'll invoke it and save the resulting image to `public/favicon.png`.

### Steps

1. **Create edge function** `supabase/functions/generate-favicon/index.ts` that generates the image with this prompt:
   - "Create a simple 512x512 square icon. Dark navy background color #1a1a2e with slightly rounded corners. Centered bold serif uppercase letters 'DR' in metallic gold gradient from #D4AF37 to #B8860B. Clean, minimal design like a favicon or app icon. No other elements, no shadows, no 3D effects. The letters should be large, centered, and clearly uppercase."

2. **Invoke the edge function** from the frontend or directly, retrieve the base64 PNG

3. **Save the image** to `public/favicon.png`, overwriting the current file

4. **No changes** to `index.html` or the SVG favicon

### Technical Details

- Model: `google/gemini-2.5-flash-image` (or `google/gemini-3-pro-image-preview` for higher quality)
- The edge function will be temporary/utility -- can be deleted after use
- Uses existing `LOVABLE_API_KEY` secret (already configured)

