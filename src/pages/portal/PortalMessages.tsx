import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalMessages() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Your private messages will appear here.</p>
      </div>
    </PortalLayout>
  );
}
