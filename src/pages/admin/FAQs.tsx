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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Eye, Code } from 'lucide-react';
import { useFaqs, useCreateFaq, useUpdateFaq, useDeleteFaq, FAQ, FAQInsert } from '@/hooks/useFaqs';
import { useAuthors } from '@/hooks/useAuthors';
import { useReviewers } from '@/hooks/useReviewers';
import { useTopics } from '@/hooks/useTopics';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60);
};

export default function FAQsAdmin() {
  const { data: faqs, isLoading } = useFaqs();
  const { data: authors } = useAuthors();
  const { data: reviewers } = useReviewers();
  const { data: topics } = useTopics();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();
  const deleteFaq = useDeleteFaq();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const [formData, setFormData] = useState<FAQInsert>({
    slug: '',
    question: '',
    answer: '',
    speakable_answer: null,
    status: 'draft',
    featured: false,
    author_id: null,
    reviewer_id: null,
    topic_id: null,
    sort_order: 0,
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      question: '',
      answer: '',
      speakable_answer: null,
      status: 'draft',
      featured: false,
      author_id: null,
      reviewer_id: null,
      topic_id: null,
      sort_order: 0,
    });
    setEditingFaq(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      await updateFaq.mutateAsync({ id: editingFaq.id, ...formData });
    } else {
      await createFaq.mutateAsync(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setFormData({
      slug: faq.slug,
      question: faq.question,
      answer: faq.answer,
      speakable_answer: faq.speakable_answer,
      status: faq.status,
      featured: faq.featured ?? false,
      author_id: faq.author_id,
      reviewer_id: faq.reviewer_id,
      topic_id: faq.topic_id,
      sort_order: faq.sort_order ?? 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await deleteFaq.mutateAsync(id);
    }
  };

  const toggleStatus = async (faq: FAQ) => {
    const newStatus = faq.status === 'published' ? 'draft' : 'published';
    await updateFaq.mutateAsync({ id: faq.id, status: newStatus });
  };

  const generateSchema = (faq: FAQ) => {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [{
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }]
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'archived':
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">FAQs</h1>
            <p className="text-muted-foreground">Manage frequently asked questions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add FAQ</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        question: e.target.value,
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
                  <Label htmlFor="answer">Answer *</Label>
                  <Textarea
                    id="answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="speakable_answer">Speakable Answer (for voice assistants)</Label>
                  <Textarea
                    id="speakable_answer"
                    value={formData.speakable_answer || ''}
                    onChange={(e) => setFormData({ ...formData, speakable_answer: e.target.value || null })}
                    rows={3}
                    placeholder="A concise, voice-friendly version of the answer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort Order</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured FAQ</Label>
                </div>

                <Button type="submit" className="w-full">
                  {editingFaq ? 'Update FAQ' : 'Create FAQ'}
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
                    <TableHead>Question</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs?.map((faq: any) => (
                    <TableRow key={faq.id}>
                      <TableCell className="max-w-md">
                        <div className="font-medium truncate">{faq.question}</div>
                        <div className="text-sm text-muted-foreground">/faq/{faq.slug}</div>
                      </TableCell>
                      <TableCell>{faq.topic?.name || '-'}</TableCell>
                      <TableCell>{getStatusBadge(faq.status)}</TableCell>
                      <TableCell>{faq.featured ? '⭐' : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleStatus(faq)}
                            title={faq.status === 'published' ? 'Unpublish' : 'Publish'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { setSelectedFaq(faq); setSchemaPreviewOpen(true); }}
                            title="View Schema"
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(faq)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {faqs?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No FAQs yet. Create your first one!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Schema Preview Dialog */}
        <Dialog open={schemaPreviewOpen} onOpenChange={setSchemaPreviewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>JSON-LD Schema Preview</DialogTitle>
            </DialogHeader>
            {selectedFaq && (
              <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
                {JSON.stringify(generateSchema(selectedFaq), null, 2)}
              </pre>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
