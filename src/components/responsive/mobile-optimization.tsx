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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
  Zap,
  RotateCcw,
  Maximize,
  Minimize,
  ArrowRight,
  RefreshCw,
  Download,
  Upload,
  Share,
  Globe,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

interface MobileOptimizationProps {
  onOptimize?: (optimization: string) => void;
  onPreview?: (device: string) => void;
}

export function MobileOptimization({
  onOptimize,
  onPreview,
}: MobileOptimizationProps) {
  const [activeDevice, setActiveDevice] = useState("mobile");
  const [optimizations, setOptimizations] = useState({
    touchFriendly: true,
    fastLoading: true,
    responsiveImages: true,
    mobileNavigation: true,
    touchGestures: true,
    offlineSupport: false,
    pushNotifications: false,
    appLike: false,
  });

  const handleOptimization = (key: string, value: boolean) => {
    setOptimizations((prev) => ({ ...prev, [key]: value }));
    onOptimize?.(key);
  };

  const handlePreview = (device: string) => {
    setActiveDevice(device);
    onPreview?.(device);
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />;
      case "tablet":
        return <Tablet className="h-5 w-5" />;
      case "desktop":
        return <Monitor className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Device Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Live Device Preview
          </CardTitle>
          <CardDescription>
            See how your site looks on different devices in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant={activeDevice === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreview("mobile")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile
            </Button>
            <Button
              variant={activeDevice === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreview("tablet")}
            >
              <Tablet className="h-4 w-4 mr-2" />
              Tablet
            </Button>
            <Button
              variant={activeDevice === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePreview("desktop")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </Button>
          </div>

          <div className="bg-black rounded-lg p-4 text-center">
            <div className="text-white text-sm mb-2">Live Preview</div>
            <div className="text-xs text-gray-400">
              {activeDevice === "mobile" && "375x667 • iPhone 12"}
              {activeDevice === "tablet" && "768x1024 • iPad"}
              {activeDevice === "desktop" && "1920x1080 • Desktop"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Mobile Optimizations
          </CardTitle>
          <CardDescription>
            Optimize your site for mobile devices and touch interactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="touchFriendly">Touch-Friendly Interface</Label>
              <p className="text-xs text-muted-foreground">
                Larger buttons and touch targets
              </p>
            </div>
            <Switch
              id="touchFriendly"
              checked={optimizations.touchFriendly}
              onCheckedChange={(checked) =>
                handleOptimization("touchFriendly", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fastLoading">Fast Loading</Label>
              <p className="text-xs text-muted-foreground">
                Optimize for mobile networks
              </p>
            </div>
            <Switch
              id="fastLoading"
              checked={optimizations.fastLoading}
              onCheckedChange={(checked) =>
                handleOptimization("fastLoading", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="responsiveImages">Responsive Images</Label>
              <p className="text-xs text-muted-foreground">
                Auto-resize images for different screens
              </p>
            </div>
            <Switch
              id="responsiveImages"
              checked={optimizations.responsiveImages}
              onCheckedChange={(checked) =>
                handleOptimization("responsiveImages", checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="mobileNavigation">Mobile Navigation</Label>
              <p className="text-xs text-muted-foreground">
                Hamburger menu and mobile-friendly nav
              </p>
            </div>
            <Switch
              id="mobileNavigation"
              checked={optimizations.mobileNavigation}
              onCheckedChange={(checked) =>
                handleOptimization("mobileNavigation", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Mobile Performance
          </CardTitle>
          <CardDescription>
            Track your site's mobile performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">95</div>
              <div className="text-xs text-green-700">Mobile Score</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-xs text-blue-700">Load Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
