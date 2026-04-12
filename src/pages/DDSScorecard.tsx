import { useState } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const QUESTIONS = [
  "Do you have a clearly defined primary offer?",
  "Is your revenue predictable month-to-month?",
  "Do you have a structured client acquisition system?",
  "Do you know the primary constraint limiting your income?",
  "Do your offers align with a clear revenue architecture?",
];

const OPTIONS = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Somewhat", value: "somewhat", points: 1 },
  { label: "No", value: "no", points: 0 },
];
const OPTIONS_Q2 = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Sometimes", value: "sometimes", points: 1 },
  { label: "No", value: "no", points: 0 },
];
const OPTIONS_Q4 = [
  { label: "Yes", value: "yes", points: 2 },
  { label: "Unsure", value: "unsure", points: 1 },
  { label: "No", value: "no", points: 0 },
];

function getOptionsForQuestion(index: number) {
  if (index === 1) return OPTIONS_Q2;
  if (index === 3) return OPTIONS_Q4;
  return OPTIONS;
}

function getResult(score: number) {
  if (score <= 3) {
    return {
      stage: "Diagnose",
      message: "Your business has foundational gaps. Before you scale, you need to identify what's actually broken.",
      cta: "Identify your primary constraint",
      url: "/diagnostickit",
      buttonLabel: "Get the Diagnostic Kit — $27",
      recommendedOffer: "Diagnostic Kit",
    };
  }
  if (score <= 7) {
    return {
      stage: "Design",
      message: "Your business has some structure, but something is misaligned. Fixing the right constraint will unlock your next level of growth.",
      cta: "Fix your next constraint",
      url: "/content-to-cash",
      buttonLabel: "Get the 7-Day Content-to-Cash Setup — $297",
      recommendedOffer: "7-Day Content-to-Cash Setup",
    };
  }
  return {
    stage: "Scale",
    message: "You've built a strong foundation. Now it's time to refine your revenue architecture and scale with precision.",
    cta: "Build your revenue blueprint",
    url: "/revenue-architecture-session",
    buttonLabel: "Book Your Revenue Architecture Session — $500+",
    recommendedOffer: "Revenue Architecture Session",
  };
}

const DDSScorecard = () => {
  const [step, setStep] = useState<"capture" | "quiz" | "result">("capture");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", email: "", phone: "" });
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const calculateScore = () => {
    let total = 0;
    QUESTIONS.forEach((_, i) => {
      const opts = getOptionsForQuestion(i);
      const opt = opts.find((o) => o.value === answers[i]);
      if (opt) total += opt.points;
    });
    return total;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        full_name: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        source: "dds-scorecard",
        status: "new",
      });
      if (error) throw error;

      supabase.functions.invoke("ghl-dds-webhook", {
        body: {
          firstName: formData.firstName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
      }).catch((err) => console.error("GHL webhook error:", err));

      setStep("quiz");
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (!allAnswered) return;
    const score = calculateScore();
    const result = getResult(score);

    supabase.functions.invoke("ghl-dds-webhook", {
      body: {
        firstName: formData.firstName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        quizScore: score,
        quizStage: result.stage,
        recommendedOffer: result.recommendedOffer,
      },
    }).catch((err) => console.error("GHL quiz update error:", err));

    setStep("result");
  };

  const score = calculateScore();
  const result = getResult(score);

  return (
    <>
      <SEOHead
        title="DDS Founder Score™ | Dr. Deanna Romulus"
        description="Take the DDS Founder Score assessment to discover how structurally prepared your business is for predictable revenue."
        canonicalUrl="/dds-scorecard"
      />

      <div className="min-h-screen bg-[hsl(var(--slate-deep))] text-[hsl(var(--cream))] font-body">
        {/* Header */}
        <header className="py-6 border-b border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center">
            <p className="text-[hsl(var(--gold))] font-display text-lg font-semibold tracking-wide">
              Dr. Deanna Romulus, MBA
            </p>
          </div>
        </header>

        {/* Lead Capture Step */}
        {step === "capture" && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-lg">
              <div className="text-center mb-10">
                <p className="text-[hsl(var(--gold))] font-medium tracking-widest uppercase text-sm mb-4">
                  Free Assessment
                </p>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Discover Your DDS Founder Score™
                </h1>
                <p className="text-lg" style={{ color: "hsl(220 15% 70%)" }}>
                  Answer 5 quick questions to see how structurally prepared your business is for predictable revenue.
                </p>
              </div>

              <div className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
                <p className="text-center text-sm mb-6" style={{ color: "hsl(220 15% 60%)" }}>
                  Enter your information to access the scorecard.
                </p>

                <form onSubmit={handleLeadSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="firstName" className="text-[hsl(var(--cream))]">First Name</Label>
                    <Input
                      id="firstName"
                      required
                      maxLength={100}
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                      className="mt-1.5 bg-[hsl(var(--slate-deep))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
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
                      className="mt-1.5 bg-[hsl(var(--slate-deep))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-[hsl(var(--cream))]">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      maxLength={20}
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                      className="mt-1.5 bg-[hsl(var(--slate-deep))] border-[hsl(var(--gold)/0.2)] text-[hsl(var(--cream))] placeholder:text-[hsl(220,15%,45%)]"
                    />
                  </div>

                  <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Loading…" : "Start the Scorecard"}
                  </Button>

                  <p className="text-center text-xs mt-3" style={{ color: "hsl(220 15% 50%)" }}>
                    No spam. Your information is kept private.
                  </p>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* Quiz Step */}
        {step === "quiz" && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-2xl">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 text-[hsl(var(--gold))] mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Welcome, {formData.firstName}!</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
                  Your DDS Founder Scorecard
                </h1>
                <p className="text-lg" style={{ color: "hsl(220 15% 70%)" }}>
                  Answer each question honestly for the most accurate result.
                </p>
              </div>

              <div className="space-y-8">
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2" style={{ color: "hsl(220 15% 60%)" }}>
                    <span>{answeredCount} of {QUESTIONS.length} answered</span>
                    <span>{Math.round((answeredCount / QUESTIONS.length) * 100)}%</span>
                  </div>
                  <Progress value={(answeredCount / QUESTIONS.length) * 100} className="h-2 bg-[hsl(var(--slate-medium))]" />
                </div>

                {QUESTIONS.map((question, qIndex) => {
                  const opts = getOptionsForQuestion(qIndex);
                  return (
                    <div
                      key={qIndex}
                      className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.15)] rounded-xl p-6"
                    >
                      <p className="font-medium mb-4 text-lg">
                        <span className="text-[hsl(var(--gold))] mr-2">{qIndex + 1}.</span>
                        {question}
                      </p>
                      <RadioGroup
                        value={answers[qIndex] || ""}
                        onValueChange={(val) => setAnswers((prev) => ({ ...prev, [qIndex]: val }))}
                        className="flex flex-col sm:flex-row gap-3"
                      >
                        {opts.map((opt) => (
                          <Label
                            key={opt.value}
                            htmlFor={`q${qIndex}-${opt.value}`}
                            className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-3 transition-all ${
                              answers[qIndex] === opt.value
                                ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.1)]"
                                : "border-[hsl(var(--gold)/0.15)] hover:border-[hsl(var(--gold)/0.3)]"
                            }`}
                          >
                            <RadioGroupItem
                              value={opt.value}
                              id={`q${qIndex}-${opt.value}`}
                              className="border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))]"
                            />
                            <span className="text-[hsl(var(--cream))]">{opt.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                })}

                <div className="text-center pt-4">
                  <Button variant="gold" size="lg" onClick={handleQuizSubmit} disabled={!allAnswered}>
                    See My DDS Score
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Result Step */}
        {step === "result" && (
          <section className="py-20 md:py-28">
            <div className="container mx-auto px-6 max-w-2xl">
              <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="bg-[hsl(var(--slate-medium))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
                  <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-2">
                    Your DDS Founder Score
                  </p>
                  <p className="font-display text-6xl font-bold mb-2 text-[hsl(var(--gold))]">
                    {score}<span className="text-2xl text-[hsl(var(--cream))]">/10</span>
                  </p>
                  <p className="text-[hsl(var(--gold-light))] font-medium text-lg mb-4">
                    Stage: {result.stage}
                  </p>
                  <p className="text-lg mb-8" style={{ color: "hsl(220 15% 70%)" }}>
                    {result.message}
                  </p>

                  <div className="border-t border-[hsl(var(--gold)/0.15)] pt-6">
                    <p className="text-sm mb-4" style={{ color: "hsl(220 15% 60%)" }}>
                      {result.cta}
                    </p>
                    <Button variant="gold" size="lg" asChild>
                      <Link to={result.url}>
                        {result.buttonLabel}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 border-t border-[hsl(var(--gold)/0.1)]">
          <div className="container mx-auto px-6 text-center text-sm" style={{ color: "hsl(220 15% 45%)" }}>
            © {new Date().getFullYear()} Dr. Deanna Romulus, MBA. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
};

export default DDSScorecard;
