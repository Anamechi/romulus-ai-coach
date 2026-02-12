import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Settings as SettingsIcon, Flag } from 'lucide-react';
import { useContentSettings, useUpdateContentSettings } from '@/hooks/useContentSettings';

interface FeatureFlags {
  chatbot_enabled?: boolean;
  ai_content_generation?: boolean;
  citation_health_checks?: boolean;
  internal_linking_engine?: boolean;
}

export default function Settings() {
  const { data: settings, isLoading } = useContentSettings();
  const updateSettings = useUpdateContentSettings();
  
  const [masterPrompt, setMasterPrompt] = useState('');
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    chatbot_enabled: true,
    ai_content_generation: true,
    citation_health_checks: true,
    internal_linking_engine: true,
  });

  useEffect(() => {
    if (settings) {
      setMasterPrompt(settings.master_content_prompt || '');
      setSiteName(settings.site_name || '');
      setTagline(settings.tagline || '');
      if (settings.feature_flags) {
        setFeatureFlags({
          chatbot_enabled: (settings.feature_flags as FeatureFlags).chatbot_enabled ?? true,
          ai_content_generation: (settings.feature_flags as FeatureFlags).ai_content_generation ?? true,
          citation_health_checks: (settings.feature_flags as FeatureFlags).citation_health_checks ?? true,
          internal_linking_engine: (settings.feature_flags as FeatureFlags).internal_linking_engine ?? true,
        });
      }
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({
      master_content_prompt: masterPrompt,
      site_name: siteName,
      tagline: tagline,
      feature_flags: featureFlags as Record<string, boolean>,
    });
  };

  const toggleFlag = (flag: keyof FeatureFlags) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: !prev[flag],
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage site-wide settings and AI configuration</p>
        </div>

        <div className="grid gap-6">
          {/* Site Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Site Settings
              </CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input
                  id="site-name"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Dr. Romulus MBA"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Business Coaching & Automation Authority"
                />
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Feature Flags
              </CardTitle>
              <CardDescription>Enable or disable features across the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="chatbot">Chatbot Widget</Label>
                  <p className="text-sm text-muted-foreground">Show AI chatbot on public pages</p>
                </div>
                <Switch
                  id="chatbot"
                  checked={featureFlags.chatbot_enabled}
                  onCheckedChange={() => toggleFlag('chatbot_enabled')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-gen">AI Content Generation</Label>
                  <p className="text-sm text-muted-foreground">Enable cluster generator for AI-powered content</p>
                </div>
                <Switch
                  id="ai-gen"
                  checked={featureFlags.ai_content_generation}
                  onCheckedChange={() => toggleFlag('ai_content_generation')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="citation-health">Citation Health Checks</Label>
                  <p className="text-sm text-muted-foreground">Run periodic link validation on citations</p>
                </div>
                <Switch
                  id="citation-health"
                  checked={featureFlags.citation_health_checks}
                  onCheckedChange={() => toggleFlag('citation_health_checks')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="linking-engine">Internal Linking Engine</Label>
                  <p className="text-sm text-muted-foreground">AI-powered internal link suggestions</p>
                </div>
                <Switch
                  id="linking-engine"
                  checked={featureFlags.internal_linking_engine}
                  onCheckedChange={() => toggleFlag('internal_linking_engine')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Master Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>Master Content Prompt</CardTitle>
              <CardDescription>
                This prompt governs ALL AI-generated content — clusters, QAs, translations, and citations. It defines voice, structure, EEAT, SEO/AEO rules, and anti-hallucination logic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="master-prompt">Full Master Prompt</Label>
                  <span className="text-xs text-muted-foreground">
                    {masterPrompt.length} characters
                  </span>
                </div>
                <Textarea
                  id="master-prompt"
                  value={masterPrompt}
                  onChange={(e) => setMasterPrompt(e.target.value)}
                  placeholder="Enter the master prompt that will govern all AI content generation..."
                  className="min-h-[400px] font-mono text-sm"
                />
              </div>
              
              {/* Required Sections Checklist */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="font-semibold text-sm">Required Sections Checklist:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {[
                    { key: 'brand voice', label: 'Brand Voice & Tone' },
                    { key: 'target audience', label: 'Target Audience Rules' },
                    { key: 'mission', label: 'Mission Statement' },
                    { key: 'E-E-A-T', label: 'EEAT Authority Block' },
                    { key: 'speakable', label: 'Speakable Summary Rules (40-60 words)' },
                    { key: 'FAQ', label: 'FAQ Rules (80-120 words)' },
                    { key: 'markdown', label: 'Markdown Formatting Enforcement' },
                    { key: 'JSON-LD', label: 'JSON-LD Schema Requirement' },
                    { key: 'canonical', label: 'Canonical URL Rules' },
                    { key: 'hreflang', label: 'Hreflang Rules' },
                    { key: 'spell', label: 'Spell-Check Enforcement' },
                    { key: 'professional', label: 'Professional Language Enforcement' },
                    { key: 'hallucination', label: 'Anti-Hallucination Logic' },
                  ].map(({ key, label }) => {
                    const isPresent = masterPrompt.toLowerCase().includes(key.toLowerCase());
                    return (
                      <div key={key} className={`flex items-center gap-2 ${isPresent ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {isPresent ? '✓' : '○'} {label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm">
                <strong>💡 Template:</strong> If starting from scratch, include sections for: Brand Voice, Target Audience, Mission Statement, EEAT Authority Block, Speakable Rules (40-60 words), FAQ Rules (80-120 words), Markdown formatting, JSON-LD schema requirements, Canonical URL rules, Hreflang rules, Spell-check enforcement, Professional tone enforcement, and Anti-hallucination logic (no fabricated stats, no income guarantees, no legal/tax advice).
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={updateSettings.isPending}
              className="min-w-[120px]"
            >
              {updateSettings.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
