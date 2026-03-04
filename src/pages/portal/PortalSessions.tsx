import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalSessions() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Sessions</h1>
        <p className="text-muted-foreground">Your coaching sessions will appear here.</p>
      </div>
    </PortalLayout>
  );
}
