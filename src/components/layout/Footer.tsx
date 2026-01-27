import { Link } from "react-router-dom";
import { Linkedin, Twitter, Youtube, Mail } from "lucide-react";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Free Resources", href: "/resources" },
    { label: "Case Studies", href: "/blog" },
    { label: "Apply", href: "/apply" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
  trust: [
    { label: "Editorial Policy", href: "/editorial-policy" },
    { label: "Methodology", href: "/methodology" },
    { label: "Trust Hub", href: "/trust" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Mail, href: "mailto:contact@drromulus.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold-gradient flex items-center justify-center">
                <span className="font-display text-lg font-bold text-slate-deep">R</span>
              </div>
              <div>
                <span className="font-display text-xl font-semibold text-cream">
                  Dr. Romulus
                </span>
                <span className="text-gold font-body text-sm font-medium ml-1">MBA</span>
              </div>
            </Link>
            <p className="text-cream/70 font-body text-sm leading-relaxed mb-6">
              Executive coaching and business automation for ambitious entrepreneurs 
              ready to scale with clarity and confidence.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-cream/10 flex items-center justify-center hover:bg-gold hover:text-slate-deep transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-6">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-6">Trust</h4>
            <ul className="space-y-3">
              {footerLinks.trust.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-cream/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-6">Stay Updated</h4>
            <p className="text-cream/70 font-body text-sm mb-4">
              Get weekly insights on business growth and automation strategies.
            </p>
            <NewsletterForm variant="footer" source="Website – Footer – Weekly Insights" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-cream/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-sm text-cream/50">
            © {new Date().getFullYear()} Dr. Romulus MBA. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-body text-sm text-cream/50 hover:text-cream transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
