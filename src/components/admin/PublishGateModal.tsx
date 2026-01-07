import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, XCircle, CheckCircle2, Shield } from 'lucide-react';
import { ValidationResult } from '@/lib/validateContentForPublish';

interface PublishGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validation: ValidationResult | null;
  onConfirm: () => void;
  onCancel: () => void;
  contentType: string;
  title?: string;
}

export function PublishGateModal({
  open,
  onOpenChange,
  validation,
  onConfirm,
  onCancel,
  contentType,
  title,
}: PublishGateModalProps) {
  if (!validation) return null;

  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Publish Gate Check
          </DialogTitle>
          <DialogDescription>
            {title ? `"${title}"` : `This ${contentType}`} must pass validation before publishing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Summary */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
            {hasErrors ? (
              <>
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="font-semibold text-destructive">Cannot Publish</p>
                  <p className="text-sm text-muted-foreground">
                    {validation.errors.length} error(s) must be fixed before publishing
                  </p>
                </div>
              </>
            ) : hasWarnings ? (
              <>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-600">Warnings Detected</p>
                  <p className="text-sm text-muted-foreground">
                    {validation.warnings.length} warning(s) - you can still publish
                  </p>
                </div>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="font-semibold text-green-600">Ready to Publish</p>
                  <p className="text-sm text-muted-foreground">
                    All checks passed
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Errors */}
          {hasErrors && (
            <div className="space-y-2">
              <h4 className="font-medium text-destructive flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Errors (Must Fix)
              </h4>
              <div className="space-y-2">
                {validation.errors.map((error, idx) => (
                  <div
                    key={`error-${idx}`}
                    className="flex items-start gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
                  >
                    <Badge variant="destructive" className="shrink-0">{error.field}</Badge>
                    <p className="text-sm">{error.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {hasWarnings && (
            <div className="space-y-2">
              <h4 className="font-medium text-amber-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Warnings (Recommended)
              </h4>
              <div className="space-y-2">
                {validation.warnings.map((warning, idx) => (
                  <div
                    key={`warning-${idx}`}
                    className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg"
                  >
                    <Badge variant="secondary" className="shrink-0">{warning.field}</Badge>
                    <p className="text-sm">{warning.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Citation Impact */}
          {(hasErrors || hasWarnings) && (
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Why This Matters for AI Citation</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {hasErrors && validation.errors.some(e => e.field === 'author_id') && (
                  <li>• <strong>Author:</strong> Required for E-E-A-T signals that AI engines use to assess credibility</li>
                )}
                {(hasErrors || hasWarnings) && validation.errors.concat(validation.warnings).some(e => e.field.includes('speakable')) && (
                  <li>• <strong>Speakable:</strong> Voice assistants use this for featured snippets and audio responses</li>
                )}
                {(hasErrors || hasWarnings) && validation.errors.concat(validation.warnings).some(e => e.field.includes('meta')) && (
                  <li>• <strong>Meta fields:</strong> Search engines and AI crawlers use these for indexing and citations</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {!hasErrors && (
            <Button onClick={onConfirm}>
              {hasWarnings ? 'Publish Anyway' : 'Publish'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
