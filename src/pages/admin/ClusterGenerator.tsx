import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, FileText, HelpCircle, Check, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useTopics } from '@/hooks/useTopics';
import { useCreateFaq } from '@/hooks/useFaqs';
import { useCreateBlogPost } from '@/hooks/useBlogPosts';

interface GeneratedFaq {
  question: string;
  answer: string;
  speakable_answer: string;
  selected?: boolean;
}

interface GeneratedBlog {
  title: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  speakable_summary: string;
  reading_time_minutes: number;
  selected?: boolean;
}

export default function ClusterGenerator() {
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const createFaq = useCreateFaq();
  const createBlogPost = useCreateBlogPost();

  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [contentType, setContentType] = useState<'faq' | 'blog'>('faq');
  const [count, setCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [generatedFaqs, setGeneratedFaqs] = useState<GeneratedFaq[]>([]);
  const [generatedBlogs, setGeneratedBlogs] = useState<GeneratedBlog[]>([]);

  const handleGenerate = async () => {
    if (!selectedTopic) {
      toast.error('Please select a topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedFaqs([]);
    setGeneratedBlogs([]);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: contentType, topicId: selectedTopic, count },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      if (contentType === 'faq') {
        setGeneratedFaqs(data.items.map((item: GeneratedFaq) => ({ ...item, selected: true })));
      } else {
        setGeneratedBlogs(data.items.map((item: GeneratedBlog) => ({ ...item, selected: true })));
      }

      toast.success(`Generated ${data.items.length} ${contentType === 'faq' ? 'FAQs' : 'blog posts'}`);
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleFaqSelection = (index: number) => {
    setGeneratedFaqs(prev => prev.map((faq, i) => 
      i === index ? { ...faq, selected: !faq.selected } : faq
    ));
  };

  const toggleBlogSelection = (index: number) => {
    setGeneratedBlogs(prev => prev.map((blog, i) => 
      i === index ? { ...blog, selected: !blog.selected } : blog
    ));
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 60);
  };

  const handleSaveSelected = async () => {
    setIsSaving(true);
    let savedCount = 0;

    try {
      if (contentType === 'faq') {
        const selected = generatedFaqs.filter(f => f.selected);
        for (const faq of selected) {
          await createFaq.mutateAsync({
            question: faq.question,
            answer: faq.answer,
            speakable_answer: faq.speakable_answer,
            slug: generateSlug(faq.question),
            topic_id: selectedTopic,
            status: 'draft',
            sort_order: 0,
            featured: false,
            author_id: null,
            reviewer_id: null,
          });
          savedCount++;
        }
      } else {
        const selected = generatedBlogs.filter(b => b.selected);
        for (const blog of selected) {
          await createBlogPost.mutateAsync({
            title: blog.title,
            slug: generateSlug(blog.title),
            excerpt: blog.excerpt,
            content: blog.content,
            meta_title: blog.meta_title,
            meta_description: blog.meta_description,
            speakable_summary: blog.speakable_summary,
            reading_time_minutes: blog.reading_time_minutes,
            topic_id: selectedTopic,
            published: false,
            featured: false,
            cover_image_url: null,
            published_at: null,
            author_id: null,
            reviewer_id: null,
          });
          savedCount++;
        }
      }

      toast.success(`Saved ${savedCount} ${contentType === 'faq' ? 'FAQs' : 'blog posts'} as drafts`);
      
      // Clear generated content after saving
      if (contentType === 'faq') {
        setGeneratedFaqs([]);
      } else {
        setGeneratedBlogs([]);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCount = contentType === 'faq' 
    ? generatedFaqs.filter(f => f.selected).length
    : generatedBlogs.filter(b => b.selected).length;

  const hasGenerated = generatedFaqs.length > 0 || generatedBlogs.length > 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Cluster Generator
          </h1>
          <p className="text-muted-foreground">
            Generate FAQs and blog posts using AI, guided by your master content prompt
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>Configure what content to generate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Tabs value={contentType} onValueChange={(v) => setContentType(v as 'faq' | 'blog')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="faq" className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      FAQs
                    </TabsTrigger>
                    <TabsTrigger value="blog" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Blog Posts
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                {topicsLoading ? (
                  <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Loading topics...</span>
                  </div>
                ) : topics && topics.length > 0 ? (
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          <div className="flex items-center gap-2">
                            <span>{topic.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {topic.funnel_stage}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="border border-dashed rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">No topics available</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/admin/topics">Create Topics First</Link>
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Number to Generate</Label>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
                <Slider
                  value={[count]}
                  onValueChange={(v) => setCount(v[0])}
                  min={1}
                  max={5}
                  step={1}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating || !selectedTopic}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </Button>

              {hasGenerated && selectedCount > 0 && (
                <Button 
                  onClick={handleSaveSelected}
                  disabled={isSaving}
                  variant="secondary"
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save {selectedCount} Selected as Draft
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
              <CardDescription>
                Review and select content to save as drafts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Generating {contentType === 'faq' ? 'FAQs' : 'blog posts'}...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              ) : contentType === 'faq' && generatedFaqs.length > 0 ? (
                <Accordion type="multiple" className="space-y-2">
                  {generatedFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                      <div className="flex items-center gap-3 py-2">
                        <Switch
                          checked={faq.selected}
                          onCheckedChange={() => toggleFaqSelection(index)}
                        />
                        <AccordionTrigger className="flex-1 hover:no-underline">
                          <span className="text-left font-medium">{faq.question}</span>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4 pl-10">
                          <div>
                            <Label className="text-xs text-muted-foreground">Answer</Label>
                            <p className="text-sm whitespace-pre-wrap">{faq.answer}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Speakable Answer</Label>
                            <p className="text-sm italic">{faq.speakable_answer}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : contentType === 'blog' && generatedBlogs.length > 0 ? (
                <Accordion type="multiple" className="space-y-2">
                  {generatedBlogs.map((blog, index) => (
                    <AccordionItem key={index} value={`blog-${index}`} className="border rounded-lg px-4">
                      <div className="flex items-center gap-3 py-2">
                        <Switch
                          checked={blog.selected}
                          onCheckedChange={() => toggleBlogSelection(index)}
                        />
                        <AccordionTrigger className="flex-1 hover:no-underline">
                          <div className="text-left">
                            <span className="font-medium">{blog.title}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {blog.reading_time_minutes} min read
                            </span>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4 pl-10">
                          <div>
                            <Label className="text-xs text-muted-foreground">Excerpt</Label>
                            <p className="text-sm">{blog.excerpt}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Content Preview</Label>
                            <div className="text-sm whitespace-pre-wrap max-h-60 overflow-y-auto bg-muted/50 p-3 rounded">
                              {blog.content}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">Meta Title</Label>
                              <p className="text-sm">{blog.meta_title}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Meta Description</Label>
                              <p className="text-sm">{blog.meta_description}</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Sparkles className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No content generated yet</p>
                  <p className="text-sm">Select a topic and click Generate</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
