import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalWins() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Wins & Reflections</h1>
        <p className="text-muted-foreground">Record and review your weekly wins here.</p>
      </div>
    </PortalLayout>
  );
}
