import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Users, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function EditorialPolicy() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Editorial Policy', url: '/editorial-policy' },
  ];

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Editorial Policy',
    description: 'Learn about our content creation process, editorial standards, and commitment to accuracy.',
    url: 'https://drromulusmba.com/editorial-policy',
    mainEntity: {
      '@type': 'Organization',
      name: 'Dr. Romulus MBA',
      url: 'https://drromulusmba.com',
    },
  };

  return (
    <Layout>
      <SEOHead
        title="Editorial Policy | Dr. Romulus MBA"
        description="Learn about our content creation process, editorial standards, and commitment to accuracy at Dr. Romulus MBA."
        canonicalUrl="/editorial-policy"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(aboutPageSchema)}</script>
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
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
            <Badge className="mb-4">Trust & Transparency</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Editorial Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              How we create, review, and maintain our content
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            {/* Content Creation */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Content Creation Process</h2>
                    <p className="text-muted-foreground mb-4">
                      Our content is created through a combination of expert knowledge and AI-assisted research,
                      with every piece undergoing human review and validation.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>All content is authored or reviewed by qualified professionals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>AI tools assist with research and drafting, never final publication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Facts are verified against authoritative sources</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Review */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Expert Review</h2>
                    <p className="text-muted-foreground mb-4">
                      Content on specialized topics is reviewed by subject matter experts with relevant
                      credentials and experience in business, automation, and strategic growth.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Authors have verifiable professional backgrounds</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Reviewers provide independent verification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Author credentials are displayed on all content</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Updates & Accuracy</h2>
                    <p className="text-muted-foreground mb-4">
                      We regularly review and update our content to ensure it remains accurate and relevant.
                    </p>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Published dates and update timestamps are clearly displayed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Outdated information is corrected or removed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>Reader feedback is reviewed and incorporated when appropriate</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-muted/50 border-muted">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-amber-500/10">
                    <Shield className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Important Disclaimer</h2>
                    <p className="text-muted-foreground">
                      The information provided on this website is for general educational purposes only.
                      It should not be construed as professional legal, financial, or tax advice.
                      We make no guarantees about income, results, or business outcomes.
                      Always consult with qualified professionals for advice specific to your situation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground mb-4">
                Have questions about our editorial standards?
              </p>
              <Link
                to="/contact"
                className="text-primary hover:underline font-medium"
              >
                Contact us →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
