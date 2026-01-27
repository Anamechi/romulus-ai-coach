
# Remove Scrollbar from Contact Form

## Problem
The GHL contact form iframe is set to 762px height, but the actual form content is taller, causing an internal scrollbar that requires visitors to scroll within the iframe to see the entire form.

## Solution
Increase the iframe height to accommodate the full form content without scrolling. Based on typical GHL contact forms with multiple fields, a height of approximately **900-1000px** should display the entire form.

## Technical Changes

### File: `src/pages/Contact.tsx`

Update height values in 3 locations:

1. **Container div** (line 54): Change `minHeight` from `762px` to `1000px`
2. **Loading placeholder div** (line 57): Change `h-[762px]` to `h-[1000px]`  
3. **Iframe inline style** (line 83): Change `height: "762px"` to `height: "1000px"`
4. **data-height attribute** (line 96): Change `data-height="762"` to `data-height="1000"`

## Why 1000px?
- GHL forms typically need 900-1100px depending on field count
- 1000px provides buffer for form content plus submit button
- If the form still shows a scrollbar after publishing, we can adjust further

## Result
Visitors will see the complete contact form without any internal scrollbar, providing a cleaner user experience.
