## Change: Replace calendar with prequalification survey on `/revenue-architecture-session`

**File:** `src/pages/RevenueArchitectureSession.tsx`

1. **Replace the calendar iframe section** with the GHL survey iframe:
   ```html
   <iframe
     src="https://link.drromulusmba.com/widget/survey/GvfGdLT5pjd7yHbIYeWu"
     style={{ border: 'none', width: '100%' }}
     scrolling="no"
     id="GvfGdLT5pjd7yHbIYeWu"
     title="Revenue Architecture Session – Prequalification Survey"
   />
   ```
   - Dynamically inject `https://link.drromulusmba.com/js/form_embed.js` once via `useEffect` (so it auto-resizes the iframe).
   - Keep the section wrapper, heading, and ID (`#booking` or equivalent) so existing anchor scrolling still works.
   - Update the section heading copy to reflect prequalification (e.g., "Apply for a Revenue Architecture Session") instead of "Schedule / Book".

2. **CTA buttons** on the page:
   - Keep the existing `scrollToBooking` behavior (scrolls to the survey section — which now hosts the survey instead of the calendar).
   - Keep the existing `trackMetaWithCapi("Lead", …)` fire on click — no changes to tracking wiring.
   - `ViewContent` on mount stays as-is.

3. **No other pages touched.** Preorder CTAs, PageViewTracker, tracking.ts, and edge function all remain untouched.

### Notes
- The GHL `form_embed.js` script auto-adjusts iframe height, so no fixed pixel height is needed (unlike the previous 1400px calendar wrapper).
- Script is injected in `useEffect` with a guard to prevent duplicate insertion on re-render.
