
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/PreferencesContext";
import Header from "@/components/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Keyboard, 
  Eye, 
  Volume2, 
  Clock, 
  ArrowLeft 
} from "lucide-react";

const Settings = () => {
  const { user, loading } = useAuth();
  const { 
    preferences, 
    isLoading: prefsLoading, 
    updatePreferences,
    resetPreferences
  } = usePreferences();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || prefsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Header 
          selectedLanguage="javascript" 
          onLanguageChange={() => {}} 
        />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <Card className="my-8">
              <CardHeader>
                <CardTitle>Loading Settings...</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        selectedLanguage="javascript" 
        onLanguageChange={() => {}} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              <h1 className="text-3xl font-bold">Settings</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how KeyTap Quest looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="theme">Theme</Label>
                      <Select 
                        value={preferences.theme} 
                        onValueChange={(value) => 
                          updatePreferences({ theme: value as 'light' | 'dark' | 'system' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="fontSize">Font Size</Label>
                      <Select 
                        value={preferences.fontSize} 
                        onValueChange={(value) => 
                          updatePreferences({ fontSize: value as 'small' | 'medium' | 'large' })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <Label htmlFor="showLineNumbers">Show Line Numbers</Label>
                      </div>
                      <Switch 
                        id="showLineNumbers" 
                        checked={preferences.showLineNumbers}
                        onCheckedChange={(checked) => 
                          updatePreferences({ showLineNumbers: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="practice">
              <Card>
                <CardHeader>
                  <CardTitle>Practice Settings</CardTitle>
                  <CardDescription>
                    Customize your typing practice experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        <Label htmlFor="keyboardSounds">Keyboard Sounds</Label>
                      </div>
                      <Switch 
                        id="keyboardSounds" 
                        checked={preferences.keyboardSounds}
                        onCheckedChange={(checked) => 
                          updatePreferences({ keyboardSounds: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="testDuration">Default Test Duration</Label>
                      <Select 
                        value={preferences.testDuration.toString()} 
                        onValueChange={(value) => 
                          updatePreferences({ testDuration: parseInt(value) as 15 | 30 | 60 | 120 | 300 })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="120">2 minutes</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Keyboard className="h-4 w-4" />
                        <Label htmlFor="autoComplete">Auto-Complete</Label>
                      </div>
                      <Switch 
                        id="autoComplete" 
                        checked={preferences.autoComplete}
                        onCheckedChange={(checked) => 
                          updatePreferences({ autoComplete: checked })
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <Label htmlFor="includeComments">Include Comments</Label>
                      </div>
                      <Switch 
                        id="includeComments" 
                        checked={preferences.includeComments}
                        onCheckedChange={(checked) => 
                          updatePreferences({ includeComments: checked })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account and reset preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <p className="text-muted-foreground">
                      Signed in as: {user?.email}
                    </p>
                    
                    <div className="flex flex-col gap-4 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={resetPreferences}
                      >
                        Reset Preferences to Default
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/dashboard")}
                      >
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>KeyTap Quest - Improve your coding speed and accuracy</p>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
