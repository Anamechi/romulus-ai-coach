import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Download,
  Play,
  BookOpen,
  Headphones,
  ArrowRight,
} from "lucide-react";

export default function DiagnosticThankYou() {
  return (
    <>
      <SEOHead
        title="Your Diagnostic Kit Is Ready | Dr. Romulus MBA"
        description="Access your Complete Income Systems Diagnostic Kit."
        canonicalUrl="/diagnostic-thank-you"
        ogType="website"
        noindex
      />

      <div className="min-h-screen bg-slate-900 text-white font-body">
        {/* ── Hero ── */}
        <section className="py-28 text-center md:py-36">
          <div className="mx-auto max-w-3xl px-6">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-4xl font-bold md:text-5xl">
              You're In. Your Diagnostic Kit Is Ready Below.
            </h1>
            <p className="mt-4 text-slate-400">
              Your confirmation email has also been sent.
            </p>
          </div>
        </section>

        {/* ── Delivery Steps ── */}
        <section className="bg-slate-800/40 py-24">
          <div className="mx-auto max-w-3xl space-y-12 px-6">
            {/* Step 1 */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-400">
                Step 1
              </p>
              <h2 className="font-display text-2xl font-bold">
                Download Your Diagnostic Checklist
              </h2>
              <p className="mt-2 text-slate-400">
                Print it or fill it out digitally — either way, complete it before watching the video.
              </p>
              <Button variant="gold" className="mt-6" asChild>
                <a href="#CHECKLIST_DOWNLOAD_LINK">
                  <Download className="mr-2 h-4 w-4" />
                  Download Checklist
                </a>
              </Button>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-400">
                Step 2
              </p>
              <h2 className="font-display text-2xl font-bold">
                Watch The Walkthrough Video
              </h2>
              <p className="mt-2 text-slate-400">
                Dr. Romulus walks you through interpreting your results so you avoid misdiagnosis.
              </p>
              <div className="mt-6 flex aspect-video items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                <Play className="h-12 w-12 text-slate-600" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-400">
                Step 3
              </p>
              <h2 className="font-display text-2xl font-bold">
                Review Your Results Guide
              </h2>
              <p className="mt-2 text-slate-400">
                Understand what to fix first, what can wait, and why the sequence matters.
              </p>
              <Button variant="gold" className="mt-6" asChild>
                <a href="#GUIDE_DOWNLOAD_LINK">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Open Results Guide
                </a>
              </Button>
            </div>

            {/* Step 4 */}
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8">
              <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-400">
                Step 4
              </p>
              <h2 className="font-display text-2xl font-bold">
                Listen To The Private Audio
              </h2>
              <p className="mt-2 text-slate-400">
                Why effort isn't the problem — structure is.
              </p>
              <div className="mt-6 flex h-16 items-center justify-center rounded-xl border border-slate-700 bg-slate-900">
                <Headphones className="mr-2 h-5 w-5 text-slate-600" />
                <span className="text-sm text-slate-600">Audio embed placeholder</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Next Step ── */}
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              When You're Finished…
            </p>
            <h2 className="mt-4 font-display text-2xl font-bold md:text-3xl">
              If your results reveal deeper structural gaps, learn about the{" "}
              <span className="text-amber-400">Income Systems Review</span>.
            </h2>
            <Button variant="outline" className="mt-8 border-slate-600 text-slate-300 hover:border-amber-400 hover:text-amber-400" asChild>
              <a href="#INCOME_SYSTEMS_REVIEW_LINK">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Dr. Deanna Romulus, MBA · DrRomulusMBA.com
        </footer>
      </div>
    </>
  );
}
