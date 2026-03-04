import { AdminLayout } from '@/components/admin/AdminLayout';

export default function PortalClients() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Portal Clients</h1>
        <p className="text-muted-foreground">Manage client accounts, tiers, and onboarding status.</p>
      </div>
    </AdminLayout>
  );
}
