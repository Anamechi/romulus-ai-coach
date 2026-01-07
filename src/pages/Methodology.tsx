import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/seo/SEOHead';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Methodology() {
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Methodology', url: '/methodology' },
  ];

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Our Methodology',
    description: 'Learn about our research approach, expert review process, and content update cycle.',
    url: 'https://drromulusmba.com/methodology',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Dr. Romulus MBA',
      url: 'https://drromulusmba.com',
    },
  };

  const steps = [
    {
      icon: Search,
      title: 'Research & Discovery',
      description: 'We begin by identifying key questions and challenges faced by our target audience through market research, client conversations, and industry analysis.',
      points: [
        'Analyze trending topics and common pain points',
        'Review authoritative sources and academic research',
        'Consult with industry practitioners and experts',
      ],
    },
    {
      icon: BookOpen,
      title: 'Content Development',
      description: 'Our content is developed with a focus on actionable insights, drawing from real-world experience and established best practices.',
      points: [
        'Draft content based on proven frameworks',
        'Include practical examples and case studies',
        'Structure for both human readability and AI comprehension',
      ],
    },
    {
      icon: Target,
      title: 'Expert Review',
      description: 'All content undergoes review by qualified professionals to ensure accuracy, relevance, and alignment with current best practices.',
      points: [
        'Subject matter expert validation',
        'Fact-checking against primary sources',
        'Assessment of practical applicability',
      ],
    },
    {
      icon: Lightbulb,
      title: 'Continuous Improvement',
      description: 'We regularly revisit and update our content based on new developments, reader feedback, and changes in the business landscape.',
      points: [
        'Quarterly content audits',
        'Integration of new research and insights',
        'Response to reader questions and feedback',
      ],
    },
  ];

  return (
    <Layout>
      <SEOHead
        title="Our Methodology | Dr. Romulus MBA"
        description="Learn about our research approach, expert review process, and content update cycle at Dr. Romulus MBA."
        canonicalUrl="/methodology"
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
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
            <Badge className="mb-4">Our Approach</Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Our Methodology
            </h1>
            <p className="text-lg text-muted-foreground">
              How we research, develop, and maintain high-quality content
            </p>
          </div>

          {/* Process Steps */}
          <div className="space-y-6 mb-12">
            {steps.map((step, index) => (
              <Card key={step.title}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-muted-foreground/30">{index + 1}</span>
                      <div className="p-3 rounded-lg bg-primary/10">
                        <step.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-2">{step.title}</h2>
                      <p className="text-muted-foreground mb-4">{step.description}</p>
                      <ul className="space-y-2">
                        {step.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quality Standards */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-display font-bold mb-4">Our Quality Standards</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-sm text-muted-foreground">Human-Reviewed Content</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Expert</div>
                <p className="text-sm text-muted-foreground">Author Credentials</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Regular</div>
                <p className="text-sm text-muted-foreground">Content Updates</p>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="text-center pt-12">
            <p className="text-muted-foreground mb-4">
              Learn more about our commitment to quality:
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/editorial-policy" className="text-primary hover:underline font-medium">
                Editorial Policy →
              </Link>
              <Link to="/trust" className="text-primary hover:underline font-medium">
                Trust Hub →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
