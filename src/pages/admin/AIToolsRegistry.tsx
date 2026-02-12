import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Image, Search, Link as LinkIcon, ShieldCheck, 
  FileText, HeartPulse, SpellCheck, Code, Globe, Languages,
  MessageSquare, Loader2, CheckCircle, XCircle, Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContentSettings } from '@/hooks/useContentSettings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: 'active' | 'configured' | 'needs_setup';
  category: 'generation' | 'research' | 'seo' | 'quality' | 'translation';
  actionType: 'navigate' | 'invoke';
  actionTarget?: string;
  edgeFunction?: string;
}

const AI_TOOLS: AITool[] = [
  {
    id: 'cluster-generator',
    name: 'Content Cluster Generator',
    description: 'Generate structured 6-article clusters (3 TOFU, 2 MOFU, 1 BOFU) with EEAT compliance, speakable summaries, and JSON-LD schema.',
    icon: Sparkles,
    status: 'active',
    category: 'generation',
    actionType: 'navigate',
    actionTarget: '/admin/content-cluster-generator',
  },
  {
    id: 'image-generator',
    name: 'AI Image Generator',
    description: 'Generate SEO-optimized images with alt text, captions, and JSON-LD image objects. Includes duplicate detection.',
    icon: Image,
    status: 'active',
    category: 'generation',
    actionType: 'navigate',
    actionTarget: '/admin/articles',
  },
  {
    id: 'qa-generator',
    name: 'QA Generator',
    description: 'Generate 4 contextual Q&A pairs per article with FAQ schema markup. Supports multi-language generation.',
    icon: MessageSquare,
    status: 'active',
    category: 'generation',
    actionType: 'invoke',
    edgeFunction: 'generate-qa',
  },
  {
    id: 'translation-engine',
    name: 'Translation Engine',
    description: 'Translate content to Spanish with preserved schema, group IDs, and correct hreflang assignment.',
    icon: Languages,
    status: 'active',
    category: 'translation',
    actionType: 'navigate',
    actionTarget: '/admin/translations',
  },
  {
    id: 'research-api',
    name: 'Research API (Perplexity)',
    description: 'AI-powered research for citation discovery, fact verification, and competitive analysis.',
    icon: Search,
    status: 'needs_setup',
    category: 'research',
    actionType: 'invoke',
  },
  {
    id: 'internal-linking',
    name: 'Internal Linking Engine',
    description: 'AI-powered internal link suggestions with pillar page mapping and related post recommendations.',
    icon: LinkIcon,
    status: 'active',
    category: 'seo',
    actionType: 'navigate',
    actionTarget: '/admin/linking-engine',
  },
  {
    id: 'citation-engine',
    name: 'Citation Engine',
    description: 'Identify citation opportunities, pull high-authority non-competitor links, and apply across translations.',
    icon: FileText,
    status: 'active',
    category: 'seo',
    actionType: 'navigate',
    actionTarget: '/admin/citations',
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit Tool',
    description: 'Check word count, schema presence, FAQ schema, internal linking, canonical URLs, hreflang, and duplicate content.',
    icon: ShieldCheck,
    status: 'active',
    category: 'seo',
    actionType: 'navigate',
    actionTarget: '/admin/system-check',
  },
  {
    id: 'image-health',
    name: 'Image Health Checker',
    description: 'Validate alt text presence, detect broken images, check duplicates, and verify JSON-LD image objects.',
    icon: HeartPulse,
    status: 'active',
    category: 'quality',
    actionType: 'invoke',
    edgeFunction: 'check-image-health',
  },
  {
    id: 'broken-link-checker',
    name: 'Broken Link Checker',
    description: 'Scan all citations and external links for broken URLs, redirects, and timeouts.',
    icon: HeartPulse,
    status: 'active',
    category: 'quality',
    actionType: 'navigate',
    actionTarget: '/admin/citation-health',
  },
  {
    id: 'spell-check',
    name: 'Spell-Check Engine',
    description: 'AI-powered spell-check and professional tone enforcement across all content.',
    icon: SpellCheck,
    status: 'active',
    category: 'quality',
    actionType: 'invoke',
    edgeFunction: 'spell-check',
  },
  {
    id: 'schema-validator',
    name: 'Schema Validator',
    description: 'Validate JSON-LD structured data for Article, FAQPage, QAPage, Breadcrumb, and SpeakableSpecification schemas.',
    icon: Code,
    status: 'active',
    category: 'quality',
    actionType: 'navigate',
    actionTarget: '/admin/system-check',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  generation: 'Content Generation',
  research: 'Research & Discovery',
  seo: 'SEO & Linking',
  quality: 'Quality Assurance',
  translation: 'Translation & i18n',
};

const STATUS_CONFIG = {
  active: { label: 'Active', variant: 'default' as const, icon: CheckCircle },
  configured: { label: 'Configured', variant: 'secondary' as const, icon: CheckCircle },
  needs_setup: { label: 'Needs Setup', variant: 'outline' as const, icon: XCircle },
};

export default function AIToolsRegistry() {
  const navigate = useNavigate();
  const { data: settings } = useContentSettings();
  const [runningTool, setRunningTool] = useState<string | null>(null);

  const handleRunTool = async (tool: AITool) => {
    if (tool.actionType === 'navigate' && tool.actionTarget) {
      navigate(tool.actionTarget);
      return;
    }

    if (tool.edgeFunction) {
      setRunningTool(tool.id);
      try {
        const { data, error } = await supabase.functions.invoke(tool.edgeFunction, {
          body: {},
        });
        if (error) throw error;
        toast.success(`${tool.name} completed successfully`);
      } catch (err: any) {
        toast.error(`${tool.name} failed: ${err.message}`);
      } finally {
        setRunningTool(null);
      }
    }
  };

  const categories = Object.keys(CATEGORY_LABELS);
  const activeCount = AI_TOOLS.filter(t => t.status === 'active').length;
  const masterPromptConfigured = !!settings?.master_content_prompt && settings.master_content_prompt.length > 50;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            AI Tools Registry
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and run all AI-powered tools from one hub
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{activeCount}</p>
                <p className="text-sm text-muted-foreground">Active Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{AI_TOOLS.length}</p>
                <p className="text-sm text-muted-foreground">Total Tools</p>
              </div>
            </CardContent>
          </Card>
          <Card className={masterPromptConfigured ? '' : 'border-destructive/50'}>
            <CardContent className="pt-6">
              <div className="text-center">
                {masterPromptConfigured ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                    <p className="text-sm text-muted-foreground mt-1">Master Prompt Active</p>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-destructive mx-auto" />
                    <p className="text-sm text-destructive mt-1">Master Prompt Not Configured</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => navigate('/admin/settings')}
                    >
                      Configure Now →
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const tools = AI_TOOLS.filter(t => t.category === category);
          if (tools.length === 0) return null;
          
          return (
            <div key={category} className="space-y-3">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {CATEGORY_LABELS[category]}
                <Badge variant="outline" className="text-xs">{tools.length}</Badge>
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {tools.map((tool) => {
                  const statusCfg = STATUS_CONFIG[tool.status];
                  const isRunning = runningTool === tool.id;
                  
                  return (
                    <Card key={tool.id} className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="p-2.5 bg-primary/10 rounded-lg shrink-0">
                            <tool.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm">{tool.name}</h3>
                              <Badge variant={statusCfg.variant} className="text-xs">
                                {statusCfg.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {tool.description}
                            </p>
                            <Button
                              size="sm"
                              variant={tool.status === 'needs_setup' ? 'outline' : 'default'}
                              disabled={isRunning || tool.status === 'needs_setup'}
                              onClick={() => handleRunTool(tool)}
                            >
                              {isRunning ? (
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <Play className="h-3 w-3 mr-1" />
                              )}
                              {tool.actionType === 'navigate' ? 'Open' : 'Run'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
