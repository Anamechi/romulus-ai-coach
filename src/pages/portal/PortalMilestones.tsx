import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalMilestones() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Milestones</h1>
        <p className="text-muted-foreground">Your achievements and milestones will appear here.</p>
      </div>
    </PortalLayout>
  );
}
