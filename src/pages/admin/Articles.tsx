import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink, RefreshCw, Loader2, History, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, BlogPost, BlogPostInsert } from '@/hooks/useBlogPosts';
import { useAuthors } from '@/hooks/useAuthors';
import { useReviewers } from '@/hooks/useReviewers';
import { useTopics } from '@/hooks/useTopics';
import { useAuth } from '@/hooks/useAuth';
import { useSaveRevision } from '@/hooks/useContentRevisions';
import { useLogAudit } from '@/hooks/useAuditLog';
import { validateBlogPostForPublish, ValidationResult } from '@/lib/validateContentForPublish';
import { RevisionHistory } from '@/components/admin/RevisionHistory';
import { ValidationDisplay } from '@/components/admin/ValidationDisplay';
import { PublishGateModal } from '@/components/admin/PublishGateModal';
import { format } from 'date-fns';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
};

const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export default function ArticlesAdmin() {
  const { user } = useAuth();
  const { data: posts, isLoading } = useBlogPosts(false, user?.id);
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const { data: topics } = useTopics();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();
  const saveRevision = useSaveRevision();
  const logAudit = useLogAudit();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [customImagePrompt, setCustomImagePrompt] = useState('');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [forcePublish, setForcePublish] = useState(false);
  const [publishGateOpen, setPublishGateOpen] = useState(false);
  const [pendingPublishPost, setPendingPublishPost] = useState<BlogPost | null>(null);
  const [pendingPublishValidation, setPendingPublishValidation] = useState<ValidationResult | null>(null);

  const [formData, setFormData] = useState<BlogPostInsert>({
    slug: '',
    title: '',
    excerpt: null,
    content: null,
    cover_image_url: null,
    published: false,
    published_at: null,
    author_id: null,
    reviewer_id: null,
    topic_id: null,
    meta_title: null,
    meta_description: null,
    featured: false,
    reading_time_minutes: null,
    speakable_summary: null,
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      excerpt: null,
      content: null,
      cover_image_url: null,
      published: false,
      published_at: null,
      author_id: null,
      reviewer_id: null,
      topic_id: null,
      meta_title: null,
      meta_description: null,
      featured: false,
      reading_time_minutes: null,
      speakable_summary: null,
    });
    setEditingPost(null);
    setValidation(null);
    setForcePublish(false);
  };

  const runValidation = () => {
    const result = validateBlogPostForPublish(formData);
    setValidation(result);
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validation if trying to publish
    if (formData.published && !forcePublish) {
      const result = runValidation();
      if (!result.isValid) {
        toast.error('Please fix validation errors before publishing');
        return;
      }
    }

    const dataToSubmit = {
      ...formData,
      reading_time_minutes: formData.content ? calculateReadingTime(formData.content) : null,
    };
    
    if (editingPost) {
      // Save revision before updating
      await saveRevision.mutateAsync({
        entity_type: 'blog_post',
        entity_id: editingPost.id,
        content_snapshot: {
          title: editingPost.title,
          content: editingPost.content,
          excerpt: editingPost.excerpt,
          meta_title: editingPost.meta_title,
          meta_description: editingPost.meta_description,
          speakable_summary: editingPost.speakable_summary,
        },
        change_summary: `Updated from "${editingPost.title}"`,
      });

      await updatePost.mutateAsync({ id: editingPost.id, ...dataToSubmit });
      
      logAudit.mutate({
        action: 'update',
        entity_type: 'blog_post',
        entity_id: editingPost.id,
        entity_title: dataToSubmit.title,
        changes: { before: editingPost.title, after: dataToSubmit.title },
      });
    } else {
      const result = await createPost.mutateAsync(dataToSubmit);
      logAudit.mutate({
        action: 'create',
        entity_type: 'blog_post',
        entity_title: dataToSubmit.title,
      });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url,
      published: post.published ?? false,
      published_at: post.published_at,
      author_id: post.author_id,
      reviewer_id: post.reviewer_id,
      topic_id: post.topic_id,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
      featured: post.featured ?? false,
      reading_time_minutes: post.reading_time_minutes,
      speakable_summary: post.speakable_summary,
    });
    setValidation(null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const post = posts?.find(p => p.id === id);
    if (confirm('Are you sure you want to delete this article?')) {
      await deletePost.mutateAsync(id);
      logAudit.mutate({
        action: 'delete',
        entity_type: 'blog_post',
        entity_id: id,
        entity_title: post?.title,
      });
    }
  };

  const togglePublished = async (post: BlogPost) => {
    const newPublished = !post.published;
    
    // Validate before publishing
    if (newPublished) {
      const result = validateBlogPostForPublish({
        title: post.title,
        content: post.content || undefined,
        excerpt: post.excerpt || undefined,
        author_id: post.author_id,
        reviewer_id: post.reviewer_id,
        topic_id: post.topic_id,
        meta_title: post.meta_title,
        meta_description: post.meta_description,
        speakable_summary: post.speakable_summary,
        cover_image_url: post.cover_image_url,
      });
      
      // Show modal if there are errors OR warnings
      if (!result.isValid || result.warnings.length > 0) {
        setPendingPublishPost(post);
        setPendingPublishValidation(result);
        setPublishGateOpen(true);
        return;
      }
    }

    await doPublish(post, newPublished);
  };

  const doPublish = async (post: BlogPost, newPublished: boolean) => {
    await updatePost.mutateAsync({ 
      id: post.id, 
      published: newPublished,
      published_at: newPublished && !post.published_at ? new Date().toISOString() : post.published_at
    });

    logAudit.mutate({
      action: newPublished ? 'publish' : 'unpublish',
      entity_type: 'blog_post',
      entity_id: post.id,
      entity_title: post.title,
    });
    
    toast.success(newPublished ? 'Article published' : 'Article unpublished');
  };

  const handlePublishGateConfirm = async () => {
    if (!pendingPublishPost) return;
    await doPublish(pendingPublishPost, true);
    setPublishGateOpen(false);
    setPendingPublishPost(null);
    setPendingPublishValidation(null);
  };

  const handlePublishGateCancel = () => {
    setPublishGateOpen(false);
    setPendingPublishPost(null);
    setPendingPublishValidation(null);
  };

  const handleRestoreRevision = async (snapshot: Record<string, any>) => {
    if (!editingPost) return;
    setFormData({
      ...formData,
      title: snapshot.title || formData.title,
      content: snapshot.content || formData.content,
      excerpt: snapshot.excerpt || formData.excerpt,
      meta_title: snapshot.meta_title || formData.meta_title,
      meta_description: snapshot.meta_description || formData.meta_description,
      speakable_summary: snapshot.speakable_summary || formData.speakable_summary,
    });
  };

  const regenerateImage = async () => {
    if (!formData.title && !customImagePrompt) {
      toast.error('Please enter a title or custom image description');
      return;
    }

    setIsRegeneratingImage(true);
    try {
      const topic = topics?.find(t => t.id === formData.topic_id);
      const { data, error } = await supabase.functions.invoke('generate-blog-image', {
        body: { 
          title: formData.title,
          topic: topic?.name || 'Business',
          description: formData.excerpt || formData.meta_description || '',
          customPrompt: customImagePrompt || null
        }
      });

      if (error) throw error;
      if (data?.imageUrl) {
        setFormData({ ...formData, cover_image_url: data.imageUrl });
        toast.success('Cover image generated successfully');
      }
    } catch (error: any) {
      console.error('Image generation error:', error);
      toast.error('Failed to generate image: ' + (error.message || 'Unknown error'));
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Articles</h1>
            <p className="text-muted-foreground">Manage blog posts and content</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> New Article</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Article' : 'Create New Article'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    {editingPost && (
                      <TabsTrigger value="history">
                        <History className="h-4 w-4 mr-1" />
                        History
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          setFormData({ 
                            ...formData, 
                            title: e.target.value,
                            slug: formData.slug || generateSlug(e.target.value)
                          });
                        }}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug *</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value || null })}
                        rows={3}
                        placeholder="Brief summary of the article"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value || null })}
                        rows={15}
                        placeholder="Full article content (supports markdown)"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cover_image_url">Cover Image</Label>
                      <div className="flex gap-2">
                        <Input
                          id="cover_image_url"
                          value={formData.cover_image_url || ''}
                          onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value || null })}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={regenerateImage}
                          disabled={isRegeneratingImage}
                        >
                          {isRegeneratingImage ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          <span className="ml-2">{formData.cover_image_url ? 'Regenerate' : 'Generate'}</span>
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Label htmlFor="customImagePrompt" className="text-sm text-muted-foreground">
                          Custom Image Description (optional)
                        </Label>
                        <Textarea
                          id="customImagePrompt"
                          value={customImagePrompt}
                          onChange={(e) => setCustomImagePrompt(e.target.value)}
                          placeholder="Describe the exact image you want"
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                      {formData.cover_image_url && (
                        <div className="mt-2">
                          <img
                            src={formData.cover_image_url}
                            alt="Cover preview"
                            className="max-h-32 rounded-md object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="meta" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title || ''}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value || null })}
                        placeholder="SEO title (defaults to article title)"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground">{(formData.meta_title || '').length}/60 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description || ''}
                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value || null })}
                        placeholder="SEO description (defaults to excerpt)"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">{(formData.meta_description || '').length}/160 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="speakable_summary">Speakable Summary (for voice assistants)</Label>
                      <Textarea
                        id="speakable_summary"
                        value={formData.speakable_summary || ''}
                        onChange={(e) => setFormData({ ...formData, speakable_summary: e.target.value || null })}
                        rows={3}
                        placeholder="A concise, voice-friendly summary (40-60 words)"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="topic_id">Topic</Label>
                        <Select value={formData.topic_id || 'none'} onValueChange={(value) => setFormData({ ...formData, topic_id: value === 'none' ? null : value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {topics?.map((topic) => (
                              <SelectItem key={topic.id} value={topic.id}>{topic.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="author_id">Author</Label>
                        <Select value={formData.author_id || 'none'} onValueChange={(value) => setFormData({ ...formData, author_id: value === 'none' ? null : value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select author" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {authors?.map((author) => (
                              <SelectItem key={author.id} value={author.id}>{author.full_name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewer_id">Reviewer</Label>
                      <Select value={formData.reviewer_id || 'none'} onValueChange={(value) => setFormData({ ...formData, reviewer_id: value === 'none' ? null : value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {reviewers?.map((reviewer) => (
                            <SelectItem key={reviewer.id} value={reviewer.id}>{reviewer.full_name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-4 pt-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) => {
                            setFormData({ 
                              ...formData, 
                              published: checked,
                              published_at: checked && !formData.published_at ? new Date().toISOString() : formData.published_at
                            });
                            if (checked) runValidation();
                          }}
                        />
                        <Label htmlFor="published">Published</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label htmlFor="featured">Featured</Label>
                      </div>
                    </div>

                    {formData.published && (
                      <div className="pt-4 space-y-4">
                        <Button type="button" variant="outline" onClick={runValidation}>
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Validate for Publishing
                        </Button>
                        <ValidationDisplay validation={validation} />
                        {validation && !validation.isValid && (
                          <div className="flex items-center gap-2">
                            <Switch id="force" checked={forcePublish} onCheckedChange={setForcePublish} />
                            <Label htmlFor="force" className="text-sm text-muted-foreground">
                              Force publish anyway (not recommended)
                            </Label>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {editingPost && (
                    <TabsContent value="history" className="mt-4">
                      <RevisionHistory
                        entityType="blog_post"
                        entityId={editingPost.id}
                        onRestore={handleRestoreRevision}
                      />
                    </TabsContent>
                  )}
                </Tabs>

                <Button type="submit" className="w-full">
                  {editingPost ? 'Update Article' : 'Create Article'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post: any) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">/blog/{post.slug}</div>
                      </TableCell>
                      <TableCell>{post.topic?.name || '-'}</TableCell>
                      <TableCell>{post.author?.full_name || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {post.published ? (
                            <Badge className="bg-green-600">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {post.featured && <span>⭐</span>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.published_at 
                          ? format(new Date(post.published_at), 'MMM d, yyyy')
                          : format(new Date(post.created_at), 'MMM d, yyyy')
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant={post.published ? "default" : "outline"}
                            size="sm"
                            onClick={() => togglePublished(post)}
                            className={post.published ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {post.published ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Publish
                              </>
                            )}
                          </Button>
                          {post.published && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                            >
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {posts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No articles yet. Create your first one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <PublishGateModal
        open={publishGateOpen}
        onOpenChange={setPublishGateOpen}
        validation={pendingPublishValidation}
        onConfirm={handlePublishGateConfirm}
        onCancel={handlePublishGateCancel}
        contentType="article"
        title={pendingPublishPost?.title}
      />
    </AdminLayout>
  );
}
