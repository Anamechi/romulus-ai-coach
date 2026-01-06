import { supabase } from '@/integrations/supabase/client';

type ContentType = 'blog' | 'faq' | 'qa' | 'topic';

const URL_PREFIXES: Record<ContentType, string> = {
  blog: 'https://drromulusmba.com/blog/',
  faq: 'https://drromulusmba.com/faq/',
  qa: 'https://drromulusmba.com/questions/',
  topic: 'https://drromulusmba.com/topics/',
};

export async function notifyIndexNow(contentType: ContentType, slug: string): Promise<void> {
  const url = `${URL_PREFIXES[contentType]}${slug}`;
  
  try {
    await supabase.functions.invoke('indexnow', {
      body: { urls: [url] },
    });
    console.log(`[IndexNow] Notified search engines: ${url}`);
  } catch (error) {
    console.error('[IndexNow] Failed to notify:', error);
  }
}
