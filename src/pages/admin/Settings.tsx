import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Settings as SettingsIcon } from 'lucide-react';
import { useContentSettings, useUpdateContentSettings } from '@/hooks/useContentSettings';

export default function Settings() {
  const { data: settings, isLoading } = useContentSettings();
  const updateSettings = useUpdateContentSettings();
  
  const [masterPrompt, setMasterPrompt] = useState('');
  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');

  useEffect(() => {
    if (settings) {
      setMasterPrompt(settings.master_content_prompt || '');
      setSiteName(settings.site_name || '');
      setTagline(settings.tagline || '');
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate({
      master_content_prompt: masterPrompt,
      site_name: siteName,
      tagline: tagline,
    });
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
