import { AdminLayout } from '@/components/admin/AdminLayout';

export default function PortalResources() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Portal Resources</h1>
        <p className="text-muted-foreground">Manage resource library items for client portal.</p>
      </div>
    </AdminLayout>
  );
}
