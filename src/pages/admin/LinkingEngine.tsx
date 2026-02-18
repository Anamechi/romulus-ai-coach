import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Loader2,
  FileText,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
} from 'lucide-react';
import {
  useLinkingScanRuns,
  useLinkingScanItems,
  useStartLinkingScan,
  useApplyLinkSuggestions,
  useDeleteScanRun,
  LinkingScanRun,
  LinkingScanItem,
  ScanMode,
} from '@/hooks/useLinkingScans';
import { useTopics } from '@/hooks/useTopics';
import { format } from 'date-fns';

const STATUS_CONFIG = {
  pending: { label: 'Pending', icon: Clock, color: 'text-muted-foreground' },
  running: { label: 'Running', icon: Loader2, color: 'text-blue-500' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-500' },
  failed: { label: 'Failed', icon: XCircle, color: 'text-destructive' },
};

export default function LinkingEnginePage() {
  const { data: scanRuns, isLoading: runsLoading } = useLinkingScanRuns();
  const { data: topics } = useTopics();
  const startScan = useStartLinkingScan();
  const applySuggestions = useApplyLinkSuggestions();
  const deleteScanRun = useDeleteScanRun();

  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const { data: scanItems, isLoading: itemsLoading } = useLinkingScanItems(selectedRunId);

  const [mode, setMode] = useState<ScanMode>('report_only');
  const [contentTypes, setContentTypes] = useState<string[]>(['blog_post']);
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [maxExternalLinks, setMaxExternalLinks] = useState(2);
  const [detailsItem, setDetailsItem] = useState<LinkingScanItem | null>(null);

  const handleStartScan = async () => {
    await startScan.mutateAsync({
      mode,
      content_types: contentTypes,
      topic_filter: topicFilter !== 'all' ? topicFilter : undefined,
      max_external_links: maxExternalLinks,
    });
  };

  const handleApplyAll = async (runId: string) => {
    const items = scanItems?.filter((item) => !item.applied && item.status === 'completed');
    if (items && items.length > 0) {
      await applySuggestions.mutateAsync(items.map((i) => i.id));
    }
  };

  const handleDeleteRun = async (id: string) => {
    if (confirm('Delete this scan run and all its results?')) {
      await deleteScanRun.mutateAsync(id);
      if (selectedRunId === id) {
        setSelectedRunId(null);
      }
    }
  };

  const downloadReport = (run: LinkingScanRun) => {
    const items = scanItems || [];
    const report = {
      scan_id: run.id,
      started_at: run.started_at,
      completed_at: run.completed_at,
      mode: run.mode,
      content_types: run.content_types,
      total_items: run.total_items,
      items: items.map((item) => ({
        content_type: item.content_type,
        content_title: item.content_title,
        pillar_suggestion: item.pillar_page_suggestion,
        related_post_suggestion: item.related_post_suggestion,
        faq_suggestion: item.faq_suggestion,
        external_citations: item.external_citations,
        warnings: item.warnings,
        applied: item.applied,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linking-report-${format(new Date(run.started_at), 'yyyy-MM-dd-HHmm')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleContentType = (type: string) => {
    setContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Linking Engine</h1>
          <p className="text-muted-foreground">
            Scan content and apply internal/external link suggestions
          </p>
        </div>

        <Tabs defaultValue="scan" className="space-y-6">
          <TabsList>
            <TabsTrigger value="scan">New Scan</TabsTrigger>
            <TabsTrigger value="history">Scan History</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Configuration</CardTitle>
                <CardDescription>
                  Configure and run a new content linking scan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mode Selection */}
                <div className="space-y-3">
                  <Label>Scan Mode</Label>
                  <div className="flex gap-4">
                    <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${
                        mode === 'report_only'
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setMode('report_only')}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Report Only</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Generate suggestions without modifying content
                      </p>
                    </div>
                    <div
                      className={`flex-1 p-4 border rounded-lg cursor-pointer transition-colors ${
                        mode === 'auto_apply'
                          ? 'border-accent bg-accent/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                      onClick={() => setMode('auto_apply')}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Play className="h-4 w-4" />
                        <span className="font-medium">Auto-Apply</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Automatically insert suggested links into content
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content Types */}
                <div className="space-y-3">
                  <Label>Content Types</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="blog_post"
                        checked={contentTypes.includes('blog_post')}
                        onCheckedChange={() => toggleContentType('blog_post')}
                      />
                      <Label htmlFor="blog_post" className="flex items-center gap-1 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        Blog Posts
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="faq"
                        checked={contentTypes.includes('faq')}
                        onCheckedChange={() => toggleContentType('faq')}
                      />
                      <Label htmlFor="faq" className="flex items-center gap-1 cursor-pointer">
                        <HelpCircle className="h-4 w-4" />
                        FAQs
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="qa_page"
                        checked={contentTypes.includes('qa_page')}
                        onCheckedChange={() => toggleContentType('qa_page')}
                      />
                      <Label htmlFor="qa_page" className="flex items-center gap-1 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        Q&A Pages
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Topic Filter */}
                <div className="space-y-3">
                  <Label>Topic Filter (Optional)</Label>
                  <Select value={topicFilter} onValueChange={setTopicFilter}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="All topics" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Topics</SelectItem>
                      {topics?.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Max External Links */}
                <div className="space-y-3">
                  <Label>Max External Links per Content: {maxExternalLinks}</Label>
                  <Slider
                    value={[maxExternalLinks]}
                    onValueChange={([value]) => setMaxExternalLinks(value)}
                    min={1}
                    max={3}
                    step={1}
                    className="w-64"
                  />
                  <p className="text-xs text-muted-foreground">
                    Limit external authority citations (1-3 recommended)
                  </p>
                </div>

                {/* Run Button */}
                <Button
                  onClick={handleStartScan}
                  disabled={contentTypes.length === 0 || startScan.isPending}
                  size="lg"
                >
                  {startScan.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  Start Scan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {runsLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-6">
                {/* Scan Runs List */}
                <div className="col-span-4 space-y-3">
                  <h3 className="font-medium">Scan Runs</h3>
                  {scanRuns?.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4">No scans yet</p>
                  ) : (
                    <div className="space-y-2">
                      {scanRuns?.map((run) => {
                        const StatusIcon = STATUS_CONFIG[run.status].icon;
                        return (
                          <Card
                            key={run.id}
                            className={`cursor-pointer transition-colors ${
                              selectedRunId === run.id ? 'border-accent' : ''
                            }`}
                            onClick={() => setSelectedRunId(run.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <StatusIcon
                                    className={`h-4 w-4 ${STATUS_CONFIG[run.status].color} ${
                                      run.status === 'running' ? 'animate-spin' : ''
                                    }`}
                                  />
                                  <span className="text-sm font-medium">
                                    {format(new Date(run.started_at), 'MMM d, h:mm a')}
                                  </span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {run.mode === 'auto_apply' ? 'Auto' : 'Report'}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {run.processed_items}/{run.total_items} items •{' '}
                                {run.content_types.join(', ')}
                              </div>
                              <div className="flex gap-1 mt-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRunId(run.id);
                                    downloadReport(run);
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteRun(run.id);
                                  }}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Scan Results */}
                <div className="col-span-8">
                  {selectedRunId ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Scan Results</h3>
                        {scanItems?.some((i) => !i.applied && i.status === 'completed') && (
                          <Button
                            size="sm"
                            onClick={() => handleApplyAll(selectedRunId)}
                            disabled={applySuggestions.isPending}
                          >
                            {applySuggestions.isPending && (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            )}
                            Apply All Suggestions
                          </Button>
                        )}
                      </div>
                      {itemsLoading ? (
                        <div className="flex items-center justify-center h-32">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <div className="border rounded-lg">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Content</TableHead>
                                <TableHead>Links</TableHead>
                                <TableHead>Warnings</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {scanItems?.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <div>
                                      <span className="font-medium truncate block max-w-[200px]">
                                        {item.content_title || 'Untitled'}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {item.content_type}
                                      </span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                      <LinkIcon className="h-3 w-3" />
                                      <span>+{item.internal_links_added}</span>
                                      <ExternalLink className="h-3 w-3 ml-2" />
                                      <span>+{item.external_links_added}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {item.warnings?.length > 0 && (
                                      <Badge variant="secondary" className="text-amber-600">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        {item.warnings.length}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={item.applied ? 'default' : 'outline'}
                                    >
                                      {item.applied ? 'Applied' : 'Pending'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setDetailsItem(item)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                              {scanItems?.length === 0 && (
                                <TableRow>
                                  <TableCell
                                    colSpan={5}
                                    className="text-center py-8 text-muted-foreground"
                                  >
                                    No results yet
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-muted-foreground">
                      Select a scan run to view results
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={!!detailsItem} onOpenChange={() => setDetailsItem(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{detailsItem?.content_title || 'Content Details'}</DialogTitle>
            </DialogHeader>
            {detailsItem && (
              <div className="space-y-6">
                {/* Internal Links */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Internal Link Suggestions
                  </h4>
                  <div className="space-y-2 text-sm">
                    {detailsItem.pillar_page_suggestion ? (
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">Pillar:</span>{' '}
                        <span className="font-medium">
                          {detailsItem.pillar_page_suggestion.title}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          → {detailsItem.pillar_page_suggestion.anchor_text}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No pillar page suggestion</p>
                    )}
                    {detailsItem.related_post_suggestion ? (
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">Related Post:</span>{' '}
                        <span className="font-medium">
                          {detailsItem.related_post_suggestion.title}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          → {detailsItem.related_post_suggestion.anchor_text}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No related post suggestion</p>
                    )}
                    {detailsItem.faq_suggestion ? (
                      <div className="p-2 bg-muted rounded">
                        <span className="text-muted-foreground">FAQ:</span>{' '}
                        <span className="font-medium">{detailsItem.faq_suggestion.title}</span>
                        <span className="text-muted-foreground ml-2">
                          → {detailsItem.faq_suggestion.anchor_text}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No FAQ suggestion</p>
                    )}
                  </div>
                </div>

                {/* External Citations */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    External Citations
                  </h4>
                  {detailsItem.external_citations?.length > 0 ? (
                    <div className="space-y-2 text-sm">
                      {detailsItem.external_citations.map((citation, i) => (
                        <div key={i} className="p-2 bg-muted rounded">
                          <span className="font-medium">{citation.source_name}</span>
                          <span className="text-muted-foreground ml-2">({citation.domain})</span>
                          <br />
                          <span className="text-xs text-muted-foreground">
                            Anchor: {citation.anchor_text}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No external citations</p>
                  )}
                </div>

                {/* Warnings */}
                {detailsItem.warnings?.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Warnings
                    </h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {detailsItem.warnings.map((warning, i) => (
                        <li key={i} className="text-muted-foreground">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
