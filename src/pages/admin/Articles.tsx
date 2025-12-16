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
import { Plus, Pencil, Trash2, Eye, ExternalLink } from 'lucide-react';
import { useBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, BlogPost, BlogPostInsert } from '@/hooks/useBlogPosts';
import { useAuthors } from '@/hooks/useAuthors';
import { useReviewers } from '@/hooks/useReviewers';
import { useTopics } from '@/hooks/useTopics';
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
  const { data: posts, isLoading } = useBlogPosts();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const { data: topics } = useTopics();
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const deletePost = useDeleteBlogPost();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      reading_time_minutes: formData.content ? calculateReadingTime(formData.content) : null,
    };
    
    if (editingPost) {
      await updatePost.mutateAsync({ id: editingPost.id, ...dataToSubmit });
    } else {
      await createPost.mutateAsync(dataToSubmit);
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
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      await deletePost.mutateAsync(id);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    const newPublished = !post.published;
    await updatePost.mutateAsync({ 
      id: post.id, 
      published: newPublished,
      published_at: newPublished && !post.published_at ? new Date().toISOString() : post.published_at
    });
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
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      <Label htmlFor="cover_image_url">Cover Image URL</Label>
                      <Input
                        id="cover_image_url"
                        value={formData.cover_image_url || ''}
                        onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value || null })}
                        placeholder="https://..."
                      />
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
                        placeholder="A concise, voice-friendly summary"
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
                          onCheckedChange={(checked) => setFormData({ 
                            ...formData, 
                            published: checked,
                            published_at: checked && !formData.published_at ? new Date().toISOString() : formData.published_at
                          })}
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
                  </TabsContent>
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
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublished(post)}
                            title={post.published ? 'Unpublish' : 'Publish'}
                          >
                            <Eye className="h-4 w-4" />
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
    </AdminLayout>
  );
}
