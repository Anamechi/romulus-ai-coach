import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  { id: 1, title: "About You" },
  { id: 2, title: "Your Business" },
  { id: 3, title: "Goals & Challenges" },
  { id: 4, title: "Confirm" },
];

export default function Apply() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    name: "",
    email: "",
    phone: "",
    // Step 2
    businessName: "",
    industry: "",
    yearsInBusiness: "",
    annualRevenue: "",
    teamSize: "",
    // Step 3
    biggestChallenge: "",
    goals: "",
    timeline: "",
    investmentReady: "",
    // Step 4
    howHeard: "",
    additionalNotes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in your name and email address.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.businessName || !formData.industry || !formData.yearsInBusiness || !formData.annualRevenue) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required business information.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 3:
        if (!formData.biggestChallenge || !formData.goals || !formData.timeline || !formData.investmentReady) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required fields about your goals and challenges.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("applications").insert({
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        business_name: formData.businessName,
        business_stage: `${formData.industry} | ${formData.yearsInBusiness} | Team: ${formData.teamSize}`,
        revenue_range: formData.annualRevenue,
        challenges: formData.biggestChallenge,
        goals: `${formData.goals}\n\nTimeline: ${formData.timeline}\nInvestment Ready: ${formData.investmentReady}`,
        how_found_us: formData.howHeard,
        notes: formData.additionalNotes || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "We'll review your application and reach out within 48 hours.",
      });
      
      // Reset form
      setCurrentStep(1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessName: "",
        industry: "",
        yearsInBusiness: "",
        annualRevenue: "",
        teamSize: "",
        biggestChallenge: "",
        goals: "",
        timeline: "",
        investmentReady: "",
        howHeard: "",
        additionalNotes: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-cream mb-4">
              Apply for Coaching
            </h1>
            <p className="font-body text-cream/70">
              Take the first step toward building a business that runs without you.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-12">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-body text-sm font-semibold transition-all ${
                    currentStep >= step.id
                      ? "bg-gold text-slate-deep"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden sm:block w-16 md:w-24 h-1 mx-2 rounded ${
                      currentStep > step.id ? "bg-gold" : "bg-muted"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: About You */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    About You
                  </h2>
                  
                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Your Business */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Your Business
                  </h2>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Industry *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    >
                      <option value="">Select industry</option>
                      <option value="consulting">Consulting/Professional Services</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="saas">SaaS/Technology</option>
                      <option value="agency">Agency (Marketing/Creative)</option>
                      <option value="coaching">Coaching/Training</option>
                      <option value="healthcare">Healthcare/Wellness</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-sm font-medium text-foreground mb-2 block">
                        Years in Business *
                      </label>
                      <select
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                      >
                        <option value="">Select</option>
                        <option value="0-1">Less than 1 year</option>
                        <option value="1-3">1-3 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="5-10">5-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-body text-sm font-medium text-foreground mb-2 block">
                        Annual Revenue *
                      </label>
                      <select
                        name="annualRevenue"
                        value={formData.annualRevenue}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                      >
                        <option value="">Select</option>
                        <option value="0-100k">Under $100K</option>
                        <option value="100k-250k">$100K - $250K</option>
                        <option value="250k-500k">$250K - $500K</option>
                        <option value="500k-1m">$500K - $1M</option>
                        <option value="1m-5m">$1M - $5M</option>
                        <option value="5m+">$5M+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Team Size
                    </label>
                    <select
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    >
                      <option value="">Select</option>
                      <option value="solo">Just me</option>
                      <option value="2-5">2-5 people</option>
                      <option value="6-10">6-10 people</option>
                      <option value="11-25">11-25 people</option>
                      <option value="25+">25+ people</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Goals & Challenges */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Goals & Challenges
                  </h2>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      What's your biggest business challenge right now? *
                    </label>
                    <textarea
                      name="biggestChallenge"
                      value={formData.biggestChallenge}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold resize-none"
                      placeholder="Describe the #1 thing holding your business back..."
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      What would success look like in 12 months? *
                    </label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold resize-none"
                      placeholder="Revenue targets, lifestyle changes, team growth..."
                    />
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      When do you want to start? *
                    </label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    >
                      <option value="">Select</option>
                      <option value="immediately">Immediately</option>
                      <option value="this-month">This month</option>
                      <option value="next-quarter">Next quarter</option>
                      <option value="exploring">Just exploring</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Are you ready to invest in coaching? *
                    </label>
                    <select
                      name="investmentReady"
                      value={formData.investmentReady}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes, I'm ready to invest</option>
                      <option value="need-info">Need more information first</option>
                      <option value="budget-constraints">Have budget constraints to discuss</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Almost Done!
                  </h2>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      How did you hear about us?
                    </label>
                    <select
                      name="howHeard"
                      value={formData.howHeard}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold"
                    >
                      <option value="">Select</option>
                      <option value="google">Google Search</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Referral</option>
                      <option value="podcast">Podcast</option>
                      <option value="youtube">YouTube</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-body text-sm font-medium text-foreground mb-2 block">
                      Anything else you'd like us to know?
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card font-body focus:outline-none focus:border-gold resize-none"
                      placeholder="Optional: Share any additional context..."
                    />
                  </div>

                  {/* Summary */}
                  <div className="p-6 rounded-xl bg-muted/50 border border-border">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                      Application Summary
                    </h3>
                    <div className="space-y-2 font-body text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {formData.name}</p>
                      <p><span className="text-muted-foreground">Business:</span> {formData.businessName}</p>
                      <p><span className="text-muted-foreground">Revenue:</span> {formData.annualRevenue}</p>
                      <p><span className="text-muted-foreground">Timeline:</span> {formData.timeline}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <Button type="button" variant="gold" onClick={handleNext}>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" variant="gold" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
