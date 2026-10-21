
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function Settings() {

  // In a real app, you would use a theme provider context here.
  const handleThemeChange = (isDarkMode: boolean) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This information is managed by SAI and cannot be edited here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
            <Label>Athlete ID</Label>
            <p className="text-muted-foreground">98765</p>
          </div>
           <div className="space-y-2">
            <Label>Name</Label>
            <p className="text-muted-foreground">Athlete 123</p>
          </div>
           <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-muted-foreground">athlete.123@sai.gov.in</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize the look and feel of your application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable a darker color scheme for the interface.
              </span>
            </Label>
            <Switch id="dark-mode" onCheckedChange={handleThemeChange} />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="language" className="flex flex-col space-y-1">
              <span>Language</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Choose your preferred language for the application.
              </span>
            </Label>
             <Select defaultValue="en">
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage how you receive notifications. (Coming soon)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive notifications about your plan and progress via email.
              </span>
            </Label>
            <Switch id="email-notifications" disabled />
          </div>
           <div className="flex items-center justify-between p-4 border rounded-lg opacity-50">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time alerts on your device.
              </span>
            </Label>
            <Switch id="push-notifications" disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
