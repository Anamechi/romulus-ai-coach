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
                This prompt governs all AI-generated content. It defines the voice, structure, and E-E-A-T requirements for all content generation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="master-prompt">Prompt</Label>
                  <span className="text-xs text-muted-foreground">
                    {masterPrompt.length} characters
                  </span>
                </div>
                <Textarea
                  id="master-prompt"
                  value={masterPrompt}
                  onChange={(e) => setMasterPrompt(e.target.value)}
                  placeholder="Enter the master prompt that will govern all AI content generation..."
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                <strong>Tip:</strong> Include instructions for voice/tone, content structure, E-E-A-T signals, SEO requirements, and funnel-stage considerations.
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
