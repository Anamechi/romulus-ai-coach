import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Pencil, Trash2, ExternalLink, Globe, Award, Zap, Loader2 } from 'lucide-react';
import { useCitations, useCreateCitation, useUpdateCitation, useDeleteCitation, Citation, CitationInsert } from '@/hooks/useCitations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Citations() {
  const { data: citations, isLoading, refetch } = useCitations();
  const createCitation = useCreateCitation();
  const updateCitation = useUpdateCitation();
  const deleteCitation = useDeleteCitation();
  const { toast } = useToast();

  const [isBulkAttaching, setIsBulkAttaching] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCitation, setEditingCitation] = useState<Citation | null>(null);
  const [formData, setFormData] = useState<Partial<CitationInsert>>({
    url: '',
    title: '',
    source_name: '',
    author_name: '',
    published_date: '',
    domain_authority: null,
    excerpt: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      url: '',
      title: '',
      source_name: '',
      author_name: '',
      published_date: '',
      domain_authority: null,
      excerpt: '',
      is_active: true,
    });
    setEditingCitation(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (citation: Citation) => {
    setEditingCitation(citation);
    setFormData({
      url: citation.url,
      title: citation.title,
      source_name: citation.source_name || '',
      author_name: citation.author_name || '',
      published_date: citation.published_date || '',
      domain_authority: citation.domain_authority,
      excerpt: citation.excerpt || '',
      is_active: citation.is_active ?? true,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const citationData: CitationInsert = {
      url: formData.url || '',
      title: formData.title || '',
      source_name: formData.source_name || null,
      author_name: formData.author_name || null,
      published_date: formData.published_date || null,
      domain_authority: formData.domain_authority || null,
      excerpt: formData.excerpt || null,
      is_active: formData.is_active ?? true,
    };

    if (editingCitation) {
      await updateCitation.mutateAsync({ id: editingCitation.id, ...citationData });
    } else {
      await createCitation.mutateAsync(citationData);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this citation?')) {
      await deleteCitation.mutateAsync(id);
    }
  };

  const handleBulkAttach = async () => {
    setIsBulkAttaching(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-attach-citations');
      if (error) throw error;

      toast({
        title: 'Bulk attach complete',
        description: `Seeded ${data.citations_seeded} citations. Attached ${data.total_attachments} links across ${data.blog_posts_processed} blog posts and ${data.qa_pages_processed} Q&A pages.`,
      });
      refetch();
    } catch (err: any) {
      toast({
        title: 'Bulk attach failed',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsBulkAttaching(false);
    }
  };

  const getDomainAuthorityBadge = (da: number | null) => {
    if (!da) return null;
    if (da >= 70) return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">DA {da}</Badge>;
    if (da >= 40) return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">DA {da}</Badge>;
    return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">DA {da}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Citations</h1>
            <p className="text-muted-foreground mt-1">Manage citations for E-E-A-T credibility</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleBulkAttach}
              disabled={isBulkAttaching}
              variant="outline"
              className="gap-2"
            >
              {isBulkAttaching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {isBulkAttaching ? 'Attaching...' : 'Bulk Attach to All Content'}
            </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Citation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingCitation ? 'Edit Citation' : 'Add New Citation'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="url">URL *</Label>
                    <Input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://example.com/article"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Article or resource title"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="source_name">Source Name</Label>
                    <Input
                      id="source_name"
                      value={formData.source_name || ''}
                      onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                      placeholder="Harvard Business Review"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author_name">Author Name</Label>
                    <Input
                      id="author_name"
                      value={formData.author_name || ''}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="published_date">Published Date</Label>
                    <Input
                      id="published_date"
                      type="date"
                      value={formData.published_date || ''}
                      onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="domain_authority">Domain Authority (0-100)</Label>
                    <Input
                      id="domain_authority"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.domain_authority ?? ''}
                      onChange={(e) => setFormData({ ...formData, domain_authority: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="75"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="excerpt">Excerpt / Key Quote</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="A key quote or summary from the source..."
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCitation.isPending || updateCitation.isPending}>
                    {editingCitation ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              All Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : citations && citations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>DA</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citations.map((citation) => (
                    <TableRow key={citation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{citation.title}</div>
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            {new URL(citation.url).hostname}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {citation.source_name || '-'}
                          {citation.author_name && (
                            <div className="text-xs text-muted-foreground">by {citation.author_name}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getDomainAuthorityBadge(citation.domain_authority)}</TableCell>
                      <TableCell>
                        <Badge variant={citation.is_active ? 'default' : 'secondary'}>
                          {citation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEditDialog(citation)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(citation.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No citations yet. Add your first citation to build domain trust.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
