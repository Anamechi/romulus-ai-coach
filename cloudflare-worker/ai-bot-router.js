/**
 * Cloudflare Worker: AI Bot Router for drromulusmba.com
 * 
 * This worker intercepts requests from AI crawlers and routes them
 * to the prerender edge function to serve full HTML content instead
 * of empty JavaScript shells.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Go to Cloudflare Dashboard → Workers & Pages → Create Worker
 * 2. Paste this code
 * 3. Deploy the worker
 * 4. Go to your domain (drromulusmba.com) → Workers Routes
 * 5. Add route: drromulusmba.com/* → ai-bot-router
 * 6. Add route: www.drromulusmba.com/* → ai-bot-router
 */

// AI bot user agents to detect
const AI_BOT_PATTERNS = [
  // OpenAI / ChatGPT
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  
  // Anthropic / Claude
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  
  // Perplexity
  'PerplexityBot',
  
  // Google AI
  'Google-Extended',
  'Googlebot',
  
  // Microsoft / Bing
  'Bingbot',
  'BingPreview',
  
  // Other AI crawlers
  'cohere-ai',
  'CCBot',
  'FacebookBot',
  'Applebot',
  'Bytespider',
  'YouBot',
  'Diffbot',
  'PetalBot',
  'Amazonbot',
  
  // Common AI research crawlers
  'AI2Bot',
  'Scrapy',
  'ia_archiver'
];

// Content paths that should be prerendered
const PRERENDER_PATHS = [
  '/blog/',
  '/faq/',
  '/qa/',
  '/questions/',
  '/topic/',
  '/topics/',
  '/about',
  '/programs',
  '/contact'
];

// Static assets to skip
const STATIC_EXTENSIONS = [
  '.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm',
  '.json', '.xml', '.txt', '.map'
];

// Prerender edge function URL
const PRERENDER_URL = 'https://xxdbmkllubljncwvxkrl.supabase.co/functions/v1/prerender';

/**
 * Check if the user agent is an AI bot
 */
function isAIBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_BOT_PATTERNS.some(pattern => ua.includes(pattern.toLowerCase()));
}

/**
 * Check if the path should be prerendered
 */
function shouldPrerender(pathname) {
  // Skip static assets
  if (STATIC_EXTENSIONS.some(ext => pathname.endsWith(ext))) {
    return false;
  }
  
  // Skip admin and auth routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
    return false;
  }
  
  // Prerender homepage
  if (pathname === '/' || pathname === '') {
    return true;
  }
  
  // Prerender content paths
  return PRERENDER_PATHS.some(path => pathname.startsWith(path));
}

/**
 * Detect content type from path
 */
function detectContentType(pathname) {
  if (pathname.startsWith('/blog/')) return 'blog';
  if (pathname.startsWith('/faq/')) return 'faq';
  if (pathname.startsWith('/qa/') || pathname.startsWith('/questions/')) return 'qa';
  if (pathname.startsWith('/topic/') || pathname.startsWith('/topics/')) return 'topic';
  return 'static';
}

/**
 * Extract slug from path
 */
function extractSlug(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

/**
 * Main request handler
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const userAgent = request.headers.get('User-Agent') || '';
  const pathname = url.pathname;
  
  // Log for debugging (visible in Cloudflare dashboard)
  console.log(`[AI-Router] Path: ${pathname}, UA: ${userAgent.substring(0, 50)}...`);
  
  // Check if this is an AI bot requesting a prerenderable path
  if (isAIBot(userAgent) && shouldPrerender(pathname)) {
    console.log(`[AI-Router] AI bot detected, routing to prerender`);
    
    const contentType = detectContentType(pathname);
    const slug = extractSlug(pathname);
    
    // Build prerender URL
    const prerenderParams = new URLSearchParams({
      path: pathname,
      type: contentType,
      slug: slug
    });
    
    try {
      const prerenderResponse = await fetch(`${PRERENDER_URL}?${prerenderParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html',
          'User-Agent': userAgent,
          'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
          'X-Original-URL': request.url
        }
      });
      
      if (prerenderResponse.ok) {
        const html = await prerenderResponse.text();
        
        // Return prerendered HTML with appropriate headers
        return new Response(html, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            'X-Prerendered': 'true',
            'X-Robots-Tag': 'index, follow',
            'Vary': 'User-Agent'
          }
        });
      } else {
        console.log(`[AI-Router] Prerender failed: ${prerenderResponse.status}`);
      }
    } catch (error) {
      console.error(`[AI-Router] Prerender error: ${error.message}`);
    }
  }
  
  // For non-AI bots or failed prerenders, pass through to origin
  return fetch(request);
}

// Cloudflare Worker event listener
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// For Cloudflare Workers using ES modules format (optional alternative)
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
