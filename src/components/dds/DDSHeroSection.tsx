import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCTAClick: () => void;
}

const DDSHeroSection = ({ onCTAClick }: Props) => (
  <section className="relative py-24 md:py-32 overflow-hidden">
    <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
    <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center">
      <p className="text-[hsl(var(--gold))] font-medium tracking-wide uppercase text-sm mb-4">
        The DDS Framework™
      </p>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
        You Asked for the DDS Framework™
      </h1>
      <p className="text-sm italic mb-6" >
        If you commented "DDS" on social media, you're in the right place.
      </p>
      <p className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto" >
        The DDS Framework™ shows service-based business owners how to diagnose structural problems in their business, design the correct revenue architecture, and build predictable income systems.
      </p>

      <Button variant="gold" size="xl" onClick={onCTAClick}>
        Get the DDS Framework Guide
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm" >
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Free breakdown guide</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Built for service-based business owners</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--gold))]" /> Takes less than 5 minutes to understand</span>
      </div>
    </div>
  </section>
);

export default DDSHeroSection;
