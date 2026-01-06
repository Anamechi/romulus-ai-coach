import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubmissionRecord {
  id: string;
  timestamp: string;
  urlCount: number;
  successCount: number;
  failedCount: number;
  endpoints: { name: string; success: boolean }[];
}

interface BulkSubmissionResult {
  totalUrls: number;
  successCount: number;
  failedCount: number;
  endpoints: { name: string; success: boolean }[];
}

const HISTORY_KEY = 'indexnow-submission-history';
const MAX_HISTORY_ITEMS = 20;

export function useIndexNowBulk() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<BulkSubmissionResult | null>(null);

  const submitUrls = async (urls: string[]): Promise<BulkSubmissionResult> => {
    setIsSubmitting(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('indexnow', {
        body: { urls },
      });

      if (error) throw error;

      const submissionResult: BulkSubmissionResult = {
        totalUrls: urls.length,
        successCount: data.successCount || 0,
        failedCount: data.failedCount || 0,
        endpoints: data.results?.map((r: any) => ({
          name: r.endpoint,
          success: r.success,
        })) || [],
      };

      setResult(submissionResult);

      // Save to history
      const record: SubmissionRecord = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        urlCount: urls.length,
        successCount: submissionResult.successCount,
        failedCount: submissionResult.failedCount,
        endpoints: submissionResult.endpoints,
      };

      const history = getHistory();
      history.unshift(record);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));

      toast.success(`Submitted ${urls.length} URLs to ${submissionResult.endpoints.filter(e => e.success).length} search engines`);
      
      return submissionResult;
    } catch (error) {
      console.error('IndexNow bulk submission error:', error);
      toast.error('Failed to submit URLs to IndexNow');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHistory = (): SubmissionRecord[] => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    toast.success('Submission history cleared');
  };

  return {
    submitUrls,
    isSubmitting,
    result,
    getHistory,
    clearHistory,
  };
}
