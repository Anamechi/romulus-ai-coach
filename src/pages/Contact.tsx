import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin, Clock, Linkedin, Twitter, Youtube } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
export default function Contact() {
  const formSrc = useMemo(() => "https://link.drromulusmba.com/widget/form/kjHkGhRKm1JxSVIm8Era", []);
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    setLoaded(false);
    setTimedOut(false);
    const t = window.setTimeout(() => setTimedOut(true), 7000);
    return () => window.clearTimeout(t);
  }, [formSrc]);
  return <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-gold/10 text-gold font-body text-sm font-medium mb-6">
              Get in Touch
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Let's Start a <span className="text-gradient-gold">Conversation</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground">
              Have questions about our programs? Ready to transform your business? 
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Embedded GHL Form */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Send a Message
              </h2>
              
              <div className="w-full rounded-xl bg-card border border-border p-2 shadow-lg" style={{
              minHeight: "1400px"
            }}>
                {!loaded && <div className="h-[1400px] w-full grid place-items-center">
                    <div className="text-center max-w-sm px-6">
                      <p className="font-body text-sm text-muted-foreground">
                        Loading contact form…
                      </p>
                      {timedOut && <div className="mt-3 space-y-3">
                          <p className="font-body text-sm text-muted-foreground">
                            If you still see a blank area, the form provider may be
                            blocking embeds in this preview.
                          </p>
                          <Button variant="outline" asChild>
                            <a href={formSrc} target="_blank" rel="noreferrer">
                              Open the form in a new tab
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </Button>
                        </div>}
                    </div>
                  </div>}
                <iframe src={formSrc} style={{
                width: "100%",
                height: "1400px",
                border: "none",
                borderRadius: "4px"
              }} id="inline-kjHkGhRKm1JxSVIm8Era" data-layout="{'id':'INLINE'}" data-trigger-type="alwaysShow" data-trigger-value="" data-activation-type="alwaysActivated" data-activation-value="" data-deactivation-type="neverDeactivate" data-deactivation-value="" data-form-name="Contact Us Form (on the website)" data-height="1400" data-layout-iframe-id="inline-kjHkGhRKm1JxSVIm8Era" data-form-id="kjHkGhRKm1JxSVIm8Era" title="Contact Us Form (on the website)" onLoad={() => setLoaded(true)} />
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Other Ways to Connect
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground mb-1">Email</h3>
                    <a href="mailto:contact@drromulus.com" className="font-body text-muted-foreground hover:text-gold transition-colors">hello@drromulusmba.com</a>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground mb-1">Office Hours</h3>
                    <p className="font-body text-muted-foreground">
                      Monday - Friday: 9am - 5pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-body font-semibold text-foreground mb-1">Location</h3>
                    <p className="font-body text-muted-foreground">
                      Remote-first company<br />
                      Serving clients worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h3 className="font-body font-semibold text-foreground mb-4">Follow Along</h3>
                <div className="flex gap-4">
                  {[{
                  icon: Linkedin,
                  href: "#",
                  label: "LinkedIn"
                }, {
                  icon: Twitter,
                  href: "#",
                  label: "Twitter"
                }, {
                  icon: Youtube,
                  href: "#",
                  label: "YouTube"
                }].map(social => <a key={social.label} href={social.href} aria-label={social.label} className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center hover:bg-gold hover:text-slate-deep transition-all duration-300">
                      <social.icon size={20} />
                    </a>)}
                </div>
              </div>

              {/* Quick CTA */}
              <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  Ready to Apply?
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-4">
                  Skip the inquiry and apply directly for coaching.
                </p>
                <Button variant="default" asChild>
                  <Link to="/apply">
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
}