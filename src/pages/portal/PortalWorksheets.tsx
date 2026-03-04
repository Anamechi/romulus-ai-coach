import { PortalLayout } from '@/components/portal/PortalLayout';

export default function PortalWorksheets() {
  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Worksheets</h1>
        <p className="text-muted-foreground">Your worksheets and exercises will appear here.</p>
      </div>
    </PortalLayout>
  );
}
