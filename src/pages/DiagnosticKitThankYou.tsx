import { useEffect } from "react";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Download,
  PlayCircle,
  BookOpen,
  Headphones,
  ArrowRight,
} from "lucide-react";

const CHECKLIST_DOWNLOAD_URL = "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69d582a9f5ebf27de32824a5.pdf";
const GUIDE_DOWNLOAD_URL = "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69d582a9a64a04ba15c23fc6.pdf";
const AUDIO_URL = "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69d67350eaae8b1b71d51e41.mp3";
const UPSELL_URL = "/income-clarity-diagnostic";

const DiagnosticKitThankYou = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).pintrk) {
      (window as any).pintrk('track', 'checkout', {
        event_id: 'eventId0001',
        value: 27,
        order_quantity: 1,
        currency: 'USD',
        lead_type: 'DiagnosticKit',
        line_items: [{ product_price: 27 }]
      });
    }
  }, []);

  return (
    <>
      <SEOHead
        title="Your Diagnostic Kit Is Ready | Dr. Romulus MBA"
        description="Access your Complete Income Systems Diagnostic Kit™ materials."
        noindex
      />

      <div className="min-h-screen bg-slate-900 text-white font-body">
        {/* ── HERO ── */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
              You're In. Your Diagnostic Kit Is Ready Below.
            </h1>
            <p className="text-slate-400 text-lg">
              Your confirmation email has also been sent.
            </p>
          </div>
        </section>

        {/* ── DELIVERY STEPS ── */}
        <section className="pb-20 md:pb-28">
          <div className="container mx-auto px-6 max-w-3xl space-y-8">
            {/* Step 1 */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 font-display font-bold text-lg">
                  Step 1
                </span>
                <Download className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">
                Download Your Diagnostic Checklist
              </h2>
              <p className="text-slate-400 text-sm mb-5">
                Print or save this checklist and work through it section by
                section.
              </p>
              <Button variant="gold" asChild>
                <a href={CHECKLIST_DOWNLOAD_URL}>
                  Download Checklist
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 font-display font-bold text-lg">
                  Step 2
                </span>
                <PlayCircle className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">
                Watch The Walkthrough Video
              </h2>
              <p className="text-slate-400 text-sm mb-5">
                This 10-minute video walks you through interpreting your
                results.
              </p>
              <video
                className="aspect-video w-full rounded-lg border border-slate-600"
                controls
                preload="metadata"
                poster=""
              >
                <source
                  src="https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69d56d55478d55a7cd044325.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 font-display font-bold text-lg">
                  Step 3
                </span>
                <BookOpen className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-2">
                Review Your Results Guide
              </h2>
              <p className="text-slate-400 text-sm mb-5">
                Learn what to fix first, what can wait, and how to prioritize.
              </p>
              <Button variant="gold" asChild>
                <a href={GUIDE_DOWNLOAD_URL}>
                  Download Guide
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-amber-400 font-display font-bold text-lg">
                  Step 4
                </span>
                <Headphones className="w-5 h-5 text-slate-400" />
              </div>
              <h2 className="font-display text-xl font-semibold mb-5">
                Founder Briefing: Why Effort Isn't the Problem — Structure Is
              </h2>
              <audio
                className="w-full"
                controls
                preload="metadata"
              >
                <source
                  src={AUDIO_URL}
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </section>

        {/* ── INCOME CLARITY DIAGNOSTIC UPSELL ── */}
        <section className="pb-20 md:pb-28">
          <div className="container mx-auto px-6 max-w-2xl">
            <div className="border border-amber-500/20 rounded-xl p-8 md:p-10 bg-slate-800/30">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4">
                Want Expert Guidance Reviewing Your Results?
              </h2>

              <div className="space-y-4 text-slate-300 leading-relaxed mb-8">
                <p>
                  The Diagnostic Kit gives you{" "}
                  <span className="text-white font-medium">clarity</span>.
                </p>
                <p>
                  The Income Clarity Diagnostic provides{" "}
                  <span className="text-white font-medium">structured review</span>.
                </p>
              </div>

              <p className="text-slate-400 text-sm uppercase tracking-wider mb-4">
                During this private 60-minute session we will:
              </p>

              <ul className="space-y-3 text-slate-300 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Confirm your primary structural constraint</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Identify your highest-leverage correction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Clarify the correct repair sequence</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span>Determine whether Systems Before Scale™ is the appropriate next step</span>
                </li>
              </ul>

              <p className="text-slate-500 text-sm text-center mb-6">
                This is a focused evaluation session — not open coaching.
              </p>

              <div className="text-center space-y-4">
                <p className="text-white font-display text-xl font-semibold">
                  Investment: $297
                </p>
                <Button variant="gold" size="lg" asChild>
                  <a href={UPSELL_URL}>
                    Proceed to Diagnostic Booking
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Button>
                <p className="text-slate-600 text-xs pt-2">
                  Limited weekly availability to ensure focused evaluation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER NOTE ── */}
        <footer className="pb-10 text-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Dr. Romulus MBA. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default DiagnosticKitThankYou;
