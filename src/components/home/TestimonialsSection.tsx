import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Working with Dr. Romulus transformed not just my business, but my entire approach to leadership. I finally understood what was actually holding me back.",
    name: "Sarah Chen",
    role: "CEO, TechScale Solutions",
    result: "Clarity That Changed Everything",
  },
  {
    quote: "The systems we implemented saved me 25 hours a week. I finally have time for strategy instead of putting out fires.",
    name: "Marcus Williams",
    role: "Founder, Williams Consulting",
    result: "25+ Hours Reclaimed Weekly",
  },
  {
    quote: "For the first time, I understood why my income kept fluctuating. Once I saw the pattern, fixing it was straightforward.",
    name: "Jennifer Park",
    role: "Owner, Park & Associates",
    result: "Consistent Revenue Achieved",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
            Client Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            When Clarity Arrives,{" "}
            <span className="text-gradient-gold">Everything Changes</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground">
            The transformation starts with understanding what's actually happening 
            in your business—not just what you think is happening.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative p-8 rounded-2xl bg-card border border-border hover:border-gold/30 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                <Quote className="w-4 h-4 text-slate-deep" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4 pt-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-body text-foreground mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Result Badge */}
              <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold font-body text-xs font-semibold mb-6">
                {testimonial.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  <span className="font-display font-semibold text-foreground">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-body font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="font-body text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
