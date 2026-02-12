import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages, Loader2, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { useQAPages } from '@/hooks/useQAPages';
import { useFaqs } from '@/hooks/useFaqs';
import { useTranslations, useTranslateContent } from '@/hooks/useTranslations';
import { toast } from 'sonner';

const LANGUAGES = [
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
];

export default function Translations() {
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contentType, setContentType] = useState<'blog_post' | 'qa_page' | 'faq'>('blog_post');

  const { data: blogPosts } = useBlogPosts();
  const { data: qaPages } = useQAPages();
  const { data: faqs } = useFaqs();
  const { data: translations } = useTranslations(targetLanguage);
  const translateMutation = useTranslateContent();

  const contentItems = contentType === 'blog_post' 
    ? blogPosts?.map(p => ({ id: p.id, title: p.title, slug: p.slug, status: p.published ? 'published' : 'draft' })) || []
    : contentType === 'qa_page'
    ? qaPages?.map(p => ({ id: p.id, title: p.question, slug: p.slug, status: p.status })) || []
    : faqs?.map(f => ({ id: f.id, title: f.question, slug: f.slug, status: f.status })) || [];

  const translatedIds = new Set(
    translations
      ?.filter(t => t.source_type === contentType)
      .map(t => t.source_id) || []
  );

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleTranslate = async () => {
    if (selectedItems.length === 0) {
      toast.error('Select at least one item to translate');
      return;
    }

    for (const itemId of selectedItems) {
      try {
        await translateMutation.mutateAsync({
          sourceId: itemId,
          sourceType: contentType,
          targetLanguage,
        });
      } catch (err: any) {
        toast.error(`Translation failed for item: ${err.message}`);
      }
    }
    
    setSelectedItems([]);
    toast.success(`Translated ${selectedItems.length} items to ${LANGUAGES.find(l => l.value === targetLanguage)?.label}`);
  };

  const selectAll = () => {
    const untranslated = contentItems.filter(i => !translatedIds.has(i.id)).map(i => i.id);
    setSelectedItems(untranslated);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Languages className="h-8 w-8 text-primary" />
            Translation Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Translate content one language at a time with schema preservation
          </p>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Target Language:</span>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map(lang => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.flag} {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={selectAll}
              >
                Select All Untranslated
              </Button>
              <Button
                disabled={selectedItems.length === 0 || translateMutation.isPending}
                onClick={handleTranslate}
              >
                {translateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 mr-2" />
                )}
                Translate {selectedItems.length} Items
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content Selection */}
        <Tabs value={contentType} onValueChange={(v) => { setContentType(v as any); setSelectedItems([]); }}>
          <TabsList>
            <TabsTrigger value="blog_post">Blog Posts ({blogPosts?.length || 0})</TabsTrigger>
            <TabsTrigger value="qa_page">Q&A Pages ({qaPages?.length || 0})</TabsTrigger>
            <TabsTrigger value="faq">FAQs ({faqs?.length || 0})</TabsTrigger>
          </TabsList>

          {['blog_post', 'qa_page', 'faq'].map(type => (
            <TabsContent key={type} value={type}>
              <Card>
                <CardHeader>
                  <CardTitle>Select Content to Translate</CardTitle>
                  <CardDescription>
                    {translatedIds.size} of {contentItems.length} items already translated to {LANGUAGES.find(l => l.value === targetLanguage)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="divide-y">
                      {contentItems.map(item => {
                        const isTranslated = translatedIds.has(item.id);
                        const isSelected = selectedItems.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            onClick={() => !isTranslated && toggleItem(item.id)}
                            disabled={isTranslated}
                            className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                              isTranslated ? 'opacity-60 bg-muted/30' :
                              isSelected ? 'bg-primary/5 border-l-2 border-l-primary' :
                              'hover:bg-muted/50'
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isSelected || isTranslated} 
                              disabled={isTranslated}
                              readOnly 
                              className="rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground">/{item.slug}</p>
                            </div>
                            {isTranslated && (
                              <Badge variant="secondary" className="shrink-0">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Translated
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
}
