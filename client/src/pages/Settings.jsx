import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/useToast';
import { updateSettings } from '@/api/settings';

export function Settings() {
  const navigate = useNavigate();
  const [autoRunAfterBuild, setAutoRunAfterBuild] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleToggleChange = (setting) => {
    if (setting === 'autoRunAfterBuild') {
      setAutoRunAfterBuild(!autoRunAfterBuild);
    } else if (setting === 'darkMode') {
      setDarkMode(!darkMode);
    }
  };

  const handleSave = async () => {
    try {
      await updateSettings({ autoRunAfterBuild, darkMode });
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully."
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: error.toString(),
        status: "error"
      });
    }
  };

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
          <div className="flex items-center justify-between">
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