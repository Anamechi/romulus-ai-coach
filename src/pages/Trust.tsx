import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbSchema, OrganizationSchema } from '@/components/seo/StructuredData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ChecklistCTA } from '@/components/content/ChecklistCTA';
import { ArrowLeft, Shield, Award, Users, FileText, ExternalLink, CheckCircle2, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Trust() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Trust', url: '/trust' },
  ];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Trust Hub',
    description: 'Learn why you can trust the information and guidance provided by Dr. Romulus MBA.',
    url: 'https://drromulusmba.com/trust',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Dr. Romulus MBA',
      url: 'https://drromulusmba.com',
    },
    about: {
      '@type': 'Organization',
      name: 'Dr. Romulus MBA',
      url: 'https://drromulusmba.com',
    },
  };

  const trustSignals = [
    {
      icon: Award,
      title: 'Expert Credentials',
      description: 'Our founder holds an MBA and brings years of hands-on experience in business consulting and automation.',
      link: '/about',
      linkText: 'Learn about our founder',
    },
    {
      icon: Users,
      title: 'Real Client Results',
      description: 'Our methodologies have been applied successfully with real businesses across various industries.',
      link: '/blog',
      linkText: 'Read case studies',
    },
    {
      icon: FileText,
      title: 'Editorial Standards',
      description: 'All content is created following strict editorial guidelines with expert review and fact-checking.',
      link: '/editorial-policy',
      linkText: 'View editorial policy',
    },
    {
      icon: Shield,
      title: 'Transparent Methodology',
      description: 'We openly share our research approach and content development process.',
      link: '/methodology',
      linkText: 'See our methodology',
    },
  ];

  const eeatSignals = [
    { label: 'Experience', description: 'Real-world business consulting and automation implementation' },
    { label: 'Expertise', description: 'MBA-level business education and specialized training' },
    { label: 'Authoritativeness', description: 'Recognized voice in business automation and growth strategy' },
    { label: 'Trustworthiness', description: 'Transparent practices, clear disclosures, and verified credentials' },
  ];

  return (
    <Layout>
      <SEOHead
        title="Trust Hub | Dr. Romulus MBA"
        description="Learn why you can trust the information and guidance provided by Dr. Romulus MBA. Our commitment to E-E-A-T and quality content."
        canonicalUrl="/trust"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <OrganizationSchema />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Badge className="mb-4">Transparency & Trust</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Trust Hub
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe in transparency. Here's why you can trust the information and guidance we provide.
            </p>
          </div>

          {/* E-E-A-T Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Our E-E-A-T Commitment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) is Google's framework
                for evaluating content quality. Here's how we meet these standards:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {eeatSignals.map((signal) => (
                  <div key={signal.label} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">{signal.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {trustSignals.map((signal) => (
              <Card key={signal.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <signal.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{signal.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{signal.description}</p>
                      <Link
                        to={signal.link}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {signal.linkText}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What We Don't Do */}
          <Card className="bg-muted/50 border-muted mb-12">
            <CardHeader>
              <CardTitle>Our Ethical Standards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We maintain strict ethical standards in all our content and advice:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive font-bold">✗</span>
                  <span>We do not make unrealistic income or success guarantees</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive font-bold">✗</span>
                  <span>We do not provide legal, financial, or tax advice</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive font-bold">✗</span>
                  <span>We do not publish unverified or speculative information</span>
                </li>
                <li className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive font-bold">✗</span>
                  <span>We do not hide our use of AI tools in content creation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <ChecklistCTA
            heading="Ready to Get Started?"
            description="The Fundability & Systems Checklist reveals exactly what's missing in your business—so you can fix the right thing."
            buttonText="Get the Checklist"
          />
        </div>
      </div>
    </Layout>
  );
}
