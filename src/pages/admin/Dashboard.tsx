import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useFaqs } from '@/hooks/useFaqs';
import { useQAPages } from '@/hooks/useQAPages';
import { useAuthors } from '@/hooks/useAuthors';
import { useLinkGovernance } from '@/hooks/useLinkGovernance';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  HelpCircle,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Settings,
  BookOpen,
  Tag,
  TrendingUp,
  Shield,
} from 'lucide-react';

const quickActions = [
  { label: 'New Article', href: '/admin/articles', icon: FileText, description: 'Create blog post' },
  { label: 'New FAQ', href: '/admin/faqs', icon: HelpCircle, description: 'Add FAQ entry' },
  { label: 'AI Generator', href: '/admin/cluster-generator', icon: Sparkles, description: 'Generate content' },
  { label: 'Manage Topics', href: '/admin/topics', icon: Tag, description: 'Organize content' },
  { label: 'Manage Authors', href: '/admin/authors', icon: BookOpen, description: 'Author profiles' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, description: 'Site configuration' },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: blogPosts } = useBlogPosts();
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();
  const { data: authors } = useAuthors();
  const { data: linkGovernance } = useLinkGovernance();

  // Calculate AI Readiness Score
  const totalContent = (blogPosts?.length || 0) + (faqs?.length || 0) + (qaPages?.length || 0);
  
  const aiReadinessScore = (() => {
    if (totalContent === 0) return 100;
    
    // E-E-A-T score (25%)
    const authorsWithProfiles = authors?.filter((a: any) => a.slug && a.bio && a.credentials).length || 0;
    const eatScore = authors?.length ? (authorsWithProfiles / authors.length) * 100 : 0;
    
    // Schema coverage (25%)
    const speakableContent = [
      ...(blogPosts?.filter((p: any) => p.speakable_summary) || []),
      ...(faqs?.filter((f: any) => f.speakable_answer) || []),
      ...(qaPages?.filter((q: any) => q.speakable_answer) || []),
    ].length;
    const schemaScore = totalContent > 0 ? (speakableContent / totalContent) * 100 : 0;
    
    // Internal linking health (25%)
    const orphanCount = linkGovernance?.orphaned?.length || 0;
    const linkScore = totalContent > 0 ? Math.max(0, 100 - (orphanCount / totalContent) * 100) : 100;
    
    // Content completeness (25%) - check for missing authors
    const contentWithAuthor = [
      ...(blogPosts?.filter((p: any) => p.author_id) || []),
      ...(faqs?.filter((f: any) => f.author_id) || []),
      ...(qaPages?.filter((q: any) => q.author_id) || []),
    ].length;
    const contentScore = totalContent > 0 ? (contentWithAuthor / totalContent) * 100 : 100;
    
    return Math.round((eatScore * 0.25) + (schemaScore * 0.25) + (linkScore * 0.25) + (contentScore * 0.25));
  })();

  const statCards = [
    {
      title: 'Blog Articles',
      value: stats?.blogPosts.total ?? 0,
      subtitle: `${stats?.blogPosts.published ?? 0} published`,
      icon: FileText,
      href: '/admin/articles',
    },
    {
      title: 'FAQs',
      value: stats?.faqs.total ?? 0,
      subtitle: `${stats?.faqs.published ?? 0} published`,
      icon: HelpCircle,
      href: '/admin/faqs',
    },
    {
      title: 'Leads',
      value: stats?.leads.total ?? 0,
      subtitle: `${stats?.leads.new ?? 0} new`,
      icon: MessageSquare,
      href: '/admin/leads',
    },
    {
      title: 'Applications',
      value: stats?.applications.total ?? 0,
      subtitle: `${stats?.applications.pending ?? 0} pending`,
      icon: Users,
      href: '/admin/applications',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to the Dr. Romulus MBA admin dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.title} to={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {isLoading ? <Skeleton className="h-3 w-20" /> : stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-display">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 h-auto py-4 hover:bg-accent/10 hover:border-accent"
                    >
                      <div className="p-2 bg-muted rounded-md">
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Readiness Score */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                AI Citation Readiness
              </CardTitle>
              <CardDescription>
                How ready your content is for AI systems
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-primary">{aiReadinessScore}</div>
                <div className="flex-1">
                  <Progress value={aiReadinessScore} className="h-3" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${authors?.some((a: any) => a.slug && a.bio) ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span>E-E-A-T Signals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(linkGovernance?.orphaned?.length || 0) === 0 ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span>Internal Linking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span>Schema Coverage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                  <span>Content Complete</span>
                </div>
              </div>
              <Link to="/admin/system-check">
                <Button variant="ghost" className="w-full mt-2 text-sm">
                  View Full Report
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Phase Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-display">Build Progress</CardTitle>
            <CardDescription>
              Platform development phases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { phase: 'Phase 1', title: 'Foundation + Premium UI', status: 'complete', progress: 100 },
                { phase: 'Phase 2', title: 'Core Data Models', status: 'complete', progress: 100 },
                { phase: 'Phase 3', title: 'FAQ System', status: 'complete', progress: 100 },
                { phase: 'Phase 4', title: 'Blog System', status: 'complete', progress: 100 },
                { phase: 'Phase 5', title: 'Dashboard Control Layer', status: 'complete', progress: 100 },
                { phase: 'Phase 6', title: 'Citation Engine', status: 'complete', progress: 100 },
                { phase: 'Phase 7', title: 'Internal Linking', status: 'complete', progress: 100 },
                { phase: 'Phase 8', title: 'AI Cluster Generator', status: 'complete', progress: 100 },
                { phase: 'Phase 9', title: 'Lead Capture + Intake', status: 'complete', progress: 100 },
                { phase: 'Phase 10', title: 'SEO/Sitemap Hardening', status: 'next', progress: 0 },
              ].map((phase) => (
                <div key={phase.phase} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {phase.phase}
                      </span>
                      <span className="font-medium">{phase.title}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      phase.status === 'complete' 
                        ? 'bg-green-100 text-green-700' 
                        : phase.status === 'next'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {phase.status === 'complete' ? 'Complete' : phase.status === 'next' ? 'Up Next' : 'Upcoming'}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
