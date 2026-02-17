import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  PlayCircle,
  BookOpen,
  Headphones,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

const PAYMENT_URL = "https://link.drromulusmba.com/payment-link/69939e59e6b9117c66e733dd";

const DiagnosticKit = () => {
  return (
    <>
      <SEOHead
        title="Complete Income Systems Diagnostic Kit™"
        description="Identify the structural bottleneck blocking your revenue. A $27 diagnostic kit for service-based business owners who want income clarity before scaling."
        canonicalUrl="/diagnostickit"
      />

      <div className="min-h-screen bg-slate-900 text-white font-body">
        {/* ── HERO ── */}
        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800" />
          <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
            <p className="text-amber-400 font-medium tracking-wide uppercase text-sm mb-6">
              Complete Income Systems Diagnostic Kit™
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              The Real Reason Your Income Is Unpredictable — And What to Fix
              First
            </h1>
            <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
              Before you spend another dollar on marketing, identify what is
              structurally blocking your revenue.
            </p>
            <p className="text-slate-400 text-sm mb-10">
              Created by{" "}
              <span className="text-white font-medium">
                Dr. Deanna Romulus, MBA
              </span>{" "}
              · Systems &amp; Income Clarity Strategist
            </p>
            <Button variant="gold" size="xl" asChild>
              <a href={PAYMENT_URL} className="group">
                Reveal My Income Bottleneck – $27
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </section>

        {/* ── WHO THIS IS FOR ── */}
        <section className="py-20 md:py-24 bg-slate-800/50">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
              Who This Diagnostic Is For
            </h2>
            <ul className="space-y-4 text-lg text-slate-300 mb-12">
              {[
                "Service-based business owners earning but not consistently",
                "Those who feel busy but unclear",
                "Those who have tried strategies that didn't stick",
                "Those who want structure before scaling",
                "Those who value clarity over hype",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="border border-slate-700 rounded-xl p-6 bg-slate-800/60">
              <p className="text-slate-400 text-sm font-medium uppercase tracking-wide mb-3">
                This Is Not For
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                People looking for a "get rich quick" tactic, those unwilling to
                examine their own systems honestly, or anyone expecting results
                without doing the diagnostic work.
              </p>
            </div>
          </div>
        </section>

        {/* ── REFRAME ── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
              Most Entrepreneurs Are Trying to Scale Chaos.
            </h2>
            <div className="space-y-4 text-lg md:text-xl text-slate-300 leading-relaxed">
              <p>More marketing doesn't fix broken systems.</p>
              <p>Without structure, growth magnifies confusion.</p>
              <p>Fixing the wrong thing wastes months.</p>
              <p className="text-white font-medium">
                Fixing the right thing stabilizes everything.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section className="py-20 md:py-24 bg-slate-800/50">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-14">
              Inside The Complete Diagnostic Kit™
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: ClipboardCheck,
                  title: "Income Systems Diagnostic Checklist",
                  desc: "A structured self-assessment that identifies the exact revenue bottlenecks hiding inside your business operations.",
                },
                {
                  icon: PlayCircle,
                  title: "20-Minute Walkthrough Video",
                  desc: "Step-by-step guidance on interpreting your results and avoiding common misdiagnosis that leads to wasted effort.",
                },
                {
                  icon: BookOpen,
                  title: "Diagnostic Results Interpretation Guide",
                  desc: "Clear instructions on what to fix first, what can wait, and how to prioritize for the fastest path to stability.",
                },
                {
                  icon: Headphones,
                  title: "Private Audio Training",
                  desc: "Why effort isn't the problem — structure is. A focused training on shifting from activity-based to systems-based growth.",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 flex gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold mb-1">
                      {title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT HAPPENS AFTER ── */}
        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
              What Happens After You Buy
            </h2>
            <div className="space-y-6 text-lg text-slate-300">
              {[
                "Immediate redirect to your access page",
                "Confirmation email sent instantly",
                "Step-by-step instructions to complete your diagnostic",
              ].map((step) => (
                <div key={step} className="flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUARANTEE ── */}
        <section className="py-20 md:py-24 bg-slate-800/50">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7 text-amber-400" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              7-Day Clarity Guarantee
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              If this diagnostic does not bring clarity to your income
              structure, contact us within 7 days for a full refund.
            </p>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready for Income Clarity?
            </h2>
            <p className="text-slate-400 mb-10">
              One diagnostic. One decision. Total structural clarity.
            </p>
            <Button variant="gold" size="xl" asChild>
              <a href={PAYMENT_URL} className="group">
                Reveal My Income Bottleneck – $27
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <p className="text-slate-500 text-xs mt-6">
              © {new Date().getFullYear()} Dr. Romulus MBA. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default DiagnosticKit;
