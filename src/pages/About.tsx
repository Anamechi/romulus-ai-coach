import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Award, BookOpen, Building, CheckCircle, GraduationCap, Heart, Lightbulb, Target, Users } from "lucide-react";
import drRomulusPhoto from "@/assets/dr-romulus.jpeg";

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
const expertise = [
  {
    icon: Building,
    title: "Business Structure & Credibility",
    description: "Build proper business foundations that stand up to scrutiny from banks, partners, and platforms.",
  },
  {
    icon: Target,
    title: "Fundability-Ready Foundations",
    description: "Create the financial infrastructure needed to access capital when opportunity calls.",
  },
  {
    icon: Lightbulb,
    title: "Automation That Works",
    description: "Implement systems that save time and reduce stress without sacrificing quality or control.",
  },
  {
    icon: Users,
    title: "Growth-Supporting Systems",
    description: "Design operations that support sustainable growth—not burnout.",
  },
];

const values = [
  {
    icon: BookOpen,
    title: "Trust-First Education",
    description: "Teaching entrepreneurs how to build legitimate businesses that stand up to scrutiny from banks, partners, platforms, and AI-driven systems alike.",
  },
  {
    icon: CheckCircle,
    title: "Grounded & Honest",
    description: "No shortcuts. No guaranteed outcomes. Just clarity, structure, and confidence to make informed decisions.",
  },
  {
    icon: Heart,
    title: "Access for All",
    description: "Fueled by lived experience in underserved communities, committed to providing clear information that opens doors.",
  },
];

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About Dr. Deanna Romulus, MBA | Business Strategist & Educator</title>
        <meta name="description" content="Dr. Deanna Romulus, MBA is a business strategist, educator, and automation consultant helping entrepreneurs build structured, credible, and scalable businesses." />
        <script type="application/ld+json">
          {JSON.stringify(personSchema)}
        </script>
      </Helmet>
      
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
                Dr. Deanna Romulus helps entrepreneurs build businesses that are 
                structured, credible, and scalable—without confusion, overwhelm, 
                or shortcuts.
              </p>
              
              <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                With a background spanning marketing, finance, education, and operations, 
                Dr. Romulus brings a rare ability to translate complex systems into clear, 
                practical steps. She is known for helping business owners understand what 
                actually matters when it comes to business setup, fundability, automation, 
                and long-term sustainability.
              </p>

              <Button variant="gold" size="lg" asChild>
                <Link to="/apply">
                  Work With Dr. Romulus
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
                  <Award className="w-8 h-8 text-gold" />
                  <div>
                    <div className="font-body text-sm font-semibold text-foreground">Systems Builder</div>
                    <div className="font-body text-xs text-muted-foreground">Consultant & Advisor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Academic Foundation,{" "}
                  <span className="text-gradient-gold">Real-World Results</span>
                </h2>
                <p className="font-body text-muted-foreground leading-relaxed mb-6">
                  Dr. Romulus holds an MBA with a global perspective and a Doctorate 
                  in Educational Leadership. Her academic foundation, combined with 
                  real-world experience as a financial advisor, consultant, and systems 
                  builder, allows her to coach from both theory and application—never 
                  hype, never guesswork.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed">
                  Raised in an underserved community, Dr. Romulus understands firsthand 
                  how lack of access to clear information can limit opportunity. That 
                  lived experience fuels her commitment to trust-first education.
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

      {/* Expertise Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              How Dr. Romulus{" "}
              <span className="text-gradient-gold">Helps Clients</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Through coaching and consulting, Dr. Romulus equips entrepreneurs 
              with the clarity, structure, and confidence needed to make informed 
              decisions and take aligned next steps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {expertise.map((item) => (
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
              The <span className="text-gradient-gold">Approach</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Grounded, honest, and systems-driven. No promises of shortcuts 
              or guaranteed outcomes—just real education that empowers.
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
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-cream mb-6">
            Ready to Build a Business That Works?
          </h2>
          <p className="font-body text-lg text-cream/70 max-w-2xl mx-auto mb-8">
            Let's discuss how strategic coaching and systems can transform 
            your business into something structured, credible, and scalable.
          </p>
          <Button variant="gold" size="xl" asChild>
            <Link to="/apply">
              Apply for Coaching
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
