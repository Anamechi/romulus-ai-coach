import { Layout } from "@/components/layout/Layout";
import { EditorialHero } from "@/components/home/editorial/EditorialHero";
import { AuthoritySection } from "@/components/home/editorial/AuthoritySection";
import { MethodSection } from "@/components/home/editorial/MethodSection";
import { BookSection } from "@/components/home/editorial/BookSection";
import { ClosingCTA } from "@/components/home/editorial/ClosingCTA";
import { SEOHead } from "@/components/seo/SEOHead";
import { Helmet } from 'react-helmet-async';

const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://drromulusmba.com/#person",
      "name": "Dr. Deanna Romulus",
      "url": "https://drromulusmba.com",
      "jobTitle": "AI-Ready Business Systems Strategist",
      "image": "https://drromulusmba.com/favicon-64.png",
      "description": "Dr. Deanna Romulus helps service-based business owners build fundable, automated revenue systems that generate predictable income.",
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
      "logo": "https://drromulusmba.com/favicon-64.png",
      "founder": {
        "@id": "https://drromulusmba.com/#person"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://drromulusmba.com/#website",
      "url": "https://drromulusmba.com",
      "name": "Dr. Deanna Romulus",
      "publisher": {
        "@id": "https://drromulusmba.com/#organization"
      }
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
      <ClosingCTA />
    </Layout>
  );
};

export default Index;
