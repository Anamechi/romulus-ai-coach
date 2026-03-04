import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalResources() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Resources</h1>
        <p className="text-muted-foreground">Your resource library will appear here.</p>
      </div>
    </PortalLayout>
  );
}
