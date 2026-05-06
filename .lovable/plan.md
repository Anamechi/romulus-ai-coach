## Goal
Remove the word "founder/founders" from all visible page copy and replace with "service-based business owner(s)" — varying phrasing for readability where context already establishes "service-based".

## What WILL change (display copy only)

**Homepage & meta**
- `index.html` — meta description, OG description, Twitter description (3 occurrences of "service-based founders")
- `src/pages/Index.tsx` — page description string + SEOHead description
- `src/components/home/editorial/EditorialHero.tsx` — body copy "Helping service-based founders build…"
- `src/components/home/editorial/AuthoritySection.tsx` — image alt text "working with founders…"
- `src/components/home/editorial/MethodSection.tsx` — "Most founders are solving the wrong problem"

**DDS pages (copy only — product names preserved)**
- `src/components/dds/DDSFrameworkOverview.tsx` — "helps founders build…"
- `src/components/dds/DDSHeroSection.tsx` — "shows founders how to…" + "Built for service-based founders"
- `src/components/dds/DDSLearnSection.tsx` — "Why most founders struggle…"
- `src/components/dds/DDSNextStepOffer.tsx` — bullet "Founder diagnostic checklist" → "Service-based business owner diagnostic checklist"
- `src/pages/DDSFramework.tsx` — SEO description "Learn how founders build…"

**Other pages**
- `src/pages/Diagnostic.tsx` — bullet "Founders ready to understand…"
- `src/pages/Programs.tsx` — "For founders ready to scale…"
- `src/pages/RevenueArchitectureSession.tsx` — page title, hero copy, who-it's-for list, exclusion line, quote ("Most founders hit a ceiling…") — 5 occurrences
- `src/pages/Trust.tsx` — "Our founder holds an MBA…" and "Learn about our founder" → reframe as "Dr. Romulus holds…" / "Learn about Dr. Romulus" (the company-founder meaning is different but user confirmed inclusion)
- `src/pages/DiagnosticKitThankYou.tsx` — section title "Founder Briefing: Why Effort Isn't the Problem"

## What will NOT change (preserved as branded product names / technical keys)
- `DDS Founder Score™` and `DDS Founder Scorecard` everywhere they appear (DDSQuiz.tsx, DDSScorecard.tsx)
- Schema.org JSON-LD `"founder"` property keys in `StructuredData.tsx` and `Index.tsx` (required Schema.org vocabulary, not user-visible)
- `.lovable/plan.md` (internal scratch file)

## Phrasing approach
- Default: `founders` → `service-based business owners`, `founder` → `service-based business owner`
- Where "service-based" already appears earlier in the same sentence/paragraph, shorten the second mention to `business owners` to avoid repetition (e.g., RAS hero, DDS hero badge).
- Trust.tsx "our founder" (referring to Dr. Romulus as company founder) → rewrite as "Dr. Romulus" rather than awkward literal substitution.
- "Founder Briefing" section heading on the thank-you page → "Service-Based Business Owner Briefing".

## Verification
- After edits, re-run `grep -rin '\bfounders\?\b' src index.html` and confirm only preserved branded names + JSON-LD keys remain.
- Spot-check homepage and RAS page in preview to ensure copy reads naturally.

## Out of scope
- No database/content edits (existing blog posts, FAQs, Q&A bodies stored in DB are not touched).
- No design, layout, or component structure changes.
- No memory file updates (memory references to "$150K+ founders" are internal notes, not user-visible).
