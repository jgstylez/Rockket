"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  Save,
  Users,
  Building,
  Settings as SettingsIcon,
} from "lucide-react";

interface TenantSettings {
  branding: {
    logo?: string;
    favicon?: string;
    primaryColor: string;
    secondaryColor: string;
    customCss?: string;
  };
  features: {
    aiGenerator: boolean;
    visualBuilder: boolean;
    cms: boolean;
    ecommerce: boolean;
    analytics: boolean;
    billing: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export default function SettingsPage() {
  const { user, tenant } = useAuth();
  const [settings, setSettings] = useState<TenantSettings>({
    branding: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
    },
    features: {
      aiGenerator: true,
      visualBuilder: false,
      cms: false,
      ecommerce: false,
      analytics: true,
      billing: false,
    },
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (tenant?.settings) {
      try {
        const parsedSettings = JSON.parse(tenant.settings);
        setSettings((prev) => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error("Failed to parse tenant settings:", error);
      }
    }
  }, [tenant]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/tenants", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings,
        }),
      });

      if (response.ok) {
        // Show success message
        console.log("Settings saved successfully");
      } else {
        console.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">Rockket</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Organization Settings</h1>
            <p className="text-muted-foreground">
              Manage your {tenant.name} organization settings and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-primary/10 text-primary">
                  <Building className="h-5 w-5" />
                  <span className="font-medium">Organization</span>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                  <Users className="h-5 w-5" />
                  <span>Team Members</span>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                  <SettingsIcon className="h-5 w-5" />
                  <span>Preferences</span>
                </div>
              </nav>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Organization Info */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Organization Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      value={tenant.name}
                      className="input-field"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="form-label">Organization Slug</label>
                    <input
                      type="text"
                      value={tenant.slug}
                      className="input-field"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="form-label">Current Plan</label>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {tenant.plan}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Branding Settings */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Branding</h2>
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Primary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.branding.primaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              primaryColor: e.target.value,
                            },
                          }))
                        }
                        className="w-12 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={settings.branding.primaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              primaryColor: e.target.value,
                            },
                          }))
                        }
                        className="input-field flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Secondary Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.branding.secondaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              secondaryColor: e.target.value,
                            },
                          }))
                        }
                        className="w-12 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={settings.branding.secondaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              secondaryColor: e.target.value,
                            },
                          }))
                        }
                        className="input-field flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Settings */}
              <div className="bg-card rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Feature Settings</h2>
                <div className="space-y-4">
                  {Object.entries(settings.features).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Enable or disable this feature for your organization
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              features: {
                                ...prev.features,
                                [key]: e.target.checked,
                              },
                            }))
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
