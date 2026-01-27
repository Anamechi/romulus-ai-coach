import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <Layout>
      <SEOHead
        title="Terms of Service | Dr. Romulus MBA"
        description="Terms of Service, Refund Policy, and Earnings Disclaimer for Dr. Romulus MBA services and programs."
        canonicalUrl="/terms"
      />
      
      <div className="bg-cream py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground mb-8">
              <strong>Last Updated: 2026/01/27</strong>
            </p>
            
            <div className="prose prose-lg max-w-none text-foreground">
              
              <section className="mb-16">
                <h2 className="font-display text-2xl font-bold text-primary mt-8 mb-4">Terms of Service</h2>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">1. Agreement to Terms</h3>
                <p>
                  By accessing drromulusmba.com, you agree to be bound by these Terms of Service ("Terms"). If you do not agree, you may not use the Website or services.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">2. Services Provided</h3>
                <p>We provide:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Educational content and digital programs</li>
                  <li>Coaching and consulting services</li>
                  <li>Speaking engagements, workshops, and live events</li>
                </ul>
                <p className="mt-4">All services are provided for educational and informational purposes only.</p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">3. Eligibility</h3>
                <p>You must be 18 years or older to use this Website or purchase services.</p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">4. Intellectual Property</h3>
                <p>
                  All content, materials, videos, documents, and resources are the exclusive property of Dr. Romulus MBA. You may not reproduce, distribute, or resell any content without written permission.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">5. No Professional Advice</h3>
                <p>
                  Our services do not constitute legal, financial, tax, or medical advice. You are responsible for your own decisions and outcomes.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">6. Limitation of Liability</h3>
                <p>
                  To the fullest extent permitted by law, Dr. Romulus MBA shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Website or services.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">7. Termination</h3>
                <p>We reserve the right to suspend or terminate access to services for violations of these Terms.</p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">8. Governing Law</h3>
                <p>
                  These Terms are governed by the laws of the United States, with jurisdiction determined based on the business's principal operating location at the time of service delivery.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">9. Contact</h3>
                <p>
                  <a href="mailto:hello@drromulusmba.com" className="text-gold hover:underline">
                    hello@drromulusmba.com
                  </a>
                </p>
              </section>

              {/* SMS Messaging Terms */}
              <section className="mb-16 pt-8 border-t border-border">
                <h2 className="font-display text-2xl font-bold text-primary mb-4">SMS Messaging Terms (A2P)</h2>
                
                <p>
                  By opting in to receive SMS messages from Dr. Romulus MBA, you agree to receive text messages related to educational content, coaching services, appointment reminders, service updates, and promotional offers, depending on your interaction with our services.
                </p>

                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Message frequency may vary.</li>
                  <li>Message and data rates may apply depending on your mobile carrier and plan.</li>
                </ul>

                <p className="mt-4">
                  You may opt out of SMS messages at any time by replying <strong>STOP</strong> to any message. After opting out, you will receive a confirmation message and will no longer receive SMS messages unless you opt back in.
                </p>

                <p className="mt-4">
                  For help, reply <strong>HELP</strong> or contact us at{" "}
                  <a href="mailto:hello@drromulusmba.com" className="text-gold hover:underline">
                    hello@drromulusmba.com
                  </a>
                </p>

                <p className="mt-4">
                  <strong>Consent to receive SMS messages is not a condition of purchase.</strong>
                </p>

                <p className="mt-4">
                  For information on how we collect and use personal data, please review our{" "}
                  <Link to="/privacy" className="text-gold hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </section>

              <section className="mb-16 pt-8 border-t border-border">
                <h2 className="font-display text-2xl font-bold text-primary mb-4">Earnings Disclaimer</h2>

                <p>
                  Dr. Romulus MBA provides education, training, and strategic guidance. We make no guarantees regarding income, revenue, business success, or results of any kind.
                </p>

                <p className="mt-4">
                  Any examples, testimonials, or case studies shared represent individual experiences and are not typical or guaranteed outcomes.
                </p>

                <p className="mt-4">
                  Your results depend on many factors, including effort, skill, market conditions, prior experience, and external economic forces. You acknowledge that business involves risk and that you assume full responsibility for your actions and outcomes.
                </p>

                <p className="mt-4">
                  We are not responsible for any financial loss, business interruption, or missed opportunities resulting from your participation in our programs or events.
                </p>
              </section>

              <section className="pt-8 border-t border-border">
                <h2 className="font-display text-2xl font-bold text-primary mb-4">Refund Policy</h2>
                

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">Digital Products & Programs</h3>
                <p>Due to the nature of digital content and immediate access:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li><strong>All sales are final</strong></li>
                  <li><strong>No refunds are provided once access is granted</strong></li>
                </ul>
                <p className="mt-4">This includes courses, programs, memberships, and educational materials.</p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">Speaking Engagements & Live Events</h3>
                <p>
                  Speaking fees, workshops, and live events are non-refundable. Event-specific terms may apply and will be outlined in the engagement agreement.
                </p>
                <p className="mt-4">
                  If an event is canceled by us, rescheduling or alternative arrangements may be offered at our discretion.
                </p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">Duplicate Charges</h3>
                <p>Refunds may be issued only in cases of duplicate purchases or billing errors.</p>

                <h3 className="font-display text-xl font-semibold text-primary mt-8 mb-3">Contact for Refund Inquiries</h3>
                <p>
                  <a href="mailto:hello@drromulusmba.com" className="text-gold hover:underline">
                    hello@drromulusmba.com
                  </a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Terms;
