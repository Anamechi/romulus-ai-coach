import { useState } from 'react';
import { useContentRevisions, useRestoreRevision, ContentRevision } from '@/hooks/useContentRevisions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { History, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface RevisionHistoryProps {
  entityType: string;
  entityId: string;
  onRestore: (snapshot: Record<string, any>) => Promise<void>;
}

export function RevisionHistory({ entityType, entityId, onRestore }: RevisionHistoryProps) {
  const { data: revisions, isLoading } = useContentRevisions(entityType, entityId);
  const restoreRevision = useRestoreRevision();
  const [expandedRevision, setExpandedRevision] = useState<string | null>(null);
  const [confirmRestore, setConfirmRestore] = useState<ContentRevision | null>(null);

  if (isLoading) {
    return <div className="text-center py-4 text-muted-foreground">Loading revisions...</div>;
  }

  if (!revisions?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No revision history yet</p>
        <p className="text-sm">Revisions are saved automatically when you update content</p>
      </div>
    );
  }

  const handleRestore = async () => {
    if (!confirmRestore) return;
    await restoreRevision.mutateAsync({
      revision: confirmRestore,
      onRestore,
    });
    setConfirmRestore(null);
  };

  return (
    <>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {revisions.map((revision) => (
            <div
              key={revision.id}
              className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v{revision.revision_number}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(revision.created_at), 'MMM d, yyyy HH:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedRevision(
                      expandedRevision === revision.id ? null : revision.id
                    )}
                  >
                    {expandedRevision === revision.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmRestore(revision)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Restore
                  </Button>
                </div>
              </div>
              {revision.change_summary && (
                <p className="text-sm text-muted-foreground mt-1">{revision.change_summary}</p>
              )}
              {expandedRevision === revision.id && (
                <div className="mt-3 p-3 bg-muted rounded text-xs font-mono overflow-auto max-h-48">
                  <pre>{JSON.stringify(revision.content_snapshot, null, 2)}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={!!confirmRestore} onOpenChange={() => setConfirmRestore(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Revision?</DialogTitle>
            <DialogDescription>
              This will replace the current content with version {confirmRestore?.revision_number}.
              Your current changes will be saved as a new revision.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRestore(null)}>Cancel</Button>
            <Button onClick={handleRestore} disabled={restoreRevision.isPending}>
              {restoreRevision.isPending ? 'Restoring...' : 'Restore'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
