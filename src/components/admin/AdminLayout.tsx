import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Users,
  Settings,
  LogOut,
  Sparkles,
  Loader2,
  FolderOpen,
  MessageSquare,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  History,
  HeartPulse,
  Bot,
  Send,
  Layers,
  Wrench,
  Languages,
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const mainNavItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Blog Articles', url: '/admin/articles', icon: FileText },
  { title: 'FAQs', url: '/admin/faqs', icon: HelpCircle },
  { title: 'Q&A Pages', url: '/admin/qa-pages', icon: MessageSquare },
  { title: 'Topics', url: '/admin/topics', icon: FolderOpen },
  { title: 'Categories', url: '/admin/categories', icon: FolderOpen },
];

const managementNavItems = [
  { title: 'Authors', url: '/admin/authors', icon: Users },
  { title: 'Reviewers', url: '/admin/reviewers', icon: Users },
  { title: 'Leads', url: '/admin/leads', icon: MessageSquare },
  { title: 'Applications', url: '/admin/applications', icon: FileText },
  { title: 'Chatbot', url: '/admin/chatbot-conversations', icon: Bot },
];

const systemNavItems = [
  { title: 'System Check', url: '/admin/system-check', icon: ShieldCheck },
  { title: 'IndexNow', url: '/admin/indexnow', icon: Send },
  { title: 'Citation Health', url: '/admin/citation-health', icon: HeartPulse },
  { title: 'Citations', url: '/admin/citations', icon: LinkIcon },
  { title: 'Internal Links', url: '/admin/internal-links', icon: LinkIcon },
  { title: 'Authority Sources', url: '/admin/authority-sources', icon: ShieldCheck },
  { title: 'Linking Engine', url: '/admin/linking-engine', icon: Zap },
  { title: 'Audit Log', url: '/admin/audit-log', icon: History },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'AD';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div>
                <span className="font-display text-lg text-sidebar-foreground">
                  Dr. Romulus
                </span>
                <span className="block text-xs text-sidebar-foreground/60">
                  Admin Dashboard
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-2">
                Content
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-2">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {managementNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-2">
                System
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {systemNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-2">
                AI Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/ai-tools'}>
                      <Link to="/admin/ai-tools" className="flex items-center gap-3 bg-sidebar-primary/10 hover:bg-sidebar-primary/20">
                        <Wrench className="h-4 w-4 text-sidebar-primary" />
                        <span className="text-sidebar-primary font-medium">Tools Registry</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/content-cluster-generator'}>
                      <Link to="/admin/content-cluster-generator" className="flex items-center gap-3">
                        <Layers className="h-4 w-4" />
                        <span>Cluster Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/translations'}>
                      <Link to="/admin/translations" className="flex items-center gap-3">
                        <Languages className="h-4 w-4" />
                        <span>Translations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={location.pathname === '/admin/cluster-generator'}>
                      <Link to="/admin/cluster-generator" className="flex items-center gap-3">
                        <Zap className="h-4 w-4" />
                        <span>Quick Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">
                    {user.user_metadata?.full_name || 'Admin'}
                  </span>
                  <span className="text-xs text-sidebar-foreground/60 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1" />
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              View Site →
            </Link>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
