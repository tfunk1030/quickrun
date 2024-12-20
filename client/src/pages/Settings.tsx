import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/useToast';
import { updateSettings } from '@/api/settings';

export function Settings() {
  const [autoRunAfterBuild, setAutoRunAfterBuild] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();

  console.log("Rendering Settings component");

  const handleToggleChange = (setting: 'autoRunAfterBuild' | 'darkMode') => {
    console.log(`Toggle changed for ${setting}`);
    if (setting === 'autoRunAfterBuild') {
      const newValue = !autoRunAfterBuild;
      console.log(`autoRunAfterBuild changing to: ${newValue}`);
      setAutoRunAfterBuild(newValue);
    } else if (setting === 'darkMode') {
      const newValue = !darkMode;
      console.log(`darkMode changing to: ${newValue}`);
      setDarkMode(newValue);
    }
  };

  useEffect(() => {
    console.log('Current state:', { autoRunAfterBuild, darkMode });
  }, [autoRunAfterBuild, darkMode]);

  const handleSave = async () => {
    console.log("Save button clicked");
    try {
      const response = await updateSettings({ autoRunAfterBuild, darkMode });
      console.log("API response:", response);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
      console.log("Settings saved successfully");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error saving settings",
        description: error.toString(),
        status: "error"
      });
    }
  };

  console.log("Rendering Settings UI");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your QuickRun preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="flex items-center justify-between"
            onClick={() => console.log('Switch container clicked')}
          >
            <div className="space-y-1">
              <Label>Auto-run after build</Label>
              <p className="text-sm text-muted-foreground">
                Automatically run repositories after successful builds
              </p>
            </div>
            <Switch
              checked={autoRunAfterBuild}
              onCheckedChange={() => handleToggleChange('autoRunAfterBuild')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark mode</Label>
              <p className="text-sm text-muted-foreground">
                Use dark mode for the interface
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={() => handleToggleChange('darkMode')}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}