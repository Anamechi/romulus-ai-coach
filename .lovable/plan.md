

# Replace Payment Link Placeholder

## Change
Update the `PAYMENT_URL` constant in `src/pages/DiagnosticKit.tsx` from the placeholder value to the actual GHL payment link.

## Technical Detail

In `src/pages/DiagnosticKit.tsx`, line 12:

**Before:**
```
const PAYMENT_URL = "#PASTE_GHL_PAYMENT_LINK_HERE";
```

**After:**
```
const PAYMENT_URL = "https://link.drromulusmba.com/payment-link/69939e59e6b9117c66e733dd";
```

This single change connects both CTA buttons (Hero and Final CTA) to the live checkout.

