import { ValidationResult } from '@/lib/validateContentForPublish';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface ValidationDisplayProps {
  validation: ValidationResult | null;
  className?: string;
}

export function ValidationDisplay({ validation, className = '' }: ValidationDisplayProps) {
  if (!validation) return null;

  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <Alert className={`border-green-500/50 bg-green-500/10 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          All validation checks passed. Ready to publish!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {validation.errors.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Errors (must fix before publishing):</strong>
            <ul className="list-disc list-inside mt-1">
              {validation.errors.map((err, i) => (
                <li key={i}>{err.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      {validation.warnings.length > 0 && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            <strong>Warnings (recommended to fix):</strong>
            <ul className="list-disc list-inside mt-1">
              {validation.warnings.map((warn, i) => (
                <li key={i}>{warn.message}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
