import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  Loader2, 
  Check, 
  X, 
  Edit, 
  Eye, 
  FileText,
  MessageSquare,
  RefreshCw,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  useContentClusters, 
  useContentCluster, 
  useCreateCluster, 
  useUpdateClusterItem,
  useApproveClusterItem,
  useDiscardClusterItem,
  usePublishClusterItems,
  ClusterItem,
  ClusterInput 
} from '@/hooks/useContentClusters';
import { useTopics } from '@/hooks/useTopics';
import { format } from 'date-fns';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
];

const FUNNEL_STAGE_COLORS = {
  TOFU: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  MOFU: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  BOFU: 'bg-green-500/10 text-green-600 border-green-500/20',
};

const CONTENT_TYPE_LABELS = {
  guide: 'Guide',
  explainer: 'Explainer',
  comparison: 'Comparison',
  decision: 'Decision',
};

export default function ContentClusterGenerator() {
  const [formData, setFormData] = useState<ClusterInput>({
    cluster_topic: '',
    target_audience: '',
    primary_keyword: '',
    language: 'en',
    topic_id: null,
  });
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ClusterItem | null>(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);

  const { data: clusters } = useContentClusters();
  const { data: selectedCluster, isLoading: isLoadingCluster } = useContentCluster(selectedClusterId || '');
  const { data: topics } = useTopics();
  const createCluster = useCreateCluster();
  const updateItem = useUpdateClusterItem();
  const approveItem = useApproveClusterItem();
  const discardItem = useDiscardClusterItem();
  const publishItems = usePublishClusterItems();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cluster = await createCluster.mutateAsync(formData);
    setSelectedClusterId(cluster.id);
    setFormData({
      cluster_topic: '',
      target_audience: '',
      primary_keyword: '',
      language: 'en',
      topic_id: null,
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    updateItem.mutate({
      id: editingItem.id,
      updates: {
        title: editingItem.title,
        slug: editingItem.slug,
        content: editingItem.content,
        speakable_answer: editingItem.speakable_answer,
        meta_title: editingItem.meta_title,
        meta_description: editingItem.meta_description,
      },
    });
    setEditingItem(null);
  };

  const handlePublish = (contentType: 'blog' | 'qa_page') => {
    if (!selectedClusterId) return;
    publishItems.mutate({ clusterId: selectedClusterId, contentType });
    setPublishDialogOpen(false);
  };

  const groupedItems = selectedCluster?.items?.reduce((acc, item) => {
    if (!acc[item.funnel_stage]) acc[item.funnel_stage] = [];
    acc[item.funnel_stage].push(item);
    return acc;
  }, {} as Record<string, ClusterItem[]>) || {};

  const approvedCount = selectedCluster?.items?.filter(i => i.status === 'approved').length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Content Cluster Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate structured 6-article content clusters for SEO, AEO, and AI citation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Form & Cluster List */}
          <div className="space-y-6">
            {/* New Cluster Form */}
            <Card>
              <CardHeader>
                <CardTitle>New Cluster</CardTitle>
                <CardDescription>
                  Generate 3 TOFU + 2 MOFU + 1 BOFU articles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cluster_topic">Cluster Topic</Label>
                    <Input
                      id="cluster_topic"
                      placeholder="e.g., Business automation for entrepreneurs"
                      value={formData.cluster_topic}
                      onChange={(e) => setFormData({ ...formData, cluster_topic: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target_audience">Target Audience</Label>
                    <Input
                      id="target_audience"
                      placeholder="e.g., Small business owners scaling operations"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primary_keyword">Primary Keyword</Label>
                    <Input
                      id="primary_keyword"
                      placeholder="e.g., business automation consulting"
                      value={formData.primary_keyword}
                      onChange={(e) => setFormData({ ...formData, primary_keyword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => setFormData({ ...formData, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic_id">Topic (Optional)</Label>
                    <Select
                      value={formData.topic_id || 'none'}
                      onValueChange={(value) => {
                        const selectedTopic = topics?.find(t => t.id === value);
                        setFormData({ 
                          ...formData, 
                          topic_id: value === 'none' ? null : value,
                          cluster_topic: selectedTopic?.name || formData.cluster_topic,
                          target_audience: selectedTopic?.default_target_audience || formData.target_audience,
                          primary_keyword: selectedTopic?.default_primary_keyword || formData.primary_keyword,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No topic</SelectItem>
                        {topics?.filter(t => t.is_active).map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Published content will be assigned to this topic
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCluster.isPending}
                  >
                    {createCluster.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Cluster
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Clusters */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Clusters</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px]">
                  <div className="p-4 space-y-2">
                    {clusters?.length === 0 && (
                      <p className="text-center text-muted-foreground py-4 text-sm">
                        No clusters generated yet
                      </p>
                    )}
                    {clusters?.map((cluster) => (
                      <button
                        key={cluster.id}
                        onClick={() => setSelectedClusterId(cluster.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedClusterId === cluster.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm line-clamp-2">
                            {cluster.cluster_topic}
                          </p>
                          <Badge
                            variant={
                              cluster.status === 'completed' ? 'default' :
                              cluster.status === 'failed' ? 'destructive' :
                              cluster.status === 'generating' ? 'secondary' :
                              'outline'
                            }
                            className="shrink-0 text-xs"
                          >
                            {cluster.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(cluster.created_at), 'MMM d, yyyy')}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Cluster Details */}
          <div className="lg:col-span-2">
            {!selectedClusterId ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a cluster or generate a new one to view details
                  </p>
                </CardContent>
              </Card>
            ) : isLoadingCluster ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading cluster...</p>
                </CardContent>
              </Card>
            ) : selectedCluster?.status === 'generating' ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">Generating Content...</h3>
                    <p className="text-muted-foreground text-sm">
                      Creating 6 articles for your cluster
                    </p>
                  </div>
                  <Progress value={33} className="w-64 mx-auto" />
                  <p className="text-xs text-muted-foreground">
                    This may take a few minutes
                  </p>
                </CardContent>
              </Card>
            ) : selectedCluster?.status === 'failed' ? (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-destructive">Generation Failed</h3>
                  <p className="text-muted-foreground text-sm mt-2">
                    {selectedCluster.error_message || 'An error occurred during generation'}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedClusterId(null)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{selectedCluster?.cluster_topic}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedCluster?.target_audience} • {selectedCluster?.primary_keyword}
                      </CardDescription>
                    </div>
                    {approvedCount > 0 && (
                      <Button onClick={() => setPublishDialogOpen(true)}>
                        Publish {approvedCount} Approved
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="TOFU">
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="TOFU">
                        TOFU ({groupedItems['TOFU']?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="MOFU">
                        MOFU ({groupedItems['MOFU']?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="BOFU">
                        BOFU ({groupedItems['BOFU']?.length || 0})
                      </TabsTrigger>
                    </TabsList>

                    {(['TOFU', 'MOFU', 'BOFU'] as const).map((stage) => (
                      <TabsContent key={stage} value={stage} className="mt-4">
                        <div className="space-y-4">
                          {groupedItems[stage]?.map((item) => (
                            <Card key={item.id} className={`${
                              item.status === 'approved' ? 'border-green-500/50' :
                              item.status === 'discarded' ? 'border-destructive/50 opacity-50' :
                              item.status === 'published' ? 'border-primary/50' : ''
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge className={FUNNEL_STAGE_COLORS[item.funnel_stage]}>
                                        {item.funnel_stage}
                                      </Badge>
                                      <Badge variant="outline">
                                        {CONTENT_TYPE_LABELS[item.content_type]}
                                      </Badge>
                                      {item.status !== 'draft' && (
                                        <Badge variant={
                                          item.status === 'approved' ? 'default' :
                                          item.status === 'published' ? 'secondary' :
                                          'destructive'
                                        }>
                                          {item.status}
                                        </Badge>
                                      )}
                                    </div>
                                    <h4 className="font-semibold">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {item.speakable_answer}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setEditingItem(item)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    {item.status === 'draft' && (
                                      <>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-green-600 hover:text-green-700"
                                          onClick={() => approveItem.mutate(item.id)}
                                        >
                                          <Check className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="text-destructive hover:text-destructive/80"
                                          onClick={() => discardItem.mutate(item.id)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {!groupedItems[stage]?.length && (
                            <p className="text-center text-muted-foreground py-8">
                              No {stage} articles in this cluster
                            </p>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>
              Make changes to this generated article
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Speakable Answer (40-60 words)</Label>
                <Textarea
                  value={editingItem.speakable_answer}
                  onChange={(e) => setEditingItem({ ...editingItem, speakable_answer: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={editingItem.meta_title}
                    onChange={(e) => setEditingItem({ ...editingItem, meta_title: e.target.value })}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {editingItem.meta_title?.length || 0}/60 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input
                    value={editingItem.meta_description}
                    onChange={(e) => setEditingItem({ ...editingItem, meta_description: e.target.value })}
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground">
                    {editingItem.meta_description?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={updateItem.isPending}>
              {updateItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Publish Dialog */}
      <Dialog open={publishDialogOpen} onOpenChange={setPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Approved Items</DialogTitle>
            <DialogDescription>
              Choose how to publish the {approvedCount} approved articles
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => handlePublish('blog')}
              disabled={publishItems.isPending}
            >
              <FileText className="h-8 w-8 mb-2" />
              <span>As Blog Posts</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col"
              onClick={() => handlePublish('qa_page')}
              disabled={publishItems.isPending}
            >
              <MessageSquare className="h-8 w-8 mb-2" />
              <span>As Q&A Pages</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Items will be created as drafts. You can publish them individually from their respective admin pages.
          </p>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
