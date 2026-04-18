
The user is referring to a purple/dark gradient still showing on the home page hero section. Looking at HeroSection.tsx, the section uses `bg-hero-gradient` which is the dark slate/charcoal background. The "purple" they're seeing is likely the dark hero background behind the transparent PNG portrait.

Looking at the current HeroSection:
- Section background: `bg-hero-gradient` (dark slate)
- The transparent PNG sits directly on this dark background
- No container/frame around the image — just floats on the dark hero

On the About page we already fixed this by giving the image a lighter `bg-gradient-to-br from-muted via-cream/40 to-muted/60` container with rounded frame.

The home hero, however, is intentionally dark (matches the headline "Inconsistent Income Is a Systems Problem" in cream text on dark). The user's "purple" complaint is likely about the dark backdrop bleeding behind the portrait making it look out of place — OR specifically the gold/purple-toned glows behind the figure.

Two reasonable interpretations:
1. They want the image area itself lifted into a lighter framed container (like About page)
2. They want the dark hero gradient itself replaced/lightened

Given recent feedback pattern (About page got a light cream frame around portrait), the most likely fix is: **wrap the home hero portrait in the same light cream rounded frame** so the portrait reads cleanly without the dark backdrop showing through.

I'll propose option 1 as primary, with a quick clarifier only if needed. Actually — the user said "the purple is still there" implying we already attempted a fix. Let me just propose the cleanest fix: give the home hero portrait the same light framed treatment the About page received, eliminating the dark/purple bleed behind the figure.

## Plan: Remove Dark Backdrop Behind Home Hero Portrait

**Problem**: The transparent PNG portrait on the home hero floats directly on the dark `bg-hero-gradient`, causing the dark slate/purple tone to show through behind Dr. Romulus and around her silhouette edges.

**Fix**: Apply the same premium light-framed container used on the About page so the portrait sits in a clean cream/muted frame instead of bleeding into the dark hero background.

### Changes to `src/components/home/HeroSection.tsx`

1. **Wrap the portrait** in a framed container:
   - `aspect-[4/5]` rounded container
   - Background: `bg-gradient-to-br from-cream via-cream/80 to-muted/60`
   - `rounded-2xl overflow-hidden` to crop cleanly
   - Keep the gold ambient glows inside the frame (not bleeding into hero)

2. **Reposition the portrait** inside the frame:
   - `absolute inset-x-0 bottom-0 mx-auto h-[95%] w-auto object-contain`
   - Matches About page treatment

3. **Keep floating credential cards** outside the frame with `z-20` so they overlap the frame edges for the editorial look.

4. **Preserve** the dark hero gradient on the rest of the section (headline side stays dark cream-on-slate — that's correct brand).

### Result
- Left side: dark hero with cream headline + gold CTA (unchanged)
- Right side: Dr. Romulus in a clean light-cream rounded frame, no purple/dark bleeding through behind her
- Floating cards still pop off the frame edges

No other files need changes. No memory updates needed.
