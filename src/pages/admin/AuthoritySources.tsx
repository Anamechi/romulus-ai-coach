import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Search, Globe } from 'lucide-react';
import {
  useAuthoritySources,
  useCreateAuthoritySource,
  useUpdateAuthoritySource,
  useDeleteAuthoritySource,
  getCategoryLabel,
  AuthoritySource,
  AuthoritySourceCategory,
  TrustLevel,
} from '@/hooks/useAuthoritySources';

const CATEGORIES: AuthoritySourceCategory[] = [
  'SEO_AEO',
  'AI_Automation',
  'Business_Leadership',
  'Data_Research',
  'Tech_Security',
  'Explainers',
];

const TRUST_LEVELS: TrustLevel[] = ['Primary', 'Secondary'];

const initialFormData = {
  name: '',
  domain: '',
  category: 'SEO_AEO' as AuthoritySourceCategory,
  trust_level: 'Secondary' as TrustLevel,
  notes: '',
  is_active: true,
};

export default function AuthoritySourcesPage() {
  const { data: sources, isLoading } = useAuthoritySources();
  const createSource = useCreateAuthoritySource();
  const updateSource = useUpdateAuthoritySource();
  const deleteSource = useDeleteAuthoritySource();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<AuthoritySource | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingSource(null);
  };

  const handleEdit = (source: AuthoritySource) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      domain: source.domain,
      category: source.category,
      trust_level: source.trust_level,
      notes: source.notes || '',
      is_active: source.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (editingSource) {
      await updateSource.mutateAsync({ id: editingSource.id, ...formData });
    } else {
      await createSource.mutateAsync(formData);
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this authority source?')) {
      await deleteSource.mutateAsync(id);
    }
  };

  const filteredSources = sources?.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(search.toLowerCase()) ||
      source.domain.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || source.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: sources?.length || 0,
    active: sources?.filter((s) => s.is_active).length || 0,
    primary: sources?.filter((s) => s.trust_level === 'Primary').length || 0,
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
            <h1 className="text-2xl font-display font-bold text-foreground">Authority Sources</h1>
            <p className="text-muted-foreground">Manage trusted external citation sources</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Source
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sources</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <span className="text-2xl font-bold">{stats.total}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <span className="text-2xl font-bold text-green-600">{stats.active}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Primary Sources</CardTitle>
            </CardHeader>
            <CardContent className="py-0 pb-3">
              <span className="text-2xl font-bold text-accent">{stats.primary}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Trust Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources?.map((source) => (
                <TableRow key={source.id}>
                  <TableCell className="font-medium">{source.name}</TableCell>
                  <TableCell>
                    <a
                      href={`https://${source.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-accent hover:underline"
                    >
                      <Globe className="h-3 w-3" />
                      {source.domain}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(source.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={source.trust_level === 'Primary' ? 'default' : 'secondary'}>
                      {source.trust_level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={source.is_active ? 'default' : 'secondary'}>
                      {source.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(source)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(source.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSources?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No authority sources found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSource ? 'Edit Authority Source' : 'Add Authority Source'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Google Search Central"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="e.g., developers.google.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as AuthoritySourceCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {getCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trust_level">Trust Level</Label>
                <Select
                  value={formData.trust_level}
                  onValueChange={(value) =>
                    setFormData({ ...formData, trust_level: value as TrustLevel })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRUST_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional notes about this source"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.domain || createSource.isPending || updateSource.isPending}
              >
                {(createSource.isPending || updateSource.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingSource ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
