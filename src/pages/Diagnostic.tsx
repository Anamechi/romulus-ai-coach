import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  ClipboardCheck,
  Video,
  BookOpen,
  Headphones,
  Shield,
  XCircle,
  Mail,
  Zap,
  ListChecks,
} from "lucide-react";

const PAYMENT_URL = "#PASTE_GHL_PAYMENT_LINK_HERE";

const whoIsFor = [
  "Are earning but not consistently",
  "Feel busy but unclear",
  "Have tried strategies that didn't stick",
  "Want clean structure before scaling",
  "Value clarity over hype",
];

const notFor = [
  "Looking for a magic bullet or overnight fix",
  "Unwilling to look at their own systems honestly",
  "Not yet generating any revenue at all",
];

const kitItems = [
  {
    icon: ClipboardCheck,
    title: "Income Systems Diagnostic Checklist",
    description:
      "A structured self-assessment that identifies exactly where revenue is leaking in your business model.",
  },
  {
    icon: Video,
    title: "20-Minute Walkthrough Video",
    description:
      "Learn how to interpret your results accurately and avoid the most common misdiagnosis traps.",
  },
  {
    icon: BookOpen,
    title: "Diagnostic Results Interpretation Guide",
    description:
      "Clear instructions on what to fix first, what can wait, and why the sequence matters.",
  },
  {
    icon: Headphones,
    title: "Private Audio Training",
    description:
      "Why effort isn't the problem — structure is. A focused training on the income systems framework.",
  },
];

const afterSteps = [
  { icon: Zap, text: "Immediate redirect to your access page" },
  { icon: Mail, text: "Confirmation email sent instantly" },
  { icon: ListChecks, text: "Step-by-step instructions to complete your diagnostic" },
];

export default function Diagnostic() {
  return (
    <>
      <SEOHead
        title="Complete Income Systems Diagnostic Kit | Dr. Romulus MBA"
        description="Identify the structural bottleneck blocking your revenue. The Complete Income Systems Diagnostic Kit helps service business owners find income clarity before scaling."
        canonicalUrl="/diagnostic"
        ogType="website"
      />

      <div className="min-h-screen bg-slate-900 text-white font-body">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #f59e0b 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }} />
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-amber-400">
              Complete Income Systems Diagnostic Kit™
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              The Real Reason Your Income Is Unpredictable —{" "}
              <span className="text-amber-400">And What to Fix First</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
              Before you spend another dollar on marketing, identify what is
              structurally blocking your revenue.
            </p>
            <p className="mt-8 text-sm text-slate-400">
              Created by <span className="text-white font-medium">Dr. Deanna Romulus, MBA</span>
              <br />
              Systems &amp; Income Clarity Strategist
            </p>
            <Button variant="gold" size="xl" className="mt-10" asChild>
              <a href={PAYMENT_URL}>
                Reveal My Income Bottleneck – $27
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* ── Who This Is For ── */}
        <section className="bg-slate-800/40 py-24">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Who This Diagnostic Is For
            </h2>
            <p className="mt-4 text-slate-400">
              This is for service-based business owners who:
            </p>
            <ul className="mt-8 space-y-4">
              {whoIsFor.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-400" />
                  <span className="text-slate-200">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-12 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
              <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">
                This Is Not For You If You're…
              </p>
              <ul className="space-y-3">
                {notFor.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-slate-500">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Reframe ── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Most Entrepreneurs Are Trying to{" "}
              <span className="text-amber-400">Scale Chaos.</span>
            </h2>
            <div className="mx-auto mt-10 max-w-xl space-y-4 text-lg text-slate-300">
              <p>More marketing doesn't fix broken systems.</p>
              <p>Without structure, growth magnifies confusion.</p>
              <p>Fixing the wrong problem wastes months.</p>
              <p className="font-medium text-white">
                Fixing the right one stabilizes everything.
              </p>
            </div>
          </div>
        </section>

        {/* ── What You Get ── */}
        <section className="bg-slate-800/40 py-24">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
              Inside The Complete Diagnostic Kit™
            </h2>
            <div className="mt-14 grid gap-8 sm:grid-cols-2">
              {kitItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8 transition-colors hover:border-amber-400/30"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
                    <item.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What Happens After ── */}
        <section className="py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              What Happens After You Buy
            </h2>
            <div className="mt-12 space-y-6">
              {afterSteps.map((step) => (
                <div key={step.text} className="flex items-center gap-4 text-left">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/10">
                    <step.icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-lg text-slate-200">{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Guarantee ── */}
        <section className="bg-slate-800/40 py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              7-Day Clarity Guarantee
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-slate-300">
              If this diagnostic does not bring clarity to your income structure,
              contact us within 7 days for a full refund. No hoops. No hassle.
            </p>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24">
          <div className="mx-auto max-w-2xl px-6 text-center">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to See What's Really Going On?
            </h2>
            <p className="mt-4 text-slate-400">
              $27 · Instant access · 7-day guarantee
            </p>
            <Button variant="gold" size="xl" className="mt-10" asChild>
              <a href={PAYMENT_URL}>
                Reveal My Income Bottleneck – $27
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* ── Minimal Footer ── */}
        <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
          © {new Date().getFullYear()} Dr. Deanna Romulus, MBA · DrRomulusMBA.com
        </footer>
      </div>
    </>
  );
}
