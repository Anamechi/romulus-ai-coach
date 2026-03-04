import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePortalClient } from '@/hooks/usePortalClient';
import { Calendar, FileText, Trophy, Flag, MessageSquare, BarChart3 } from 'lucide-react';

export default function PortalDashboard() {
  const { data: client } = usePortalClient();

  const cards = [
    { title: 'Sessions', icon: Calendar, description: 'View upcoming and past coaching sessions' },
    { title: 'Worksheets', icon: FileText, description: 'Complete and review your worksheets' },
    { title: 'Wins', icon: Trophy, description: 'Record your weekly reflections and wins' },
    { title: 'Milestones', icon: Flag, description: 'Track your achievements and progress' },
    { title: 'Messages', icon: MessageSquare, description: 'Private messaging with Dr. Romulus' },
    { title: 'Progress', icon: BarChart3, description: 'View your scorecard and growth metrics' },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back{client?.name ? `, ${client.name}` : ''}
          </h1>
          <p className="text-muted-foreground mt-1">
            Your client portal — everything you need in one place.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}
