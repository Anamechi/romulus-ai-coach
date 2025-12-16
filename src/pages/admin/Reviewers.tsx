import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2, UserCheck } from 'lucide-react';
import { useReviewers, useCreateReviewer, useUpdateReviewer, useDeleteReviewer, Reviewer, ReviewerInsert } from '@/hooks/useReviewers';

const emptyReviewer: ReviewerInsert = {
  full_name: '',
  credentials: '',
  bio: '',
  photo_url: '',
  is_active: true,
};

export default function Reviewers() {
  const { data: reviewers, isLoading } = useReviewers();
  const createReviewer = useCreateReviewer();
  const updateReviewer = useUpdateReviewer();
  const deleteReviewer = useDeleteReviewer();

  const [isOpen, setIsOpen] = useState(false);
  const [editingReviewer, setEditingReviewer] = useState<Reviewer | null>(null);
  const [formData, setFormData] = useState<ReviewerInsert>(emptyReviewer);

  const openCreate = () => {
    setEditingReviewer(null);
    setFormData(emptyReviewer);
    setIsOpen(true);
  };

  const openEdit = (reviewer: Reviewer) => {
    setEditingReviewer(reviewer);
    setFormData({
      full_name: reviewer.full_name,
      credentials: reviewer.credentials || '',
      bio: reviewer.bio || '',
      photo_url: reviewer.photo_url || '',
      is_active: reviewer.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingReviewer) {
      updateReviewer.mutate({ id: editingReviewer.id, ...formData }, {
        onSuccess: () => setIsOpen(false),
      });
    } else {
      createReviewer.mutate(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this reviewer?')) {
      deleteReviewer.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Reviewers</h1>
            <p className="text-muted-foreground mt-1">Manage content reviewers for editorial quality</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reviewer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingReviewer ? 'Edit Reviewer' : 'Add Reviewer'}</DialogTitle>
                <DialogDescription>
                  Reviewers verify content accuracy and quality before publishing.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credentials">Credentials</Label>
                  <Input
                    id="credentials"
                    value={formData.credentials || ''}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    placeholder="Editor, Subject Matter Expert"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief professional biography..."
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo_url">Photo URL</Label>
                  <Input
                    id="photo_url"
                    value={formData.photo_url || ''}
                    onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.full_name || createReviewer.isPending || updateReviewer.isPending}
                >
                  {(createReviewer.isPending || updateReviewer.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingReviewer ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              All Reviewers ({reviewers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reviewers && reviewers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Credentials</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewers.map((reviewer) => (
                    <TableRow key={reviewer.id}>
                      <TableCell className="font-medium">{reviewer.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{reviewer.credentials || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={reviewer.is_active ? 'default' : 'secondary'}>
                          {reviewer.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(reviewer)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(reviewer.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No reviewers yet. Add your first reviewer to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
