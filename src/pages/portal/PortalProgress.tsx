import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalProgress() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Progress Scorecard</h1>
        <p className="text-muted-foreground">Your growth metrics and scorecard will appear here.</p>
      </div>
    </PortalLayout>
  );
}
