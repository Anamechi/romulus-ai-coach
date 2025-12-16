import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminPlaceholder() {
  const location = useLocation();
  const pageName = location.pathname.split('/').pop() || 'Page';
  const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, ' ');

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display text-foreground">{formattedName}</h1>
            <p className="text-muted-foreground mt-1">
              This section is coming soon
            </p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
              <Construction className="h-8 w-8 text-accent" />
            </div>
            <CardTitle className="text-xl font-display">Under Construction</CardTitle>
            <CardDescription className="text-base">
              This feature will be available in a future build phase.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              The {formattedName.toLowerCase()} management system is part of the upcoming development phases. 
              Check the dashboard for the current build progress.
            </p>
            <Link to="/admin">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
