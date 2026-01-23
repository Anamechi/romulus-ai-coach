import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutPreview } from "@/components/home/AboutPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { SEOHead } from "@/components/seo/SEOHead";
import { OrganizationSchema, WebSiteSchema, PersonSchema } from "@/components/seo/StructuredData";

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
  "sameAs": [
    "https://www.linkedin.com/in/deannaromulusmba/"
  ]
};

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Dr. Romulus MBA | Business Strategy, Automation & Coaching"
        description="Dr. Deanna Romulus helps entrepreneurs build businesses that are structured, credible, and scalable. Expert coaching in business strategy, fundability, and automation."
        canonicalUrl="/"
        ogType="website"
      />
      <OrganizationSchema />
      <WebSiteSchema />
      <HeroSection />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
