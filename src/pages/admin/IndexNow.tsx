import { useState, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Search, CheckCircle, XCircle, Clock, Loader2, Trash2 } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useFaqs } from '@/hooks/useFaqs';
import { usePublishedQAPages } from '@/hooks/useQAPages';
import { useTopics } from '@/hooks/useTopics';
import { useIndexNowBulk } from '@/hooks/useIndexNowBulk';
import { format } from 'date-fns';

const BASE_URL = 'https://drromulusmba.com';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  url: string;
}

export default function IndexNow() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('blog');

  const { data: blogPosts } = useBlogPosts(true);
  const { data: faqs } = useFaqs(true);
  const { data: qaPages } = usePublishedQAPages();
  const { data: topics } = useTopics();
  
  const { submitUrls, isSubmitting, result, getHistory, clearHistory } = useIndexNowBulk();

  const history = getHistory();

  // Transform data to uniform format
  const contentByTab: Record<string, ContentItem[]> = useMemo(() => ({
    blog: (blogPosts || []).map((p: any) => ({
      id: `blog-${p.id}`,
      title: p.title,
      slug: p.slug,
      url: `${BASE_URL}/blog/${p.slug}`,
    })),
    faq: (faqs || []).map((f: any) => ({
      id: `faq-${f.id}`,
      title: f.question,
      slug: f.slug,
      url: `${BASE_URL}/faq/${f.slug}`,
    })),
    qa: (qaPages || []).map((q: any) => ({
      id: `qa-${q.id}`,
      title: q.question,
      slug: q.slug,
      url: `${BASE_URL}/qa/${q.slug}`,
    })),
    topics: (topics || []).filter((t: any) => t.is_active).map((t: any) => ({
      id: `topic-${t.id}`,
      title: t.name,
      slug: t.slug,
      url: `${BASE_URL}/topics/${t.slug}`,
    })),
  }), [blogPosts, faqs, qaPages, topics]);

  const currentContent = contentByTab[activeTab] || [];
  
  const filteredContent = useMemo(() => {
    if (!searchQuery) return currentContent;
    const query = searchQuery.toLowerCase();
    return currentContent.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.slug.toLowerCase().includes(query)
    );
  }, [currentContent, searchQuery]);

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    const allIds = filteredContent.map(item => item.id);
    setSelectedIds(new Set(allIds));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleSubmit = async () => {
    const urls = Array.from(selectedIds)
      .map(id => {
        for (const tab of Object.keys(contentByTab)) {
          const item = contentByTab[tab].find(i => i.id === id);
          if (item) return item.url;
        }
        return null;
      })
      .filter(Boolean) as string[];

    if (urls.length === 0) return;

    await submitUrls(urls);
    setSelectedIds(new Set());
  };

  const selectedCount = selectedIds.size;
  const totalCounts = {
    blog: contentByTab.blog.length,
    faq: contentByTab.faq.length,
    qa: contentByTab.qa.length,
    topics: contentByTab.topics.length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold">IndexNow Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manually submit URLs to search engines for faster indexing
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Content Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Content</CardTitle>
                    <CardDescription>
                      Choose pages to submit to IndexNow
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {selectedCount} selected
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="blog">
                      Blog ({totalCounts.blog})
                    </TabsTrigger>
                    <TabsTrigger value="faq">
                      FAQs ({totalCounts.faq})
                    </TabsTrigger>
                    <TabsTrigger value="qa">
                      Q&A ({totalCounts.qa})
                    </TabsTrigger>
                    <TabsTrigger value="topics">
                      Topics ({totalCounts.topics})
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-4 space-y-3">
                    {/* Search and Actions */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={handleSelectAll}>
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                        Deselect All
                      </Button>
                    </div>

                    {/* Content List */}
                    <ScrollArea className="h-[400px] rounded-md border p-4">
                      <div className="space-y-2">
                        {filteredContent.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={selectedIds.has(item.id)}
                              onCheckedChange={() => handleToggle(item.id)}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.url}
                              </p>
                            </div>
                          </label>
                        ))}
                        {filteredContent.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            No content found
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </Tabs>

                {/* Submit Button */}
                <div className="mt-4 pt-4 border-t">
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedCount === 0 || isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Ping IndexNow ({selectedCount} URLs)
                      </>
                    )}
                  </Button>
                </div>

                {/* Results */}
                {result && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Submission Results</h4>
                    <div className="space-y-1 text-sm">
                      <p>URLs submitted: {result.totalUrls}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {result.endpoints.map((endpoint, i) => (
                          <Badge
                            key={i}
                            variant={endpoint.success ? 'default' : 'destructive'}
                          >
                            {endpoint.success ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {endpoint.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Submission History</CardTitle>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {history.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8 text-sm">
                        No submissions yet
                      </p>
                    ) : (
                      history.map((record) => (
                        <div
                          key={record.id}
                          className="p-3 rounded-lg border bg-card"
                        >
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(record.timestamp), 'MMM d, yyyy h:mm a')}
                          </div>
                          <p className="font-medium text-sm">
                            {record.urlCount} URLs submitted
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {record.endpoints.map((ep, i) => (
                              <Badge
                                key={i}
                                variant={ep.success ? 'outline' : 'destructive'}
                                className="text-xs"
                              >
                                {ep.success ? '✓' : '✗'} {ep.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
