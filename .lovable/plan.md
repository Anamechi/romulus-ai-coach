

# Fix: Contact Form Not Displaying

## Problem Identified
The GoHighLevel `form_embed.js` script is injecting CSS that hides the form iframe:
- Sets `.ep-iFrameContainer { display: none }`
- Sets container elements to `opacity: 0; visibility: hidden`

## Solution

### 1. Remove the External Script
Delete the `useEffect` hook that loads `form_embed.js` - this script is meant for popup/modal forms and conflicts with inline iframe embeds.

### 2. Keep the Iframe Only
The iframe will load and display the form correctly without the external JavaScript. The `data-layout="{'id':'INLINE'}"` attribute tells GHL to display inline, which works natively without the embed script.

## File Changes

**`src/pages/Contact.tsx`**
- Remove lines 8-22 (the `useEffect` hook that loads `form_embed.js`)
- Remove the `useEffect` import if no longer needed
- Keep the iframe exactly as-is

## Technical Details
- The iframe `src` directly loads the form from GHL servers
- All `data-*` attributes are processed by GHL's internal form code
- The external `form_embed.js` is only required for popup/slide-in forms, not inline iframes

## Expected Result
The contact form will display immediately under the "Send a Message" header within the styled container.

