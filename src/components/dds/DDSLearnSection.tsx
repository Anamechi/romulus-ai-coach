import { CheckCircle2 } from "lucide-react";

const LEARN_POINTS = [
  "Your Founder Score, and exactly where your business sits on the scale",
  "The one area most likely costing you predictable revenue right now",
  "A quick win you can put in place this week",
  "Your clearest next step toward predictable growth",
];

const DDSLearnSection = () => (
  <section className="py-20 md:py-28">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
        Inside the Founder Score Workbook
      </h2>
      <ul className="space-y-4 text-left max-w-xl mx-auto">
        {LEARN_POINTS.map((point) => (
          <li key={point} className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--gold))] mt-0.5 shrink-0" />
            <span className="text-lg" >{point}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default DDSLearnSection;
