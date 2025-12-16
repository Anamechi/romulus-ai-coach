import { Layout } from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { HeroSection } from "@/components/home/HeroSection";
import { ProgramsPreview } from "@/components/home/ProgramsPreview";
import { AboutPreview } from "@/components/home/AboutPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

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
      <Helmet>
        <title>Dr. Romulus MBA | Business Strategy, Automation & Coaching</title>
        <meta name="description" content="Dr. Deanna Romulus helps entrepreneurs build businesses that are structured, credible, and scalable. Expert coaching in business strategy, fundability, and automation." />
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>
      <HeroSection />
      <ProgramsPreview />
      <AboutPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
