import { CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const DDS_GUIDE_URL = "https://assets.cdn.filesafe.space/FbsFen3DXEum7iMgKC4B/media/69de741b190683601a1b239c.pdf";

const DDSGuideAccess = () => (
  <section className="py-20 md:py-28 bg-[hsl(var(--slate-medium))]">
    <div className="container mx-auto px-6 max-w-lg text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--gold)/0.15)] mb-6">
        <CheckCircle2 className="h-8 w-8 text-[hsl(var(--gold))]" />
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
        Your DDS Framework Guide Is Ready
      </h2>
      <p className="text-lg mb-8" style={{ color: "hsl(220 15% 70%)" }}>
        Your guide has also been sent to your email and phone.
      </p>

      <Button variant="gold" size="lg" asChild>
        <a href={DDS_GUIDE_URL} target="_blank" rel="noopener noreferrer">
          <Download className="mr-2 h-5 w-5" />
          Download Guide
        </a>
      </Button>
    </div>
  </section>
);

export default DDSGuideAccess;
