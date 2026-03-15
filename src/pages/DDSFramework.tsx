import { useState } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import drRomulus from "@/assets/dr-romulus.jpeg";

const DIAGNOSTIC_KIT_URL = "https://link.drromulusmba.com/payment-link/69939e59e6b9117c66e733dd";

const STAGES = [
  { label: "Awareness", desc: "Recognize what's broken" },
  { label: "Diagnosis", desc: "Identify the root constraint" },
  { label: "Clarity", desc: "Map the real problem" },
  { label: "Architecture", desc: "Design the right structure" },
  { label: "Systems", desc: "Build repeatable processes" },
  { label: "Scale", desc: "Grow with confidence" },
];

const LEARN_POINTS = [
  "Why most founders struggle with inconsistent revenue",
  "The six stages of the DDS Framework™",
  "How structural problems create income instability",
  "The difference between effort and architecture in business growth",
  "The first step to designing predictable revenue",
];

const DDSFramework = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        full_name: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        source: "dds-framework",
        status: "new",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("dds-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEOHead
        title="DDS Framework™ Breakdown Guide | Dr. Deanna Romulus"
        description="Discover the DDS Framework™ — Diagnose, Design, Scale. Learn how founders build predictable revenue by fixing structural problems first."
        canonicalUrl="/dds-framework"
      />

      <div className="min-h-screen bg-[hsl(var(--slate-deep))] text-[hsl(var(--cream))] font-body">
        {/* ── SECTION 1: HERO ── */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
            <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-4">
              The DDS Framework™
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover the Framework Behind Predictable Revenue
            </h1>
            <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto" style={{ color: "hsl(220 15% 70%)" }}>
              The DDS Framework™ shows founders how to diagnose structural problems in their business, design the right revenue architecture, and build predictable income systems.
            </p>
            <p className="text-[hsl(var(--gold-light))] text-sm italic mb-10">
              If you commented DDS on social media, you're in the right place.
            </p>

            <Button variant="gold" size="xl" onClick={scrollToForm}>
              Get the DDS Framework Breakdown
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm" style={{ color: "hsl(220 15% 65%)" }}>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Free breakdown guide</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Takes less than 5 minutes to read</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Built for service-based founders</span>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: FRAMEWORK OVERVIEW ── */}
        <section className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-5">
                What Is the DDS Framework™?
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: "hsl(220 15% 70%)" }}>
                The DDS Framework™ helps founders build predictable revenue by diagnosing structural problems, designing the correct business architecture, and scaling responsibly.
              </p>
            </div>

            {/* Diagnose → Design → Scale visual */}
            <div className="flex items-center justify-center gap-3 md:gap-6 mb-16 flex-wrap">
              {["Diagnose", "Design", "Scale"].map((step, i) => (
                <div key={step} className="flex items-center gap-3 md:gap-6">
                  <div className="bg-[hsl(var(--gold))] text-[hsl(var(--slate-deep))] font-semibold px-6 py-3 rounded-lg text-lg">
                    {step}
                  </div>
                  {i < 2 && <ChevronRight className="h-6 w-6 text-[hsl(var(--gold-light))] hidden sm:block" />}
                </div>
              ))}
            </div>

            {/* Expanded 6 stages */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {STAGES.map((stage, i) => (
                <div key={stage.label} className="border border-[hsl(var(--gold)/0.2)] rounded-lg p-5 bg-[hsl(var(--slate-deep)/0.5)]">
                  <span className="text-[hsl(var(--gold))] font-mono text-sm mb-1 block">0{i + 1}</span>
                  <h3 className="font-display text-lg font-semibold mb-1">{stage.label}</h3>
                  <p className="text-sm" style={{ color: "hsl(220 15% 60%)" }}>{stage.desc}</p>
                </div>
              ))}
            </div>

            {/* Credibility — Dr. Romulus photo */}
            <div className="mt-16 flex flex-col sm:flex-row items-center gap-5 justify-center">
              <img
                src={drRomulus}
                alt="Dr. Deanna Romulus, MBA"
                className="w-20 h-20 rounded-full object-cover border-2 border-[hsl(var(--gold)/0.4)]"
                loading="lazy"
              />
              <div className="text-center sm:text-left">
                <p className="font-display font-semibold">Dr. Deanna Romulus, MBA</p>
                <p className="text-sm" style={{ color: "hsl(220 15% 60%)" }}>Business Consultant & Revenue Architect</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: WHAT THEY WILL LEARN ── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
              Inside the DDS Framework Breakdown
            </h2>
            <ul className="space-y-4 text-left max-w-xl mx-auto">
              {LEARN_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--gold))] mt-0.5 shrink-0" />
                  <span className="text-lg" style={{ color: "hsl(220 15% 75%)" }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── SECTION 4: LEAD CAPTURE FORM / SECTION 5: THANK YOU ── */}
        <section id="dds-form" className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
          <div className="container mx-auto px-6 max-w-lg">
            {!submitted ? (
              <div className="bg-[hsl(var(--slate-deep))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-3">
                  Get the DDS Framework Breakdown
                </h2>
                <p className="text-center text-sm mb-8" style={{ color: "hsl(220 15% 60%)" }}>
                  Enter your information below and we'll send you the DDS Framework Breakdown Guide.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="firstName" className="text-[hsl(var(--cream))]">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      maxLength={100}
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                      className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[hsl(var(--cream))]">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      maxLength={255}
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                      className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[hsl(var(--cream))]">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      maxLength={20}
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="mt-1.5 bg-[hsl(var(--slate-medium))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending…" : "Send Me the DDS Framework Guide"}
                  </Button>
                </form>
              </div>
            ) : (
              /* ── THANK YOU + NEXT STEP ── */
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--gold)/0.15)] mb-6">
                  <CheckCircle2 className="h-8 w-8 text-[hsl(var(--gold))]" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Your DDS Framework Breakdown Is On Its Way
                </h2>
                <p className="text-lg mb-10" style={{ color: "hsl(220 15% 70%)" }}>
                  Check your email for the guide.
                </p>
                <p className="mb-6" style={{ color: "hsl(220 15% 65%)" }}>
                  If you want to go deeper, the next step is identifying the structural constraint currently blocking predictable revenue in your business.
                </p>

                <div className="bg-[hsl(var(--slate-deep))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 text-left mt-8">
                  <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-3">
                    Next Step
                  </p>
                  <h3 className="font-display text-2xl font-bold mb-3">
                    Complete Income Systems Diagnostic Kit™
                  </h3>
                  <p className="mb-6" style={{ color: "hsl(220 15% 65%)" }}>
                    This diagnostic identifies the primary income constraint within your business and shows you the structural changes needed to create predictable revenue.
                  </p>
                  <Button variant="gold" size="lg" asChild>
                    <a href={DIAGNOSTIC_KIT_URL} target="_blank" rel="noopener noreferrer">
                      Get the Complete Income Systems Diagnostic Kit ($27)
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Social Proof Placeholder ── */}
        <section className="py-16 bg-[hsl(var(--slate-deep))]">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <p className="text-sm uppercase tracking-wider mb-3 text-[hsl(var(--gold))]">What founders are saying</p>
            <p className="italic text-lg" style={{ color: "hsl(220 15% 55%)" }}>
              Testimonials coming soon.
            </p>
          </div>
        </section>

        {/* ── Minimal Footer ── */}
        <footer className="py-8 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center text-sm" style={{ color: "hsl(220 15% 45%)" }}>
            © {new Date().getFullYear()} Dr. Deanna Romulus, MBA. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default DDSFramework;
