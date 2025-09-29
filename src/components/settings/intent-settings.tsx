"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Globe,
  Users,
  CreditCard,
  Shield,
  Zap,
  Eye,
  Lock,
  Bell,
  Palette,
  Database,
  Code,
  Webhook,
  Key,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  X,
} from "lucide-react";

interface IntentSettingsProps {
  onSave?: (settings: any) => void;
  onReset?: () => void;
}

export function IntentSettings({ onSave, onReset }: IntentSettingsProps) {
  const [activeTab, setActiveTab] = useState("quick");
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Quick Settings
    domain: "myapp.rockket.com",
    siteName: "My Amazing App",
    siteDescription: "A beautiful, fast, and secure web application",
    logo: "",
    favicon: "",

    // Team & Access
    teamMembers: [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah@company.com",
        role: "owner",
      },
      {
        id: "2",
        name: "Mike Johnson",
        email: "mike@company.com",
        role: "editor",
      },
    ],
    allowInvites: true,
    requireApproval: false,

    // Billing & Plan
    plan: "pro",
    billingEmail: "billing@company.com",
    autoRenew: true,

    // Security
    twoFactor: false,
    ssl: true,
    backup: true,
    compliance: "gdpr",

    // Performance
    cdn: true,
    compression: true,
    caching: true,
    monitoring: true,

    // Advanced
    customCode: "",
    apiKeys: [],
    webhooks: [],
    featureFlags: [],
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setIsSaving(false);
      onSave?.(settings);
    }, 1000);
  };

  const handleReset = () => {
    onReset?.();
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Project Settings
          </CardTitle>
          <CardDescription>
            Configure your project settings organized by what you want to
            achieve
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">All changes saved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Live preview active</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quick">Quick Settings</TabsTrigger>
          <TabsTrigger value="team">Team & Access</TabsTrigger>
          <TabsTrigger value="billing">Billing & Plan</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Quick Settings */}
        <TabsContent value="quick" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Domain & Branding
              </CardTitle>
              <CardDescription>
                Set up your domain and customize your site's appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={settings.domain}
                    onChange={(e) => updateSetting("domain", e.target.value)}
                    placeholder="myapp.rockket.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting("siteName", e.target.value)}
                    placeholder="My Amazing App"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) =>
                    updateSetting("siteDescription", e.target.value)
                  }
                  placeholder="A beautiful, fast, and secure web application"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="favicon"
                      type="file"
                      accept="image/*"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize your site's look and feel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" className="flex-1">
                      Light
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Dark
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Auto
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded border-2 border-blue-600"></div>
                    <div className="w-8 h-8 bg-green-500 rounded border"></div>
                    <div className="w-8 h-8 bg-purple-500 rounded border"></div>
                    <div className="w-8 h-8 bg-orange-500 rounded border"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team & Access */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage who has access to your project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {settings.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {member.email}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {member.role}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Access Control
              </CardTitle>
              <CardDescription>
                Configure security and access settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowInvites">Allow Team Invites</Label>
                  <p className="text-xs text-muted-foreground">
                    Let team members invite others
                  </p>
                </div>
                <Switch
                  id="allowInvites"
                  checked={settings.allowInvites}
                  onCheckedChange={(checked) =>
                    updateSetting("allowInvites", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="requireApproval">Require Approval</Label>
                  <p className="text-xs text-muted-foreground">
                    New members need approval
                  </p>
                </div>
                <Switch
                  id="requireApproval"
                  checked={settings.requireApproval}
                  onCheckedChange={(checked) =>
                    updateSetting("requireApproval", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing & Plan */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Billing Information
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input
                    id="billingEmail"
                    value={settings.billingEmail}
                    onChange={(e) =>
                      updateSetting("billingEmail", e.target.value)
                    }
                    placeholder="billing@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Plan</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      Pro Plan
                    </Badge>
                    <Button size="sm" variant="outline">
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoRenew">Auto Renewal</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically renew your subscription
                  </p>
                </div>
                <Switch
                  id="autoRenew"
                  checked={settings.autoRenew}
                  onCheckedChange={(checked) =>
                    updateSetting("autoRenew", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security & Compliance
              </CardTitle>
              <CardDescription>
                Configure security settings and compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactor}
                  onCheckedChange={(checked) =>
                    updateSetting("twoFactor", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ssl">SSL Certificate</Label>
                  <p className="text-xs text-muted-foreground">
                    Secure your site with HTTPS
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="ssl"
                    checked={settings.ssl}
                    onCheckedChange={(checked) => updateSetting("ssl", checked)}
                  />
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Performance & Monitoring
              </CardTitle>
              <CardDescription>
                Optimize your site's performance and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="cdn">CDN</Label>
                  <p className="text-xs text-muted-foreground">
                    Content delivery network for faster loading
                  </p>
                </div>
                <Switch
                  id="cdn"
                  checked={settings.cdn}
                  onCheckedChange={(checked) => updateSetting("cdn", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monitoring">Performance Monitoring</Label>
                  <p className="text-xs text-muted-foreground">
                    Track your site's performance metrics
                  </p>
                </div>
                <Switch
                  id="monitoring"
                  checked={settings.monitoring}
                  onCheckedChange={(checked) =>
                    updateSetting("monitoring", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Custom Code & Integrations
              </CardTitle>
              <CardDescription>
                Add custom code and configure integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customCode">Custom CSS</Label>
                <Textarea
                  id="customCode"
                  value={settings.customCode}
                  onChange={(e) => updateSetting("customCode", e.target.value)}
                  placeholder="/* Add your custom CSS here */"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>API Keys</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input placeholder="API Key Name" className="flex-1" />
                    <Input placeholder="API Key Value" className="flex-1" />
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
