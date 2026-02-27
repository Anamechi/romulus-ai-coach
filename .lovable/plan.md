

## Generate a Proper PNG Favicon

### Goal
Create a properly formatted PNG favicon image (the "DR" gold-on-navy design) and save it to `public/favicon.png` -- without changing the SVG or any `index.html` references. This PNG is for the user to download and use elsewhere.

### Approach
Use the Lovable AI image generation model (`google/gemini-2.5-flash-image`) via an edge function to generate a clean 512x512 PNG matching the existing SVG design:
- Dark navy background (#1a1a2e) with rounded corners
- Bold serif "DR" letters in gold gradient (#D4AF37 to #B8860B)
- Square aspect ratio, no white bars or artifacts

### Steps

1. **Generate the PNG** using AI image generation with a precise prompt describing the favicon design
2. **Save to `public/favicon.png`** -- overwriting the current broken file
3. **No changes to `index.html`** or the SVG favicon -- the PNG link already exists as a fallback and the user can grab the file for external use

