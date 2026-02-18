import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, X, Link2, Loader2 } from 'lucide-react';
import { useCitations } from '@/hooks/useCitations';
import {
  useBlogPostCitations, useAddBlogPostCitation, useRemoveBlogPostCitation,
  useFaqCitations, useAddFaqCitation, useRemoveFaqCitation,
  useQAPageCitations, useAddQAPageCitation, useRemoveQAPageCitation,
} from '@/hooks/useCitations';

interface CitationPickerProps {
  contentType: 'blog_post' | 'faq' | 'qa_page';
  contentId: string;
}

export function CitationPicker({ contentType, contentId }: CitationPickerProps) {
  const [search, setSearch] = useState('');
  const { data: allCitations, isLoading: citationsLoading } = useCitations(true);

  // Select the right hooks based on content type
  const blogCitations = useBlogPostCitations(contentType === 'blog_post' ? contentId : '');
  const faqCitationsData = useFaqCitations(contentType === 'faq' ? contentId : '');
  const qaCitations = useQAPageCitations(contentType === 'qa_page' ? contentId : '');

  const addBlogCitation = useAddBlogPostCitation();
  const removeBlogCitation = useRemoveBlogPostCitation();
  const addFaqCitation = useAddFaqCitation();
  const removeFaqCitation = useRemoveFaqCitation();
  const addQACitation = useAddQAPageCitation();
  const removeQACitation = useRemoveQAPageCitation();

  const attachedData = contentType === 'blog_post' ? blogCitations.data
    : contentType === 'faq' ? faqCitationsData.data
    : qaCitations.data;

  const isLoadingAttached = contentType === 'blog_post' ? blogCitations.isLoading
    : contentType === 'faq' ? faqCitationsData.isLoading
    : qaCitations.isLoading;

  const attachedCitationIds = new Set(
    (attachedData || []).map((item: any) => item.citation_id)
  );

  const filteredCitations = (allCitations || []).filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.title.toLowerCase().includes(q) ||
      (c.source_name || '').toLowerCase().includes(q) ||
      c.url.toLowerCase().includes(q);
  });

  const handleAttach = (citationId: string) => {
    if (contentType === 'blog_post') {
      addBlogCitation.mutate({ blogPostId: contentId, citationId });
    } else if (contentType === 'faq') {
      addFaqCitation.mutate({ faqId: contentId, citationId });
    } else {
      addQACitation.mutate({ qaPageId: contentId, citationId });
    }
  };

  const handleDetach = (citationId: string) => {
    if (contentType === 'blog_post') {
      removeBlogCitation.mutate({ blogPostId: contentId, citationId });
    } else if (contentType === 'faq') {
      removeFaqCitation.mutate({ faqId: contentId, citationId });
    } else {
      removeQACitation.mutate({ qaPageId: contentId, citationId });
    }
  };

  const isMutating = addBlogCitation.isPending || removeBlogCitation.isPending ||
    addFaqCitation.isPending || removeFaqCitation.isPending ||
    addQACitation.isPending || removeQACitation.isPending;

  if (citationsLoading || isLoadingAttached) {
    return <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>;
  }

  const attached = filteredCitations.filter(c => attachedCitationIds.has(c.id));
  const available = filteredCitations.filter(c => !attachedCitationIds.has(c.id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search citations by title, source, or URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {attached.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Attached ({attachedCitationIds.size})</h4>
          <ScrollArea className="max-h-48">
            <div className="space-y-2">
              {attached.map(c => (
                <div key={c.id} className="flex items-center justify-between gap-2 p-2 rounded-md border border-primary/20 bg-primary/5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">{c.title}</span>
                      {c.domain_authority && (
                        <Badge variant="secondary" className="shrink-0 text-xs">DA {c.domain_authority}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{c.source_name || c.url}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => handleDetach(c.id)}
                    disabled={isMutating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Available ({available.length})
        </h4>
        <ScrollArea className="max-h-64">
          <div className="space-y-1">
            {available.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {search ? 'No matching citations found' : 'All citations are attached'}
              </p>
            )}
            {available.map(c => (
              <div key={c.id} className="flex items-center justify-between gap-2 p-2 rounded-md hover:bg-muted/50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm truncate">{c.title}</span>
                    {c.domain_authority && (
                      <Badge variant="outline" className="shrink-0 text-xs">DA {c.domain_authority}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{c.source_name || c.url}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => handleAttach(c.id)}
                  disabled={isMutating}
                >
                  <Link2 className="h-3 w-3 mr-1" />
                  Attach
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
