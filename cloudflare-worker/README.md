# Cloudflare Worker: AI Bot Router

This Cloudflare Worker routes AI crawler requests to the prerender edge function, ensuring AI systems like ChatGPT, Perplexity, and Google AI Overviews receive full HTML content instead of empty JavaScript shells.

## Quick Setup (5 minutes)

### Step 1: Create the Worker

1. Log into [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account
3. Go to **Workers & Pages** → **Create application** → **Create Worker**
4. Name it `ai-bot-router`
5. Click **Deploy**
6. Click **Edit code**
7. Replace the default code with the contents of `ai-bot-router.js`
8. Click **Save and Deploy**

### Step 2: Add Worker Routes

1. Go to **Websites** → **drromulusmba.com**
2. Click **Workers Routes** in the left sidebar
3. Click **Add route**
4. Add these routes:

| Route | Worker |
|-------|--------|
| `drromulusmba.com/*` | ai-bot-router |
| `www.drromulusmba.com/*` | ai-bot-router |

### Step 3: Verify It Works

Test with curl simulating an AI bot:

```bash
# Test as GPTBot
curl -A "GPTBot/1.0" https://drromulusmba.com/blog/your-post-slug

# Test as PerplexityBot
curl -A "PerplexityBot" https://drromulusmba.com/faq/your-faq-slug

# Test as ClaudeBot
curl -A "ClaudeBot" https://drromulusmba.com/qa/your-qa-slug
```

You should see full HTML content with:
- Complete page content (not empty JS shell)
- JSON-LD structured data
- Open Graph meta tags
- Speakable content markup
- `X-Prerendered: true` header

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   AI Crawler    │────▶│ Cloudflare Edge  │────▶│    Prerender    │
│  (GPTBot, etc)  │     │     Worker       │     │  Edge Function  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                         │
                               │ (non-AI bots)           │
                               ▼                         ▼
                        ┌──────────────┐         ┌──────────────┐
                        │   Origin     │         │   Supabase   │
                        │   (React)    │         │   Database   │
                        └──────────────┘         └──────────────┘
```

1. **Request arrives** at Cloudflare edge
2. **Worker checks** User-Agent for AI bot patterns
3. **If AI bot**: Routes to prerender function → Returns full HTML
4. **If regular user**: Passes through to React app

## Detected AI Bots

| Bot | Service |
|-----|---------|
| GPTBot, ChatGPT-User | OpenAI / ChatGPT |
| ClaudeBot, anthropic-ai | Anthropic / Claude |
| PerplexityBot | Perplexity AI |
| Google-Extended | Google AI / Bard |
| Bingbot | Microsoft / Bing AI |
| cohere-ai | Cohere |
| CCBot | Common Crawl |

## Prerendered Paths

- `/` - Homepage
- `/blog/*` - Blog posts
- `/faq/*` - FAQ pages
- `/qa/*` - Q&A pages
- `/topic/*` - Topic pages
- `/about` - About page
- `/programs` - Programs page
- `/contact` - Contact page

## Monitoring

View logs in Cloudflare Dashboard:
1. Go to **Workers & Pages** → **ai-bot-router**
2. Click **Logs** tab
3. Filter by `[AI-Router]` to see routing decisions

## Troubleshooting

### Worker not triggering
- Verify routes are configured correctly
- Check Worker is deployed and active
- Ensure route pattern matches your domain

### Prerender returning errors
- Check Supabase edge function is deployed
- Verify `PRERENDER_URL` in worker matches your Supabase project
- Check Supabase function logs for errors

### Content not appearing
- Verify content exists in database
- Check content is published (not draft)
- Ensure slug matches database exactly
