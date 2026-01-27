
# Update Phone Number on Contact Page

## Change Summary
Update the business phone number from `+1 469-746-3460` to `+1 877-412-6215`.

## Technical Changes

### File: `src/pages/Contact.tsx`

**Line 99** - Update the phone link and display text:

```tsx
// Current:
<a href="tel:+14697463460" className="font-body text-muted-foreground hover:text-gold transition-colors">+1 469-746-3460</a>

// Updated to:
<a href="tel:+18774126215" className="font-body text-muted-foreground hover:text-gold transition-colors">+1 877-412-6215</a>
```

This updates both:
1. The `tel:` link href (for click-to-call functionality)
2. The visible display text

## Result
The Contact page will display the new toll-free phone number (+1 877-412-6215) with proper click-to-call functionality.
