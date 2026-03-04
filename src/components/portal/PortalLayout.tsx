import { ReactNode, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { usePortalClient } from '@/hooks/usePortalClient';
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
  Calendar,
  FileText,
  Trophy,
  Flag,
  BookOpen,
  MessageSquare,
  BarChart3,
  LogOut,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface PortalLayoutProps {
  children: ReactNode;
}

const portalNavItems = [
  { title: 'Dashboard', url: '/portal/dashboard', icon: LayoutDashboard },
  { title: 'Sessions', url: '/portal/sessions', icon: Calendar },
  { title: 'Worksheets', url: '/portal/worksheets', icon: FileText },
  { title: 'Wins', url: '/portal/wins', icon: Trophy },
  { title: 'Milestones', url: '/portal/milestones', icon: Flag },
  { title: 'Resources', url: '/portal/resources', icon: BookOpen },
  { title: 'Messages', url: '/portal/messages', icon: MessageSquare },
  { title: 'Progress', url: '/portal/progress', icon: BarChart3 },
];

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading, signOut } = useAuth();
  const { data: portalClient, isLoading: clientLoading } = usePortalClient();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!user) return null;

  if (!portalClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Portal Access Pending
          </h1>
          <p className="text-muted-foreground mb-6">
            Your client portal account has not been set up yet. Please contact Dr. Romulus to get started.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Return to Website
          </Button>
        </div>
      </div>
    );
  }

  const userInitials = user.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'CL';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <Link to="/portal/dashboard" className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-sidebar-primary" />
              </div>
              <div>
                <span className="font-display text-lg text-sidebar-foreground">
                  Client Portal
                </span>
                <span className="block text-xs text-sidebar-foreground/60">
                  Dr. Romulus MBA
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/50 px-2">
                My Portal
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {portalNavItems.map((item) => (
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
                    {portalClient.name || user.user_metadata?.full_name || 'Client'}
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
              View Website →
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
