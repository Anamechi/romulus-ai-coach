import { AdminLayout } from '@/components/admin/AdminLayout';

export default function PortalOffers() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-bold text-foreground">Portal Offers</h1>
        <p className="text-muted-foreground">Manage upsell and growth opportunities for clients.</p>
      </div>
    </AdminLayout>
  );
}
