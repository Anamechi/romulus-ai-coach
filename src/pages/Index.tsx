import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { OrganizationSchema, WebSiteSchema, PersonSchema } from "@/components/seo/StructuredData";
import { Helmet } from 'react-helmet-async';

const personSchema = {
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
  "sameAs": [
    "https://www.linkedin.com/in/deannaromulusmba/"
  ]
};

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Dr. Deanna Romulus | Systems Before Scale™"
        description="Architecting AI-enabled systems and fundable infrastructure for service-based founders ready to scale intelligently."
        canonicalUrl="/"
        ogType="website"
        ogImage="https://drromulusmba.com/og-image.jpg"
        ogImageAlt="Dr. Deanna Romulus - Systems Before Scale"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>
      <HeroSection />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
