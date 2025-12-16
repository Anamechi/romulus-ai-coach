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
import { Loader2, Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor, Author, AuthorInsert } from '@/hooks/useAuthors';

const emptyAuthor: AuthorInsert = {
  full_name: '',
  credentials: '',
  bio: '',
  photo_url: '',
  linkedin_url: '',
  years_experience: null,
  is_active: true,
};

export default function Authors() {
  const { data: authors, isLoading } = useAuthors();
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();
  const deleteAuthor = useDeleteAuthor();

  const [isOpen, setIsOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState<AuthorInsert>(emptyAuthor);

  const openCreate = () => {
    setEditingAuthor(null);
    setFormData(emptyAuthor);
    setIsOpen(true);
  };

  const openEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      full_name: author.full_name,
      credentials: author.credentials || '',
      bio: author.bio || '',
      photo_url: author.photo_url || '',
      linkedin_url: author.linkedin_url || '',
      years_experience: author.years_experience,
      is_active: author.is_active,
    });
    setIsOpen(true);
  };

  const handleSubmit = () => {
    if (editingAuthor) {
      updateAuthor.mutate({ id: editingAuthor.id, ...formData }, {
        onSuccess: () => setIsOpen(false),
      });
    } else {
      createAuthor.mutate(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      deleteAuthor.mutate(id);
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
            <h1 className="text-3xl font-display font-bold text-foreground">Authors</h1>
            <p className="text-muted-foreground mt-1">Manage content authors for E-E-A-T compliance</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Author
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingAuthor ? 'Edit Author' : 'Add Author'}</DialogTitle>
                <DialogDescription>
                  Authors are displayed on content for E-E-A-T signals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credentials">Credentials</Label>
                  <Input
                    id="credentials"
                    value={formData.credentials || ''}
                    onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
                    placeholder="MBA, CPA, Business Coach"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="years_experience">Years Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience || ''}
                      onChange={(e) => setFormData({ ...formData, years_experience: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="15"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url || ''}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
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
                  disabled={!formData.full_name || createAuthor.isPending || updateAuthor.isPending}
                >
                  {(createAuthor.isPending || updateAuthor.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingAuthor ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Authors ({authors?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {authors && authors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Credentials</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authors.map((author) => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">{author.full_name}</TableCell>
                      <TableCell className="text-muted-foreground">{author.credentials || '—'}</TableCell>
                      <TableCell>{author.years_experience ? `${author.years_experience} years` : '—'}</TableCell>
                      <TableCell>
                        <Badge variant={author.is_active ? 'default' : 'secondary'}>
                          {author.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(author)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(author.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No authors yet. Add your first author to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
