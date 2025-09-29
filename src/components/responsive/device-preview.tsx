"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Maximize2,
  Minimize2,
  RefreshCw,
  Eye,
  Settings,
  Zap,
} from "lucide-react";

interface DevicePreviewProps {
  url?: string;
  onDeviceChange?: (device: string) => void;
  onRefresh?: () => void;
}

export function DevicePreview({
  url,
  onDeviceChange,
  onRefresh,
}: DevicePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState("desktop");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const devices = [
    {
      id: "mobile",
      name: "Mobile",
      icon: <Smartphone className="h-4 w-4" />,
      width: "375px",
      height: "667px",
      description: "iPhone 12 Pro",
    },
    {
      id: "tablet",
      name: "Tablet",
      icon: <Tablet className="h-4 w-4" />,
      width: "768px",
      height: "1024px",
      description: "iPad",
    },
    {
      id: "desktop",
      name: "Desktop",
      icon: <Monitor className="h-4 w-4" />,
      width: "1200px",
      height: "800px",
      description: "Desktop",
    },
  ];

  const currentDevice =
    devices.find((d) => d.id === selectedDevice) || devices[2];

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    onDeviceChange?.(deviceId);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    onRefresh?.();
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div
      className={`${isExpanded ? "fixed inset-0 z-50 bg-background" : "relative"}`}
    >
      {/* Device Selector */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">Live Preview</h3>
          <Badge variant="outline" className="text-xs">
            {currentDevice.description}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Buttons */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {devices.map((device) => (
              <Button
                key={device.id}
                variant={selectedDevice === device.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleDeviceChange(device.id)}
                className="h-8 w-8 p-0"
              >
                {device.icon}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div
        className={`${isExpanded ? "h-full" : "h-96"} flex items-center justify-center p-4`}
      >
        <div className="relative">
          {/* Device Frame */}
          <div
            className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              width: isExpanded ? currentDevice.width : "min(100%, 400px)",
              height: isExpanded ? currentDevice.height : "min(100%, 300px)",
              maxWidth: isExpanded ? "none" : "400px",
              maxHeight: isExpanded ? "none" : "300px",
            }}
          >
            {/* Device Header */}
            <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-white text-xs font-mono">
                {currentDevice.name}
              </div>
              <div className="w-16"></div>
            </div>

            {/* Content Area */}
            <div className="bg-white h-full relative overflow-hidden">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">
                      Loading preview...
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={url || "/preview"}
                  className="w-full h-full border-0"
                  title="Live Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              )}
            </div>
          </div>

          {/* Device Info Overlay */}
          <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
            {currentDevice.width} × {currentDevice.height}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-4 border-t bg-muted/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Full Site
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Device Settings
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>Changes sync instantly</span>
        </div>
      </div>
    </div>
  );
}
