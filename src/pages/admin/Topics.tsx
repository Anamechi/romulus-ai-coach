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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Pencil, Trash2, Hash } from 'lucide-react';
import { useTopics, useCreateTopic, useUpdateTopic, useDeleteTopic, Topic, TopicInsert, FunnelStage } from '@/hooks/useTopics';
import { useCategories } from '@/hooks/useCategories';

const emptyTopic: TopicInsert = {
  name: '',
  slug: '',
  description: '',
  category_id: null,
  funnel_stage: 'TOFU',
  sort_order: 0,
  is_active: true,
};

const funnelStages: { value: FunnelStage; label: string; description: string }[] = [
  { value: 'TOFU', label: 'TOFU', description: 'Top of Funnel - Awareness' },
  { value: 'MOFU', label: 'MOFU', description: 'Middle of Funnel - Consideration' },
  { value: 'BOFU', label: 'BOFU', description: 'Bottom of Funnel - Decision' },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Topics() {
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const deleteTopic = useDeleteTopic();

  const [isOpen, setIsOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState<TopicInsert>(emptyTopic);

  const isLoading = topicsLoading || categoriesLoading;

  const openCreate = () => {
    setEditingTopic(null);
    setFormData(emptyTopic);
    setIsOpen(true);
  };

  const openEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      name: topic.name,
      slug: topic.slug,
      description: topic.description || '',
      category_id: topic.category_id,
      funnel_stage: topic.funnel_stage,
      sort_order: topic.sort_order,
      is_active: topic.is_active,
    });
    setIsOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: editingTopic ? formData.slug : generateSlug(name),
    });
  };

  const handleSubmit = () => {
    if (editingTopic) {
      updateTopic.mutate({ id: editingTopic.id, ...formData }, {
        onSuccess: () => setIsOpen(false),
      });
    } else {
      createTopic.mutate(formData, {
        onSuccess: () => setIsOpen(false),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this topic?')) {
      deleteTopic.mutate(id);
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId || !categories) return null;
    const category = categories.find(c => c.id === categoryId);
    return category?.name || null;
  };

  const getFunnelBadgeVariant = (stage: FunnelStage) => {
    switch (stage) {
      case 'TOFU': return 'outline';
      case 'MOFU': return 'secondary';
      case 'BOFU': return 'default';
      default: return 'outline';
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
            <h1 className="text-3xl font-display font-bold text-foreground">Topics</h1>
            <p className="text-muted-foreground mt-1">Manage content topics with funnel stage assignments</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add Topic'}</DialogTitle>
                <DialogDescription>
                  Topics are used for content clustering and internal linking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Email Marketing Automation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="email-marketing-automation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this topic..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category_id || 'none'}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? null : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No category</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="funnel_stage">Funnel Stage *</Label>
                    <Select
                      value={formData.funnel_stage}
                      onValueChange={(value) => setFormData({ ...formData, funnel_stage: value as FunnelStage })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {funnelStages.map((stage) => (
                          <SelectItem key={stage.value} value={stage.value}>
                            {stage.label} - {stage.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sort_order">Sort Order</Label>
                  <Input
                    id="sort_order"
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
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
                  disabled={!formData.name || !formData.slug || createTopic.isPending || updateTopic.isPending}
                >
                  {(createTopic.isPending || updateTopic.isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  )}
                  {editingTopic ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              All Topics ({topics?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topics && topics.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Funnel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell className="font-medium">{topic.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{topic.slug}</TableCell>
                      <TableCell>{getCategoryName(topic.category_id) || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={getFunnelBadgeVariant(topic.funnel_stage)}>
                          {topic.funnel_stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={topic.is_active ? 'default' : 'secondary'}>
                          {topic.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(topic)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Hash className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No topics yet. Add your first topic to get started.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
