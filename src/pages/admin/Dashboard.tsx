import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';
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
} from 'lucide-react';

const quickActions = [
  { label: 'New Article', href: '/admin/articles', icon: FileText, description: 'Create blog post' },
  { label: 'New FAQ', href: '/admin/faqs', icon: HelpCircle, description: 'Add FAQ entry' },
  { label: 'AI Generator', href: '/admin/cluster-generator', icon: Sparkles, description: 'Generate content' },
  { label: 'Manage Topics', href: '/admin/topics', icon: Tag, description: 'Organize content' },
  { label: 'Manage Authors', href: '/admin/authors', icon: BookOpen, description: 'Author profiles' },
  { label: 'Settings', href: '/admin/settings', icon: Settings, description: 'Site configuration' },
];

const systemStatus = [
  { label: 'Database', status: 'operational', icon: CheckCircle2 },
  { label: 'Authentication', status: 'operational', icon: CheckCircle2 },
  { label: 'AI Services', status: 'pending', icon: AlertCircle },
  { label: 'SEO Validation', status: 'pending', icon: AlertCircle },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

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

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-display">System Status</CardTitle>
              <CardDescription>
                Platform health overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemStatus.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm">{item.label}</span>
                  <div className="flex items-center gap-2">
                    {item.status === 'operational' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-xs text-green-600">Operational</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-amber-600">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
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
