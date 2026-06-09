import { Layout } from "@/components/layout/Layout";
import { EditorialHero } from "@/components/home/editorial/EditorialHero";
import { AuthoritySection } from "@/components/home/editorial/AuthoritySection";
import { MethodSection } from "@/components/home/editorial/MethodSection";
import { BookSection } from "@/components/home/editorial/BookSection";
import { ClosingCTA } from "@/components/home/editorial/ClosingCTA";
import { HomeFAQ } from "@/components/home/editorial/HomeFAQ";
import { SEOHead } from "@/components/seo/SEOHead";
import { Helmet } from 'react-helmet-async';

const homepageFAQs = [
  {
    q: "Who is Dr. Deanna Romulus?",
    a: "Dr. Deanna Romulus is an Ed.D. and MBA (Finance) business systems strategist who helps service-based business owners build fundable, automated revenue systems that produce consistent, predictable income.",
  },
  {
    q: "What is the DDS Framework?",
    a: "The DDS Framework is Dr. Romulus's three-phase methodology — Diagnose, Design, Scale — used to convert inconsistent revenue into a structural, repeatable income system before scaling marketing or team.",
  },
  {
    q: "Who does Dr. Romulus work with?",
    a: "She works with established service-based business owners and founders who need to systematize operations, stabilize cash flow, and build a fundable, automation-ready business.",
  },
  {
    q: "What does Systems Before Scale mean?",
    a: "Systems Before Scale means installing the structural systems — offer architecture, delivery, cash flow, and automation — that allow a service business to grow predictably instead of relying on personal effort.",
  },
];

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://drromulusmba.com/#person",
      "name": "Dr. Deanna Romulus",
      "url": "https://drromulusmba.com",
      "jobTitle": "AI-Ready Business Systems Strategist",
      "image": "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69fcc5bffb9074ae035393df.png",
      "description": "Dr. Deanna Romulus helps service-based business owners build fundable, automated revenue systems that generate predictable income.",
      "hasCredential": [
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "Ed.D." },
        { "@type": "EducationalOccupationalCredential", "credentialCategory": "degree", "name": "MBA (Finance)" }
      ],
      "knowsAbout": [
        "Business systems strategy",
        "Revenue architecture",
        "Service business automation",
        "AI-ready operations",
        "Cash flow design",
        "Offer architecture"
      ],
      "sameAs": [
        "https://www.instagram.com/dr.romulusmba/",
        "https://www.tiktok.com/@dr.romulusmba",
        "https://www.youtube.com/@Dr.DeannaRomulus",
        "https://www.facebook.com/profile.php?id=61571295316337",
        "https://www.threads.com/@dr.romulusmba",
        "https://x.com/DRomulusMBA",
        "https://www.pinterest.com/drromulusmba/",
        "https://www.linkedin.com/in/deannaromulusmba/",
        "https://bsky.app/profile/drromulusmba.bsky.social"
      ]
    },
    {
      "@type": "Organization",
      "@id": "https://drromulusmba.com/#organization",
      "name": "Dr. Deanna Romulus",
      "url": "https://drromulusmba.com",
      "logo": "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69fcc5bffb9074ae035393df.png",
      "founder": { "@id": "https://drromulusmba.com/#person" }
    },
    {
      "@type": "WebSite",
      "@id": "https://drromulusmba.com/#website",
      "url": "https://drromulusmba.com",
      "name": "Dr. Deanna Romulus",
      "publisher": { "@id": "https://drromulusmba.com/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://drromulusmba.com/blog?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://drromulusmba.com/#webpage",
      "url": "https://drromulusmba.com/",
      "name": "Dr. Deanna Romulus | AI-Ready Business Systems Strategist",
      "isPartOf": { "@id": "https://drromulusmba.com/#website" },
      "about": { "@id": "https://drromulusmba.com/#person" },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".speakable-summary", ".speakable-answer"]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://drromulusmba.com/#faq",
      "mainEntity": homepageFAQs.map((f) => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": { "@type": "Answer", "text": f.a }
      }))
    }
  ]
};

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Dr. Deanna Romulus | AI-Ready Business Systems Strategist"
        description="Helping service-based business owners build fundable, automated revenue systems that generate consistent, predictable income."
        canonicalUrl="/"
        ogType="website"
        ogImage="https://drromulusmba.com/og-dr-deanna-romulus.png"
        ogImageAlt="Dr. Deanna Romulus - Systems Before Scale"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homepageSchema)}</script>
      </Helmet>
      <EditorialHero />
      <AuthoritySection />
      <MethodSection />
      <BookSection />
      <HomeFAQ faqs={homepageFAQs} />
      <ClosingCTA />
    </Layout>
  );
};

export default Index;
