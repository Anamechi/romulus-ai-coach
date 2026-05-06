import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  diagnosticKitUrl: string;
}

const DDSNextStepOffer = ({ diagnosticKitUrl }: Props) => (
  <section className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
    <div className="container mx-auto px-6 max-w-2xl">
      <div className="bg-[hsl(var(--slate-deep))] border border-[hsl(var(--gold)/0.2)] rounded-2xl p-8 md:p-10">
        <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-3">
          Next Step
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
          Identify Your Primary Income Constraint
        </h2>
        <p className="mb-6" >
          The Complete Income Systems Diagnostic Kit™ reveals the structural issue currently blocking predictable revenue in your business. This is the natural next step after reviewing the DDS Framework Guide.
        </p>

        <ul className="space-y-3 mb-8">
          {[
            "Service-based business owner diagnostic checklist",
            "Walkthrough training video",
            "Results interpretation guide",
            "Audio explanation from Dr. Romulus",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" />
              <span >{item}</span>
            </li>
          ))}
        </ul>

        <Button variant="gold" size="lg" asChild>
          <a href={diagnosticKitUrl} target="_blank" rel="noopener noreferrer">
            Get the Diagnostic Kit — $27
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default DDSNextStepOffer;
