
Move "Trusted Strategist" card back to top-right of the portrait frame, but position it OUTSIDE the frame edge (not overlapping the face). Keep "Ed.D. & MBA" card at bottom-left.

### Change to `src/components/home/HeroSection.tsx`

Update the Trusted Strategist card positioning:
- From: `-bottom-4 -right-6` (bottom-right)
- To: `-top-4 -right-6` (top-right, sitting just outside the frame's top-right corner)

This places it above and slightly outside the frame, decorating the corner without overlapping the portrait/face inside.

Ed.D. & MBA card stays at `-bottom-4 -left-6` for balanced composition (top-right + bottom-left diagonal).
