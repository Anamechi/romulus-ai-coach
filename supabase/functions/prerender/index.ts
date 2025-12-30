import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://drromulusmba.com";
const SITE_NAME = "Dr. Romulus MBA";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "/";
    const contentType = url.searchParams.get("type") || "auto";
    const slug = url.searchParams.get("slug") || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Pre-render request: path=${path}, type=${contentType}, slug=${slug}`);

    let html = "";

    // Determine content type from path if auto
    let detectedType = contentType;
    if (contentType === "auto") {
      if (path.startsWith("/blog/")) {
        detectedType = "blog";
      } else if (path.startsWith("/faq/")) {
        detectedType = "faq";
      } else if (path.startsWith("/qa/")) {
        detectedType = "qa";
      } else if (path.startsWith("/topics/")) {
        detectedType = "topic";
      } else {
        detectedType = "static";
      }
    }

    // Extract slug from path if not provided
    const extractedSlug = slug || path.split("/").filter(Boolean).pop() || "";

    switch (detectedType) {
      case "blog":
        html = await renderBlogPost(supabase, extractedSlug);
        break;
      case "faq":
        html = await renderFAQ(supabase, extractedSlug);
        break;
      case "qa":
        html = await renderQA(supabase, extractedSlug);
        break;
      case "topic":
        html = await renderTopic(supabase, extractedSlug);
        break;
      default:
        html = renderStaticPage(path);
    }

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "index, follow",
      },
      status: 200,
    });
  } catch (error) {
    console.error("Pre-render error:", error);
    return new Response(renderErrorPage(error), {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
      },
      status: 500,
    });
  }
});

async function renderBlogPost(supabase: any, slug: string): Promise<string> {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:authors(*),
      reviewer:reviewers(*),
      topic:topics(*)
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !post) {
    console.error("Blog post not found:", slug, error);
    return render404("Blog post not found");
  }

  const canonicalUrl = `${BASE_URL}/blog/${post.slug}`;
  const authorName = post.author?.full_name || "Dr. Deanna Romulus";
  const authorCredentials = post.author?.credentials || "";

  // Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description || post.excerpt || "",
    image: post.cover_image_url,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: authorCredentials,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
  };

  // Speakable schema if available
  const speakableSchema = post.speakable_summary
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable-content"],
        },
      }
    : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.meta_title || post.title)} | ${SITE_NAME}</title>
  <meta name="description" content="${escapeHtml(post.meta_description || post.excerpt || "")}">
  <meta name="author" content="${escapeHtml(authorName)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeHtml(post.title)}">
  <meta property="og:description" content="${escapeHtml(post.meta_description || post.excerpt || "")}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  ${post.cover_image_url ? `<meta property="og:image" content="${post.cover_image_url}">` : ""}
  <meta property="article:published_time" content="${post.published_at || ""}">
  <meta property="article:modified_time" content="${post.updated_at || post.published_at || ""}">
  <meta property="article:author" content="${escapeHtml(authorName)}">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(post.title)}">
  <meta name="twitter:description" content="${escapeHtml(post.meta_description || post.excerpt || "")}">
  ${post.cover_image_url ? `<meta name="twitter:image" content="${post.cover_image_url}">` : ""}
  
  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  ${speakableSchema ? `<script type="application/ld+json">${JSON.stringify(speakableSchema)}</script>` : ""}
</head>
<body>
  <header>
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="${BASE_URL}">Home</a></li>
        <li><a href="${BASE_URL}/blog">Blog</a></li>
        <li aria-current="page">${escapeHtml(post.title)}</li>
      </ol>
    </nav>
  </header>
  
  <main>
    <article itemscope itemtype="https://schema.org/Article">
      <header>
        ${post.topic ? `<span itemprop="articleSection">${escapeHtml(post.topic.name)}</span>` : ""}
        <h1 itemprop="headline">${escapeHtml(post.title)}</h1>
        
        <div class="meta">
          <span itemprop="author" itemscope itemtype="https://schema.org/Person">
            By <span itemprop="name">${escapeHtml(authorName)}</span>
            ${authorCredentials ? `<span itemprop="jobTitle">(${escapeHtml(authorCredentials)})</span>` : ""}
          </span>
          ${post.published_at ? `<time itemprop="datePublished" datetime="${post.published_at}">${new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>` : ""}
          ${post.reading_time_minutes ? `<span>${post.reading_time_minutes} min read</span>` : ""}
        </div>
      </header>
      
      ${post.cover_image_url ? `<img itemprop="image" src="${post.cover_image_url}" alt="${escapeHtml(post.title)}" loading="eager">` : ""}
      
      ${post.speakable_summary ? `<div class="speakable-content" itemprop="description">${escapeHtml(post.speakable_summary)}</div>` : ""}
      
      <div itemprop="articleBody" class="content">
        ${convertMarkdownToHtml(post.content || "")}
      </div>
      
      ${post.reviewer ? `
      <footer>
        <p>Reviewed by <span>${escapeHtml(post.reviewer.full_name)}</span>
        ${post.reviewer.credentials ? ` (${escapeHtml(post.reviewer.credentials)})` : ""}</p>
      </footer>
      ` : ""}
    </article>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
    <nav>
      <a href="${BASE_URL}/about">About</a>
      <a href="${BASE_URL}/contact">Contact</a>
      <a href="${BASE_URL}/apply">Apply for Coaching</a>
    </nav>
  </footer>
</body>
</html>`;
}

async function renderFAQ(supabase: any, slug: string): Promise<string> {
  const { data: faq, error } = await supabase
    .from("faqs")
    .select(`
      *,
      author:authors(*),
      reviewer:reviewers(*),
      topic:topics(*)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !faq) {
    console.error("FAQ not found:", slug, error);
    return render404("FAQ not found");
  }

  const canonicalUrl = `${BASE_URL}/faq/${faq.slug}`;

  // FAQ structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      },
    ],
  };

  // Speakable schema
  const speakableSchema = faq.speakable_answer
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable-answer"],
        },
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "FAQ", item: `${BASE_URL}/faq` },
      { "@type": "ListItem", position: 3, name: faq.question.substring(0, 50), item: canonicalUrl },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(faq.question)} | FAQ | ${SITE_NAME}</title>
  <meta name="description" content="${escapeHtml(faq.answer.substring(0, 160))}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(faq.question)}">
  <meta property="og:description" content="${escapeHtml(faq.answer.substring(0, 160))}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  ${speakableSchema ? `<script type="application/ld+json">${JSON.stringify(speakableSchema)}</script>` : ""}
</head>
<body>
  <header>
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="${BASE_URL}">Home</a></li>
        <li><a href="${BASE_URL}/faq">FAQ</a></li>
        <li aria-current="page">${escapeHtml(faq.question.substring(0, 50))}</li>
      </ol>
    </nav>
  </header>
  
  <main>
    <article itemscope itemtype="https://schema.org/FAQPage">
      ${faq.topic ? `<span>${escapeHtml(faq.topic.name)}</span>` : ""}
      
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h1 itemprop="name">${escapeHtml(faq.question)}</h1>
        
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          ${faq.speakable_answer ? `<div class="speakable-answer" itemprop="text"><strong>${escapeHtml(faq.speakable_answer)}</strong></div>` : ""}
          <div itemprop="text">${escapeHtml(faq.answer)}</div>
        </div>
      </div>
      
      ${faq.author ? `<p>Written by ${escapeHtml(faq.author.full_name)}${faq.author.credentials ? ` (${escapeHtml(faq.author.credentials)})` : ""}</p>` : ""}
      ${faq.reviewer ? `<p>Reviewed by ${escapeHtml(faq.reviewer.full_name)}${faq.reviewer.credentials ? ` (${escapeHtml(faq.reviewer.credentials)})` : ""}</p>` : ""}
    </article>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

async function renderQA(supabase: any, slug: string): Promise<string> {
  const { data: qa, error } = await supabase
    .from("qa_pages")
    .select(`
      *,
      author:authors(*),
      reviewer:reviewers(*),
      topic:topics(*)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !qa) {
    console.error("Q&A not found:", slug, error);
    return render404("Q&A not found");
  }

  const canonicalUrl = `${BASE_URL}/qa/${qa.slug}`;

  // QAPage structured data
  const qaSchema = {
    "@context": "https://schema.org",
    "@type": "QAPage",
    mainEntity: {
      "@type": "Question",
      name: qa.question,
      text: qa.question,
      answerCount: 1,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
        ...(qa.author && {
          author: {
            "@type": "Person",
            name: qa.author.full_name,
            ...(qa.author.credentials && { jobTitle: qa.author.credentials }),
          },
        }),
      },
    },
  };

  const speakableSchema = qa.speakable_answer
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["#speakable-answer"],
        },
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Q&A", item: `${BASE_URL}/qa` },
      { "@type": "ListItem", position: 3, name: qa.question.substring(0, 50), item: canonicalUrl },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(qa.meta_title || qa.question)} | ${SITE_NAME}</title>
  <meta name="description" content="${escapeHtml(qa.meta_description || qa.answer.substring(0, 160))}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(qa.question)}">
  <meta property="og:description" content="${escapeHtml(qa.meta_description || qa.answer.substring(0, 160))}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(qaSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
  ${speakableSchema ? `<script type="application/ld+json">${JSON.stringify(speakableSchema)}</script>` : ""}
</head>
<body>
  <header>
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="${BASE_URL}">Home</a></li>
        <li><a href="${BASE_URL}/qa">Q&A</a></li>
        <li aria-current="page">${escapeHtml(qa.question.substring(0, 50))}</li>
      </ol>
    </nav>
  </header>
  
  <main>
    <article itemscope itemtype="https://schema.org/QAPage">
      ${qa.topic ? `<span>${escapeHtml(qa.topic.name)}</span>` : ""}
      
      <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
        <h1 itemprop="name">${escapeHtml(qa.question)}</h1>
        
        <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
          ${qa.speakable_answer ? `<div id="speakable-answer" itemprop="text"><strong>${escapeHtml(qa.speakable_answer)}</strong></div>` : ""}
          <div itemprop="text">${escapeHtml(qa.answer)}</div>
          
          ${qa.author ? `
          <div itemprop="author" itemscope itemtype="https://schema.org/Person">
            <p>Answered by <span itemprop="name">${escapeHtml(qa.author.full_name)}</span>
            ${qa.author.credentials ? `<span itemprop="jobTitle">(${escapeHtml(qa.author.credentials)})</span>` : ""}</p>
          </div>
          ` : ""}
        </div>
      </div>
      
      ${qa.reviewer ? `<p>Reviewed by ${escapeHtml(qa.reviewer.full_name)}${qa.reviewer.credentials ? ` (${escapeHtml(qa.reviewer.credentials)})` : ""}</p>` : ""}
    </article>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

async function renderTopic(supabase: any, slug: string): Promise<string> {
  const { data: topic, error } = await supabase
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !topic) {
    console.error("Topic not found:", slug, error);
    return render404("Topic not found");
  }

  // Get related content
  const [blogResult, faqResult, qaResult] = await Promise.all([
    supabase.from("blog_posts").select("slug, title, excerpt").eq("topic_id", topic.id).eq("published", true).limit(10),
    supabase.from("faqs").select("slug, question").eq("topic_id", topic.id).eq("status", "published").limit(10),
    supabase.from("qa_pages").select("slug, question").eq("topic_id", topic.id).eq("status", "published").limit(10),
  ]);

  const canonicalUrl = `${BASE_URL}/topics/${topic.slug}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topic.name,
    description: topic.description || "",
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: (blogResult.data?.length || 0) + (faqResult.data?.length || 0) + (qaResult.data?.length || 0),
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Topics", item: `${BASE_URL}/topics` },
      { "@type": "ListItem", position: 3, name: topic.name, item: canonicalUrl },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(topic.name)} | Topics | ${SITE_NAME}</title>
  <meta name="description" content="${escapeHtml(topic.description || `Explore ${topic.name} resources, articles, and FAQs`)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(topic.name)}">
  <meta property="og:description" content="${escapeHtml(topic.description || "")}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">${JSON.stringify(collectionSchema)}</script>
  <script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>
</head>
<body>
  <header>
    <nav aria-label="Breadcrumb">
      <ol>
        <li><a href="${BASE_URL}">Home</a></li>
        <li><a href="${BASE_URL}/topics">Topics</a></li>
        <li aria-current="page">${escapeHtml(topic.name)}</li>
      </ol>
    </nav>
  </header>
  
  <main>
    <article>
      <h1>${escapeHtml(topic.name)}</h1>
      ${topic.description ? `<p>${escapeHtml(topic.description)}</p>` : ""}
      ${topic.funnel_stage ? `<span>Stage: ${topic.funnel_stage}</span>` : ""}
      
      ${blogResult.data?.length ? `
      <section>
        <h2>Articles</h2>
        <ul>
          ${blogResult.data.map((post: any) => `<li><a href="${BASE_URL}/blog/${post.slug}">${escapeHtml(post.title)}</a>${post.excerpt ? ` - ${escapeHtml(post.excerpt.substring(0, 100))}` : ""}</li>`).join("")}
        </ul>
      </section>
      ` : ""}
      
      ${faqResult.data?.length ? `
      <section>
        <h2>FAQs</h2>
        <ul>
          ${faqResult.data.map((faq: any) => `<li><a href="${BASE_URL}/faq/${faq.slug}">${escapeHtml(faq.question)}</a></li>`).join("")}
        </ul>
      </section>
      ` : ""}
      
      ${qaResult.data?.length ? `
      <section>
        <h2>Q&A</h2>
        <ul>
          ${qaResult.data.map((qa: any) => `<li><a href="${BASE_URL}/qa/${qa.slug}">${escapeHtml(qa.question)}</a></li>`).join("")}
        </ul>
      </section>
      ` : ""}
    </article>
  </main>
  
  <footer>
    <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
  </footer>
</body>
</html>`;
}

function renderStaticPage(path: string): string {
  const pages: Record<string, { title: string; description: string }> = {
    "/": {
      title: "Business Consulting & MBA Coaching",
      description: "Transform your business with expert MBA coaching and consulting services. Build a structured, credible, and scalable business with Dr. Deanna Romulus.",
    },
    "/about": {
      title: "About Dr. Deanna Romulus, MBA",
      description: "Dr. Deanna Romulus, MBA is a business strategist, educator, and automation consultant helping entrepreneurs build structured, credible, and scalable businesses.",
    },
    "/programs": {
      title: "Programs",
      description: "Explore our MBA coaching and business consulting programs designed to help entrepreneurs build fundable, scalable businesses.",
    },
    "/blog": {
      title: "Blog",
      description: "Expert insights on business structure, automation, financial self-efficacy, and sustainable growth strategies.",
    },
    "/faq": {
      title: "FAQ",
      description: "Frequently asked questions about business coaching, automation, fundability, and working with Dr. Romulus.",
    },
    "/qa": {
      title: "Q&A",
      description: "In-depth answers to common business questions about structure, credibility, automation, and growth.",
    },
    "/topics": {
      title: "Topics",
      description: "Browse our content by topic: business structure, financial self-efficacy, automation, authority building, and more.",
    },
    "/contact": {
      title: "Contact",
      description: "Get in touch with Dr. Romulus for business coaching, consulting, or partnership opportunities.",
    },
    "/apply": {
      title: "Apply for Coaching",
      description: "Apply to work with Dr. Romulus and transform your business with expert MBA coaching.",
    },
  };

  const page = pages[path] || pages["/"];
  const canonicalUrl = `${BASE_URL}${path === "/" ? "" : path}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title} | ${SITE_NAME}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${canonicalUrl}">
  
  <meta property="og:type" content="website">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
</head>
<body>
  <main>
    <h1>${page.title}</h1>
    <p>${page.description}</p>
    <p>Visit <a href="${canonicalUrl}">${canonicalUrl}</a> for the full interactive experience.</p>
  </main>
</body>
</html>`;
}

function render404(message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Not Found | ${SITE_NAME}</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <main>
    <h1>404 - Not Found</h1>
    <p>${escapeHtml(message)}</p>
    <p><a href="${BASE_URL}">Return to homepage</a></p>
  </main>
</body>
</html>`;
}

function renderErrorPage(error: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error | ${SITE_NAME}</title>
  <meta name="robots" content="noindex">
</head>
<body>
  <main>
    <h1>Error</h1>
    <p>An error occurred while rendering this page.</p>
    <p><a href="${BASE_URL}">Return to homepage</a></p>
  </main>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertMarkdownToHtml(markdown: string): string {
  // Basic markdown to HTML conversion
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Lists
    .replace(/^\s*[-*]\s+(.*$)/gim, "<li>$1</li>")
    // Paragraphs
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/gim, (match) => {
      if (match.startsWith("<")) return match;
      return `<p>${match}</p>`;
    });
}
