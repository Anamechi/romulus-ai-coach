import { SEOHead } from "@/components/seo/SEOHead";
import { CheckCircle2 } from "lucide-react";

const IncomeClarityDiagnostic = () => {
  return (
    <>
      <SEOHead
        title="Income Clarity Diagnostic | Dr. Romulus MBA"
        description="Book a structured 60-minute evaluation session to identify your highest-leverage next step."
        canonicalUrl="/income-clarity-diagnostic"
      />

      <div className="min-h-screen bg-slate-900 text-white font-body">
        {/* ── HERO ── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              Income Clarity Diagnostic
            </h1>
            <p className="text-slate-400 text-lg md:text-xl mb-6">
              A structured 60-minute evaluation to determine your highest-leverage next step.
            </p>
            <p className="text-slate-500 text-sm">
              With <span className="text-white font-medium">Dr. Deanna Romulus, MBA</span>
              <br />
              Systems &amp; Income Clarity Strategist
            </p>
          </div>
        </section>

        {/* ── WHAT THIS SESSION IS ── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="border border-slate-700 rounded-xl p-8 md:p-10 bg-slate-800/40">
              <h2 className="font-display text-2xl font-bold mb-6">
                What This Session Is
              </h2>
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">
                This session is designed to:
              </p>
              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Review your completed Diagnostic Kit</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Identify the primary structural constraint</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Clarify the correct repair sequence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Determine whether Systems Before Scale™ is appropriate</span>
                </li>
              </ul>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>This is not an open coaching call.</p>
                <p>It is a structured evaluation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO THIS IS FOR ── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="border border-slate-700 rounded-xl p-8 md:p-10 bg-slate-800/40">
              <h2 className="font-display text-2xl font-bold mb-6">
                Who This Is For
              </h2>
              <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">
                This session is appropriate for business owners who:
              </p>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Completed the Diagnostic Kit</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Are serious about stabilizing revenue</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Want expert-level clarity before making changes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Are prepared to take structured action</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── INVESTMENT ── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <p className="text-white font-display text-3xl font-bold mb-4">
              Investment: $297
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-400 text-sm">
              <span>One-time session</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>No subscription</span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <span>Focused evaluation</span>
            </div>
          </div>
        </section>

        {/* ── CALENDAR EMBED ── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-2xl">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              Schedule Your Session
            </h2>
            <div className="bg-slate-800/50 rounded-xl p-12 md:p-16 border border-slate-700 text-center">
              <p className="text-slate-500 text-sm">
                [GHL CALENDAR EMBED CODE WILL BE INSERTED HERE]
              </p>
            </div>
          </div>
        </section>

        {/* ── FINAL NOTE ── */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <p className="text-slate-500 text-sm leading-relaxed">
              Please complete your booking only if you are prepared to engage
              seriously in structured implementation.
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="pb-10 text-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Dr. Romulus MBA. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default IncomeClarityDiagnostic;
