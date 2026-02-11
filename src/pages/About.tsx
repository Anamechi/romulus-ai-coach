import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building, CheckCircle, GraduationCap, Heart, Lightbulb, Target, Users } from "lucide-react";
import { ChecklistCTA } from "@/components/content/ChecklistCTA";
import drRomulusPhoto from "@/assets/dr-romulus.jpeg";
import { SEOHead } from "@/components/seo/SEOHead";
import { PersonSchema, BreadcrumbSchema } from "@/components/seo/StructuredData";

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
  "image": "https://xxdbmkllubljncwvxkrl.supabase.co/storage/v1/object/public/assets/dr-romulus.jpeg",
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

const approach = [
  {
    icon: Target,
    title: "Pattern Recognition",
    description: "Seeing the connections others miss—understanding why your business behaves the way it does.",
  },
  {
    icon: Lightbulb,
    title: "Systems Thinking",
    description: "Identifying root causes instead of chasing symptoms. One fix that unlocks everything else.",
  },
  {
    icon: Building,
    title: "Clarity Before Action",
    description: "Understanding the problem fully before prescribing solutions. No guesswork.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Access for All",
    description: "Raised in an underserved community, committed to providing clear information that opens doors.",
  },
  {
    icon: CheckCircle,
    title: "Grounded & Honest",
    description: "No shortcuts. No guaranteed outcomes. Just clarity, structure, and confidence to make informed decisions.",
  },
  {
    icon: Users,
    title: "Trust-First Education",
    description: "Teaching entrepreneurs how to understand systems—so they can navigate them and win on their own terms.",
  },
];

export default function About() {
  return (
    <Layout>
      <SEOHead
        title="About Dr. Deanna Romulus, MBA | Business Strategist & Educator"
        description="Dr. Deanna Romulus, MBA is a business strategist, educator, and automation consultant helping entrepreneurs build structured, credible, and scalable businesses."
        canonicalUrl="/about"
        ogType="website"
        author="Dr. Deanna Romulus"
      />
      <PersonSchema />
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" }
      ]} />
      
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Content */}
            <div>
              <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
                About Dr. Romulus
              </span>
              
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Dr. Deanna Romulus,{" "}
                <span className="text-gradient-gold">MBA</span>
              </h1>
              
              <p className="font-body text-xl text-gold font-medium mb-6">
                Visionary Strategist & Empowerment Architect
              </p>
              
              <p className="font-body text-lg text-muted-foreground mb-6 leading-relaxed">
                Dr. Romulus helps entrepreneurs see what's actually happening in their 
                businesses—not just what they think is happening. That clarity is the 
                foundation for every meaningful change.
              </p>
              
              <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                With a background spanning marketing, finance, education, and operations, 
                she brings a rare ability to recognize patterns and identify the real 
                bottleneck—the one fix that unlocks everything else.
              </p>

              <Button variant="gold" size="lg" asChild>
                <a href="https://checklist.drromulusmba.com/checklist" target="_blank" rel="noopener noreferrer">
                  Get the Checklist
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-elevated">
                <img 
                  src={drRomulusPhoto} 
                  alt="Dr. Deanna Romulus, MBA - Visionary Strategist and Empowerment Architect"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              {/* Credentials Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-elevated border border-border">
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-gold" />
                  <div>
                    <div className="font-body text-sm font-semibold text-foreground">MBA + Doctorate</div>
                    <div className="font-body text-xs text-muted-foreground">Educational Leadership</div>
                  </div>
                </div>
              </div>
              
              {/* Experience Card */}
              <div className="absolute -top-4 -right-4 bg-card p-4 rounded-xl shadow-elevated border border-border">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-gold" />
                  <div>
                    <div className="font-body text-sm font-semibold text-foreground">Pattern Recognition</div>
                    <div className="font-body text-xs text-muted-foreground">Systems Thinker</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Why Clarity{" "}
                  <span className="text-gradient-gold">Precedes Action</span>
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  Most entrepreneurs are working hard on the wrong things. Not because 
                  they're lazy or uninformed—but because they haven't been shown how to 
                  see their business as a system.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  Dr. Romulus's academic foundation (MBA, Doctorate in Educational Leadership) 
                  combined with real-world experience as a financial advisor, consultant, and 
                  systems builder, allows her to guide from both theory and practice.
                </p>
                <p className="font-body text-foreground leading-relaxed">
                  The result: clarity that precedes action, so every step you take actually moves the needle.
                </p>
              </div>
              
              <div className="bg-muted/50 rounded-2xl p-8 border border-border">
                <blockquote className="font-display text-xl text-foreground italic mb-4">
                  "When people understand the system, they can navigate it—and win—on their own terms."
                </blockquote>
                <cite className="font-body text-sm text-gold not-italic">
                  — Dr. Deanna Romulus
                </cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The{" "}
              <span className="text-gradient-gold">Approach</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Three principles guide every engagement—regardless of scope or duration.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {approach.map((item) => (
              <div
                key={item.title}
                className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              The <span className="text-gradient-gold">Foundation</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Raised in an underserved community, Dr. Romulus understands how lack 
              of access to clear information can limit opportunity. That lived 
              experience fuels everything.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-8 rounded-2xl bg-card border border-border hover:border-gold/30 transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 mx-auto">
                  <value.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ChecklistCTA
        variant="dark"
        heading="Ready to See What's Actually Happening?"
        description="The Fundability & Systems Checklist reveals the specific gaps in your business—so you can finally fix the right thing."
        buttonText="Get the Checklist"
      />
    </Layout>
  );
}
