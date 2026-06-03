interface FAQ {
  q: string;
  a: string;
}

interface HomeFAQProps {
  faqs: FAQ[];
}

export const HomeFAQ = ({ faqs }: HomeFAQProps) => {
  return (
    <section className="bg-white border-t border-primary/10">
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-accent uppercase mb-6 text-center"
            style={{ letterSpacing: "0.3em", fontSize: "0.75rem" }}
          >
            Common Questions
          </p>
          <div className="h-px bg-accent w-12 mx-auto mb-10" aria-hidden="true" />
          <h2
            className="text-primary font-normal leading-[1.15] mb-12 text-center"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
          >
            What founders ask first<span className="text-accent">.</span>
          </h2>
          <dl className="space-y-10">
            {faqs.map((f) => (
              <div key={f.q} className="border-l-2 border-accent pl-6">
                <dt className="text-primary text-xl lg:text-2xl font-normal mb-3">
                  {f.q}
                </dt>
                <dd className="speakable-answer text-primary/80 text-base lg:text-lg leading-relaxed">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
