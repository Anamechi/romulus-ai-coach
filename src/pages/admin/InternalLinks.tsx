import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Link as LinkIcon, FileText, HelpCircle, ArrowRight, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useInternalLinks,
  useCreateInternalLink,
  useUpdateInternalLink,
  useDeleteInternalLink,
  InternalLink,
  InternalLinkInsert
} from '@/hooks/useInternalLinks';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useFaqs } from '@/hooks/useFaqs';
import { useQAPages } from '@/hooks/useQAPages';
import { useAuth } from '@/hooks/useAuth';
import { useLinkGovernance } from '@/hooks/useLinkGovernance';
import { useContentSettings } from '@/hooks/useContentSettings';

export default function InternalLinks() {
  const { user } = useAuth();
  const { data: links, isLoading } = useInternalLinks();
  const { data: blogPosts } = useBlogPosts(false, user?.id);
  const { data: faqs } = useFaqs();
  const { data: qaPages } = useQAPages();
  const { data: linkGovernance, isLoading: governanceLoading } = useLinkGovernance();
  const { data: settings } = useContentSettings();
  const createLink = useCreateInternalLink();
  const updateLink = useUpdateInternalLink();
  const deleteLink = useDeleteInternalLink();
  
  const minInternalLinks = settings?.min_internal_links ?? 1;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<InternalLink | null>(null);
  const [formData, setFormData] = useState<InternalLinkInsert>({
    source_type: 'blog_post',
    source_id: '',
    target_type: 'blog_post',
    target_id: '',
    link_text: '',
    sort_order: 0,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      source_type: 'blog_post',
      source_id: '',
      target_type: 'blog_post',
      target_id: '',
      link_text: '',
      sort_order: 0,
      is_active: true,
    });
    setEditingLink(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (link: InternalLink) => {
    setEditingLink(link);
    setFormData({
      source_type: link.source_type,
      source_id: link.source_id,
      target_type: link.target_type,
      target_id: link.target_id,
      link_text: link.link_text || '',
      sort_order: link.sort_order,
      is_active: link.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await updateLink.mutateAsync({ id: editingLink.id, ...formData });
        toast.success('Link updated successfully');
      } else {
        await createLink.mutateAsync(formData);
        toast.success('Link created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
      await deleteLink.mutateAsync(id);
      toast.success('Link deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete link');
    }
  };

  const getContentTitle = (type: 'blog_post' | 'faq', id: string) => {
    if (type === 'blog_post') {
      const post = blogPosts?.find((p: any) => p.id === id);
      return post?.title || 'Unknown Post';
    } else {
      const faq = faqs?.find((f: any) => f.id === id);
      return faq?.question || 'Unknown FAQ';
    }
  };

  const sourceOptions = formData.source_type === 'blog_post' ? blogPosts : faqs;
  const targetOptions = formData.target_type === 'blog_post' ? blogPosts : faqs;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold">Internal Links</h1>
            <p className="text-muted-foreground">Manage content relationships, topic clusters, and link governance</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingLink ? 'Edit Link' : 'Add Internal Link'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Source Type</Label>
                    <Select 
                      value={formData.source_type} 
                      onValueChange={(v: 'blog_post' | 'faq') => setFormData({ ...formData, source_type: v, source_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog_post">Blog Post</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Source Content</Label>
                    <Select 
                      value={formData.source_id} 
                      onValueChange={(v) => setFormData({ ...formData, source_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title || item.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Type</Label>
                    <Select 
                      value={formData.target_type} 
                      onValueChange={(v: 'blog_post' | 'faq') => setFormData({ ...formData, target_type: v, target_id: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog_post">Blog Post</SelectItem>
                        <SelectItem value="faq">FAQ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Target Content</Label>
                    <Select 
                      value={formData.target_id} 
                      onValueChange={(v) => setFormData({ ...formData, target_id: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select content" />
                      </SelectTrigger>
                      <SelectContent>
                        {targetOptions?.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title || item.question}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="linkText">Link Text (Optional)</Label>
                  <Input
                    id="linkText"
                    value={formData.link_text || ''}
                    onChange={(e) => setFormData({ ...formData, link_text: e.target.value })}
                    placeholder="Custom link text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createLink.isPending || updateLink.isPending}>
                    {editingLink ? 'Update' : 'Create'} Link
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Governance Summary Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Total Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{links?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className={linkGovernance?.orphaned?.length ? "border-amber-500/50" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Orphaned Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-500">{linkGovernance?.orphaned?.length || 0}</div>
              <p className="text-xs text-muted-foreground">No incoming links</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                Below Threshold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{linkGovernance?.belowThresholdItems?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Less than {minInternalLinks} links</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="links">
          <TabsList>
            <TabsTrigger value="links">All Links ({links?.length || 0})</TabsTrigger>
            <TabsTrigger value="governance" className="gap-2">
              Governance
              {(linkGovernance?.orphaned?.length || 0) > 0 && (
                <Badge variant="destructive" className="ml-1">{linkGovernance?.orphaned?.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : links && links.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {links.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {link.source_type === 'blog_post' ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <HelpCircle className="h-4 w-4 text-accent-foreground" />
                          )}
                          <span className="font-medium truncate max-w-[200px]">
                            {getContentTitle(link.source_type, link.source_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {link.target_type === 'blog_post' ? (
                            <FileText className="h-4 w-4 text-primary" />
                          ) : (
                            <HelpCircle className="h-4 w-4 text-accent-foreground" />
                          )}
                          <span className="font-medium truncate max-w-[200px]">
                            {getContentTitle(link.target_type, link.target_id)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={link.is_active ? 'default' : 'secondary'}>
                          {link.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(link.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <LinkIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No internal links created yet</p>
                <p className="text-sm">Create links to connect related content</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            {governanceLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                {/* Orphaned Content */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      Orphaned Content ({linkGovernance?.orphaned?.length || 0})
                    </CardTitle>
                    <CardDescription>
                      Content with no incoming links has weak authority flow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {linkGovernance?.orphaned?.length ? (
                      <div className="space-y-2">
                        {linkGovernance.orphaned.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {item.type === 'blog_post' ? (
                                <FileText className="h-4 w-4 text-primary" />
                              ) : item.type === 'faq' ? (
                                <HelpCircle className="h-4 w-4 text-accent-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium truncate max-w-md">{item.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">0 incoming links</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No orphaned content found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Below Threshold */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-destructive" />
                      Below Link Threshold ({linkGovernance?.belowThresholdItems?.length || 0})
                    </CardTitle>
                    <CardDescription>
                      Content with fewer than {minInternalLinks} internal links
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {linkGovernance?.belowThresholdItems?.length ? (
                      <div className="space-y-2">
                        {linkGovernance.belowThresholdItems.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {item.type === 'blog_post' ? (
                                <FileText className="h-4 w-4 text-primary" />
                              ) : item.type === 'faq' ? (
                                <HelpCircle className="h-4 w-4 text-accent-foreground" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                              <div>
                                <p className="font-medium truncate max-w-md">{item.title}</p>
                                <p className="text-xs text-muted-foreground capitalize">{item.type.replace('_', ' ')}</p>
                              </div>
                            </div>
                            <Badge variant="destructive">{item.incomingLinks} links</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>All content meets minimum link threshold</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
