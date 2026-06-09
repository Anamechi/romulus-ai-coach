import { SEOHead } from "@/components/seo/SEOHead";
import { ArrowRight, ExternalLink } from "lucide-react";

const Preorder = () => {
  const externalUrl = "https://www.amazon.com/dp/B0H4C5R87D";

  return (
    <>
      <SEOHead
        title="Pre-Order | Systems Before Scale — Dr. Deanna Romulus, MBA"
        description="Pre-order your copy of Systems Before Scale by Dr. Deanna Romulus, MBA. Reserve the book that installs the infrastructure your business actually needs."
        canonicalUrl="/preorder"
        ogType="website"
      />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center" style={{ backgroundColor: "#1A1A2E" }}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 lg:px-12 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p
              className="uppercase mb-6"
              style={{
                color: "#C9A84C",
                fontFamily: "Georgia, serif",
                letterSpacing: "0.3em",
                fontSize: "0.75rem",
              }}
            >
              Systems Before Scale
            </p>
            <h1
              className="font-normal leading-[1.1] mb-8"
              style={{
                color: "#F5F5F0",
                fontFamily: "Georgia, serif",
                fontSize: "clamp(2.25rem, 5vw, 4rem)",
                letterSpacing: "-0.01em",
              }}
            >
              Pre-order the book that installs the infrastructure your business actually needs
              <span style={{ color: "#C9A84C" }}>.</span>
            </h1>
            <p
              className="mb-10 leading-relaxed mx-auto"
              style={{
                color: "rgba(245,245,240,0.78)",
                fontFamily: "Georgia, serif",
                fontSize: "1.125rem",
                maxWidth: "54ch",
              }}
            >
              Dr. Deanna Romulus, MBA distills two decades of revenue architecture into a single,
              sequential framework. Diagnose. Design. Scale. In that order.
            </p>
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium transition-colors"
              style={{
                backgroundColor: "#C9A84C",
                color: "#1A1A2E",
                border: "2px solid #C9A84C",
                fontFamily: "Georgia, serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#C9A84C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#C9A84C";
                e.currentTarget.style.color = "#1A1A2E";
              }}
            >
              Complete Your Pre-Order
              <ExternalLink className="w-5 h-5" />
            </a>
            <p
              className="mt-6 text-sm italic"
              style={{ color: "rgba(245,245,240,0.6)", fontFamily: "Georgia, serif" }}
            >
              You will be redirected to happybirthdaydeanna.com to finalize your reservation.
            </p>
          </div>
        </div>
      </section>

      {/* BOOK DETAILS */}
      <section style={{ backgroundColor: "#F5F5F0" }}>
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
            <div>
              <p
                className="uppercase mb-4"
                style={{
                  color: "#C9A84C",
                  fontFamily: "Georgia, serif",
                  letterSpacing: "0.3em",
                  fontSize: "0.75rem",
                }}
              >
                About the Book
              </p>
              <h2
                className="font-normal leading-[1.15] mb-6"
                style={{
                  color: "#1A1A2E",
                  fontFamily: "Georgia, serif",
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                }}
              >
                Structure first. Revenue second. Scale last.
                <span style={{ color: "#C9A84C" }}>.</span>
              </h2>
              <div className="space-y-4" style={{ fontFamily: "Georgia, serif", color: "#1A1A2E" }}>
                <p className="leading-relaxed">
                  Most founders try to automate chaos. Systems Before Scale teaches you to install
                  the underlying structure first — so that every automation, every hire, and every
                  revenue stream builds on solid ground.
                </p>
                <p className="leading-relaxed">
                  Inside, you will find the complete DDS Framework in plain language, with
                  decision trees, diagnostic checkpoints, and build sequences you can apply
                  immediately — whether you are at $100K or $1M+ in annual revenue.
                </p>
              </div>
              <div className="mt-8 pt-8 border-t" style={{ borderColor: "rgba(26,26,46,0.12)" }}>
                <dl className="grid grid-cols-2 gap-4 text-sm" style={{ fontFamily: "Georgia, serif" }}>
                  <div>
                    <dt className="uppercase mb-1" style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.7rem" }}>Author</dt>
                    <dd style={{ color: "#1A1A2E" }}>Dr. Deanna Romulus, MBA</dd>
                  </div>
                  <div>
                    <dt className="uppercase mb-1" style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.7rem" }}>Release</dt>
                    <dd style={{ color: "#1A1A2E" }}>August 11, 2026</dd>
                  </div>
                  <div>
                    <dt className="uppercase mb-1" style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.7rem" }}>Format</dt>
                    <dd style={{ color: "#1A1A2E" }}>Hardcover & Digital</dd>
                  </div>
                  <div>
                    <dt className="uppercase mb-1" style={{ color: "#C9A84C", letterSpacing: "0.2em", fontSize: "0.7rem" }}>Framework</dt>
                    <dd style={{ color: "#1A1A2E" }}>DDS Methodology</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="flex justify-center">
              <div
                className="relative w-full max-w-sm aspect-[3/4] flex items-center justify-center"
                style={{ border: "1px solid #C9A84C", backgroundColor: "#1A1A2E" }}
              >
                <div
                  className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                  aria-hidden="true"
                />
                <div className="text-center relative z-10 p-8">
                  <p
                    className="uppercase mb-4"
                    style={{
                      color: "#C9A84C",
                      fontFamily: "Georgia, serif",
                      letterSpacing: "0.3em",
                      fontSize: "0.7rem",
                    }}
                  >
                    Systems Before Scale
                  </p>
                  <h3
                    className="font-normal leading-[1.2] mb-4"
                    style={{
                      color: "#F5F5F0",
                      fontFamily: "Georgia, serif",
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                    }}
                  >
                    The DDS Framework
                    <br />
                    for Service Entrepreneurs
                  </h3>
                  <div
                    className="w-12 h-px mx-auto mb-4"
                    style={{ backgroundColor: "#C9A84C" }}
                  />
                  <p
                    className="text-sm italic"
                    style={{ color: "rgba(245,245,240,0.6)", fontFamily: "Georgia, serif" }}
                  >
                    Dr. Deanna Romulus, MBA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#C9A84C" }}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(#1A1A2E 1px, transparent 1px), linear-gradient(90deg, #1A1A2E 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
        <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28 relative z-10 text-center">
          <h2
            className="font-normal leading-[1.15] mb-6"
            style={{
              color: "#1A1A2E",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
            }}
          >
            Reserve your copy today
            <span style={{ color: "#F5F5F0" }}>.</span>
          </h2>
          <p
            className="mb-10 mx-auto leading-relaxed"
            style={{
              color: "rgba(26,26,46,0.85)",
              fontFamily: "Georgia, serif",
              fontSize: "1.125rem",
              maxWidth: "48ch",
            }}
          >
            Join founders who are choosing structure over hype. Your pre-order secures first-edition
            access and early-reader bonuses.
          </p>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium transition-colors"
            style={{
              backgroundColor: "#1A1A2E",
              color: "#C9A84C",
              border: "2px solid #1A1A2E",
              fontFamily: "Georgia, serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#1A1A2E";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1A1A2E";
              e.currentTarget.style.color = "#C9A84C";
            }}
          >
            Pre-Order Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  );
};

export default Preorder;
