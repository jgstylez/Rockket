"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Search,
  Check,
  ArrowRight,
  Zap,
  Settings,
  Users,
  FileText,
  Code,
  Palette,
  Database,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload,
  Share,
  Copy,
  ExternalLink,
  Command,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommand?: (command: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onCommand,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: "new-project",
      title: "New Project",
      description: "Create a new project",
      icon: <Plus className="h-4 w-4" />,
      category: "Project",
      shortcut: "⌘N",
      action: () => onCommand?.("new-project"),
    },
    {
      id: "open-project",
      title: "Open Project",
      description: "Open an existing project",
      icon: <FileText className="h-4 w-4" />,
      category: "Project",
      shortcut: "⌘O",
      action: () => onCommand?.("open-project"),
    },
    {
      id: "save-project",
      title: "Save Project",
      description: "Save current project",
      icon: <Download className="h-4 w-4" />,
      category: "Project",
      shortcut: "⌘S",
      action: () => onCommand?.("save-project"),
    },
    {
      id: "deploy",
      title: "Deploy",
      description: "Deploy your project to production",
      icon: <Globe className="h-4 w-4" />,
      category: "Deploy",
      shortcut: "⌘D",
      action: () => onCommand?.("deploy"),
    },
    {
      id: "preview",
      title: "Preview",
      description: "Preview your project",
      icon: <Eye className="h-4 w-4" />,
      category: "View",
      shortcut: "⌘P",
      action: () => onCommand?.("preview"),
    },
    {
      id: "edit-code",
      title: "Edit Code",
      description: "Open code editor",
      icon: <Code className="h-4 w-4" />,
      category: "Edit",
      shortcut: "⌘E",
      action: () => onCommand?.("edit-code"),
    },
    {
      id: "visual-builder",
      title: "Visual Builder",
      description: "Open visual builder",
      icon: <Palette className="h-4 w-4" />,
      category: "Edit",
      shortcut: "⌘V",
      action: () => onCommand?.("visual-builder"),
    },
    {
      id: "ai-generator",
      title: "AI Generator",
      description: "Generate with AI",
      icon: <Zap className="h-4 w-4" />,
      category: "AI",
      shortcut: "⌘G",
      action: () => onCommand?.("ai-generator"),
    },
    {
      id: "analytics",
      title: "Analytics",
      description: "View analytics dashboard",
      icon: <Database className="h-4 w-4" />,
      category: "Analytics",
      shortcut: "⌘A",
      action: () => onCommand?.("analytics"),
    },
    {
      id: "settings",
      title: "Settings",
      description: "Open project settings",
      icon: <Settings className="h-4 w-4" />,
      category: "Settings",
      shortcut: "⌘,",
      action: () => onCommand?.("settings"),
    },
    {
      id: "team",
      title: "Team",
      description: "Manage team members",
      icon: <Users className="h-4 w-4" />,
      category: "Team",
      shortcut: "⌘T",
      action: () => onCommand?.("team"),
    },
    {
      id: "help",
      title: "Help",
      description: "Get help and documentation",
      icon: <FileText className="h-4 w-4" />,
      category: "Help",
      shortcut: "⌘?",
      action: () => onCommand?.("help"),
    },
  ];

  const filteredCommands = commands.filter(
    (command) =>
      command.title.toLowerCase().includes(query.toLowerCase()) ||
      command.description.toLowerCase().includes(query.toLowerCase()) ||
      command.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        Math.min(prev + 1, filteredCommands.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onOpenChange(false);
      }
    } else if (e.key === "Escape") {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Command className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Command Palette</h2>
            <Badge variant="outline" className="ml-auto">
              ⌘K
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search commands, features, or actions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No commands found</p>
                <p className="text-sm">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredCommands.map((command, index) => (
                  <div
                    key={command.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      command.action();
                      onOpenChange(false);
                    }}
                  >
                    <div className="flex-shrink-0">{command.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{command.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {command.category}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-70">
                        {command.description}
                      </p>
                    </div>
                    {command.shortcut && (
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {command.shortcut}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
            <div>
              {filteredCommands.length} command
              {filteredCommands.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
