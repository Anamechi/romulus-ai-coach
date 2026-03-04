import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Mail, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function PortalClients() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    tier: 'self_directed' as 'self_directed' | 'strategic_coaching' | 'private_consulting',
    program_phase: 'clarity' as 'clarity' | 'systems' | 'expansion',
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ['admin-portal-clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portal_clients')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const inviteClient = useMutation({
    mutationFn: async (form: typeof formData) => {
      const { data, error } = await supabase.functions.invoke('invite-portal-client', {
        body: {
          email: form.email,
          name: form.name,
          tier: form.tier,
          program_phase: form.program_phase,
        },
      });

      if (error) throw new Error(error.message || 'Failed to invite client');
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-portal-clients'] });
      setOpen(false);
      setFormData({ email: '', name: '', tier: 'self_directed', program_phase: 'clarity' });
      toast({
        title: data.existing_user ? 'Client added' : 'Invitation sent',
        description: data.message,
      });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const tierLabel: Record<string, string> = {
    self_directed: 'Self Directed',
    strategic_coaching: 'Strategic Coaching',
    private_consulting: 'Private Consulting',
  };

  const phaseLabel: Record<string, string> = {
    clarity: 'Clarity',
    systems: 'Systems',
    expansion: 'Expansion',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Portal Clients</h1>
            <p className="text-muted-foreground">Manage client accounts, tiers, and onboarding status.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Mail className="h-4 w-4 mr-2" /> Invite Client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Portal Client</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Enter the client's email. They'll receive a login link to access their portal.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  inviteClient.mutate(formData);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Client Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tier</Label>
                  <Select
                    value={formData.tier}
                    onValueChange={(v) => setFormData({ ...formData, tier: v as typeof formData.tier })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self_directed">Self Directed</SelectItem>
                      <SelectItem value="strategic_coaching">Strategic Coaching</SelectItem>
                      <SelectItem value="private_consulting">Private Consulting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Program Phase</Label>
                  <Select
                    value={formData.program_phase}
                    onValueChange={(v) => setFormData({ ...formData, program_phase: v as typeof formData.program_phase })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clarity">Clarity</SelectItem>
                      <SelectItem value="systems">Systems</SelectItem>
                      <SelectItem value="expansion">Expansion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={inviteClient.isPending}>
                  {inviteClient.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Send Invitation
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Clients ({clients?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !clients?.length ? (
              <p className="text-center text-muted-foreground py-8">No portal clients yet. Click "Invite Client" to send an invitation.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name || '—'}</TableCell>
                      <TableCell>{client.email || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{tierLabel[client.tier || ''] || client.tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{phaseLabel[client.program_phase || ''] || client.program_phase}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.onboarding_status === 'complete' ? 'default' : 'secondary'}>
                          {client.onboarding_status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(client.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
