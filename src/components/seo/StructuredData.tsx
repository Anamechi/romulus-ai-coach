import { Helmet } from 'react-helmet-async';

const BASE_URL = "https://drromulusmba.com";
const SITE_NAME = "Dr. Romulus MBA";

// Organization Schema - for site-wide use
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE_NAME,
    "url": BASE_URL,
    "logo": `${BASE_URL}/logo.png`,
    "description": "Business consulting and MBA coaching services by Dr. Deanna Romulus",
    "founder": {
      "@type": "Person",
      "name": "Dr. Deanna Romulus",
      "jobTitle": "Business Consultant & MBA Coach"
    },
    "sameAs": [
      "https://www.linkedin.com/in/deannaromulusmba/"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": `${BASE_URL}/contact`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// WebSite Schema - for homepage
export function WebSiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": BASE_URL,
    "description": "Transform your business with expert MBA coaching and consulting services",
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Article Schema
interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: {
    name: string;
    credentials?: string;
    bio?: string;
  };
  speakableSummary?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  imageUrl,
  publishedAt,
  updatedAt,
  author,
  speakableSummary,
}: ArticleSchemaProps) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "datePublished": publishedAt,
    "dateModified": updatedAt || publishedAt,
    "author": author ? {
      "@type": "Person",
      "name": author.name,
      "jobTitle": author.credentials,
      "description": author.bio
    } : {
      "@type": "Person",
      "name": "Dr. Deanna Romulus"
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`
    }
  };

  // Enhanced speakable schema with URL, class selectors, and xpath
  const speakableSchema = speakableSummary ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/blog/${slug}`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-content", ".speakable-summary"],
      "xpath": [
        "/html/body//div[contains(@class,'speakable-content')]",
        "/html/body//div[contains(@class,'speakable-summary')]"
      ]
    }
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      {speakableSchema && (
        <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>
      )}
    </Helmet>
  );
}

// FAQ Page Schema
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Single FAQ Schema (for detail pages)
interface SingleFAQSchemaProps {
  question: string;
  answer: string;
  slug: string;
  speakableAnswer?: string;
}

export function SingleFAQSchema({ question, answer, slug, speakableAnswer }: SingleFAQSchemaProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": answer
      }
    }]
  };

  // Enhanced speakable schema with URL, class selectors, and xpath
  const speakableSchema = speakableAnswer ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/faq/${slug}`,
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-answer"],
      "xpath": ["/html/body//div[contains(@class,'speakable-answer')]"]
    }
  } : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      {speakableSchema && (
        <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>
      )}
    </Helmet>
  );
}

// Breadcrumb Schema
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Service/Course Schema
interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider?: string;
}

export function ServiceSchema({ name, description, url, provider = SITE_NAME }: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url.startsWith('http') ? url : `${BASE_URL}${url}`,
    "provider": {
      "@type": "Organization",
      "name": provider
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// Person Schema (for About page)
export function PersonSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dr. Deanna Romulus, MBA",
    "jobTitle": [
      "Business Strategist",
      "Educator",
      "Automation Consultant",
      "Systems Architect"
    ],
    "description": "Dr. Deanna Romulus, MBA is a business strategist, educator, and automation consultant with expertise in business structure, financial decision-making, adult learning, and scalable systems.",
    "url": `${BASE_URL}/about`,
    "image": `${BASE_URL}/dr-romulus.jpg`,
    "knowsAbout": [
      "Business Strategy",
      "Automation Systems",
      "Financial Self-Efficacy",
      "Adult Learning",
      "Entrepreneurship",
      "Operational Efficiency",
      "Business Fundability"
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Doctorate",
        "name": "Doctor of Education (Ed.D.) in Educational Leadership"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Master's Degree",
        "name": "International Master of Business Administration (MBA), Finance"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Certificate",
        "name": "Adult Organizational Development"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Bachelor's Degree",
        "name": "Bachelor of Science in Fashion Design and Marketing"
      }
    ],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "University of Phoenix"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Keller Graduate School of Management"
      }
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Business Consultant",
      "occupationLocation": {
        "@type": "Country",
        "name": "United States"
      },
      "description": "Helping entrepreneurs build structured, credible, and scalable businesses through strategy, automation, and coaching"
    },
    "sameAs": [
      "https://www.linkedin.com/in/deannaromulusmba/"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": SITE_NAME
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
