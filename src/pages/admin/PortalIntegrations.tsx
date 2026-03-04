import { AdminLayout } from '@/components/admin/AdminLayout';

export default function PortalIntegrations() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Portal Integrations</h1>
        <p className="text-muted-foreground">Manage API keys, webhooks, and third-party integrations.</p>
      </div>
    </AdminLayout>
  );
}
