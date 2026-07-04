import { SEOHead } from "@/components/seo/SEOHead";

export default function SessionPolicy() {
  return (
    <>
      <SEOHead
        title="Scheduling & Payment Policy | Revenue Architecture Session"
        description="Scheduling, rescheduling, refund, and guarantee terms for the Revenue Architecture Session with Dr. Deanna Romulus."
        canonicalUrl="https://drromulusmba.com/session-policy"
      />

      <div className="min-h-screen bg-[#F5F5F0]">
        {/* Header */}
        <header className="bg-[#1A1A2E] border-b-4 border-[#C9A84C]">
          <div className="max-w-[760px] mx-auto px-6 py-10 text-left">
            <div
              className="text-[#C9A84C] text-xs font-bold"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              DrRomulusMBA · Anamechi Marketing
            </div>
            <div
              className="text-white mt-3"
              style={{ fontFamily: "Georgia, serif", fontSize: "24px" }}
            >
              Dr. Deanna Romulus
            </div>
            <div
              className="italic mt-1"
              style={{ fontFamily: "Georgia, serif", color: "#9999B8" }}
            >
              EdD · Business Strategist · DDS Framework™
            </div>
          </div>
        </header>

        {/* Content */}
        <main
          className="max-w-[760px] mx-auto px-6 py-16 text-left"
          style={{
            fontFamily: "Georgia, serif",
            color: "#2A2A40",
            lineHeight: 1.7,
          }}
        >
          <div
            className="text-[#C9A84C] text-xs font-bold mb-4"
            style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Revenue Architecture Session
          </div>

          <h1
            className="mb-8"
            style={{
              fontFamily: "Georgia, serif",
              color: "#1A1A2E",
              fontSize: "28px",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Scheduling &amp; Payment Policy
          </h1>

          <p className="mb-10">
            Your session is reserved and confirmed when payment is complete. Because I take only 4 to 6 sessions a month and prepare for each one personally, your booking holds a specific place on my calendar. This policy protects that for both of us.
          </p>

          {[
            {
              title: "Rescheduling",
              body: "Reschedule for free with at least 48 hours notice, up to two times, using the link in your confirmation. I would rather you come when you can be fully present.",
            },
            {
              title: "Short notice and missed sessions",
              body: "If you move your session with less than 48 hours notice, or you miss it, reach out and I will hold your investment as a credit for 30 days so we can find a new time. A $250 rebooking fee applies to short-notice changes, since the slot was reserved and cannot be refilled.",
            },
            {
              title: "Refunds",
              body: "Your $3,500 is non-refundable, but it is never lost. If your plans change, it converts to a credit good for 90 days toward a rescheduled session or toward the Systems Installation Intensive. If you cancel within 24 hours of booking and at least 48 hours before your session, I will refund it in full, less any processing fee.",
            },
            {
              title: "Your credit toward the build",
              body: "If you move into the Systems Installation Intensive within 60 days of your session, the full $3,500 applies toward it.",
            },
          ].map((section) => (
            <section
              key={section.title}
              className="bg-[#F5F5F0] mb-6 py-5 pl-6 pr-4"
              style={{ borderLeft: "3px solid #C9A84C" }}
            >
              <h2
                className="mb-2"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "#1A1A2E",
                  fontWeight: 700,
                  fontSize: "19px",
                }}
              >
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.body}</p>
            </section>
          ))}

          {/* Guarantee callout */}
          <section
            className="bg-white mt-10 mb-10 py-7 pl-7 pr-6"
            style={{ borderLeft: "5px solid #C9A84C" }}
          >
            <div
              className="text-[#C9A84C] text-xs font-bold mb-3"
              style={{ letterSpacing: "0.18em", textTransform: "uppercase" }}
            >
              My Guarantee To You
            </div>
            <p style={{ color: "#1A1A2E", margin: 0 }}>
              Complete your prep form and show up on time, and if by the end of our 90 minutes you do not have your dominant revenue leak named and a written build order in hand, I will refund your session in full. I can promise that because it is exactly what the session is built to deliver.
            </p>
          </section>

          <p
            className="mt-12"
            style={{
              fontFamily: "Georgia, serif",
              color: "#1A1A2E",
              fontSize: "19px",
            }}
          >
            By booking, you agree to this policy.
          </p>
        </main>

        {/* Footer */}
        <footer className="bg-[#1A1A2E] py-8">
          <div
            className="max-w-[760px] mx-auto px-6 text-center"
            style={{ fontFamily: "Georgia, serif", color: "#666680", fontSize: "13px", lineHeight: 1.8 }}
          >
            <div>© 2026 WD Digital Enterprises, LLC · DDS Framework™ · All Rights Reserved</div>
            <div>Systems Before Scale™ · drromulusmba.com</div>
          </div>
        </footer>
      </div>
    </>
  );
}
