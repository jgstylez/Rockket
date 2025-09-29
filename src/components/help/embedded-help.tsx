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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Share,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock,
  User,
  Tag,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Award,
  Bookmark,
  History,
  Settings,
  Bell,
  Mail,
  Phone,
  Globe,
  FileText,
  Code,
  Palette,
  Database,
  Shield,
  Zap as ZapIcon,
} from "lucide-react";

interface HelpItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "article" | "tutorial" | "faq";
  duration?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  rating: number;
  views: number;
  isBookmarked: boolean;
  isCompleted: boolean;
}

interface EmbeddedHelpProps {
  onSearch?: (query: string) => void;
  onItemSelected?: (item: HelpItem) => void;
}

export function EmbeddedHelp({ onSearch, onItemSelected }: EmbeddedHelpProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("tutorials");
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const helpItems: HelpItem[] = [
    {
      id: "1",
      title: "Getting Started with Rockket",
      description:
        "Learn the basics of building your first app with Rockket's intuitive interface",
      type: "tutorial",
      duration: "5 min",
      difficulty: "beginner",
      tags: ["getting-started", "basics", "tutorial"],
      rating: 4.8,
      views: 1250,
      isBookmarked: true,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Building Your First E-commerce Store",
      description: "Step-by-step guide to creating a complete online store",
      type: "video",
      duration: "15 min",
      difficulty: "intermediate",
      tags: ["e-commerce", "store", "payments"],
      rating: 4.9,
      views: 890,
      isBookmarked: false,
      isCompleted: true,
    },
    {
      id: "3",
      title: "Customizing Your Site's Design",
      description:
        "Learn how to personalize your site's appearance and branding",
      type: "article",
      duration: "8 min",
      difficulty: "beginner",
      tags: ["design", "customization", "branding"],
      rating: 4.6,
      views: 2100,
      isBookmarked: true,
      isCompleted: false,
    },
    {
      id: "4",
      title: "Advanced API Integration",
      description: "Connect your app with external services and APIs",
      type: "video",
      duration: "25 min",
      difficulty: "advanced",
      tags: ["api", "integration", "advanced"],
      rating: 4.7,
      views: 450,
      isBookmarked: false,
      isCompleted: false,
    },
    {
      id: "5",
      title: "Troubleshooting Common Issues",
      description: "Solutions to the most frequently encountered problems",
      type: "faq",
      duration: "12 min",
      difficulty: "beginner",
      tags: ["troubleshooting", "help", "issues"],
      rating: 4.5,
      views: 3200,
      isBookmarked: true,
      isCompleted: false,
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleItemSelect = (item: HelpItem) => {
    setSelectedItem(item);
    onItemSelected?.(item);
  };

  const handleBookmark = (itemId: string) => {
    // Toggle bookmark
  };

  const handleRate = (itemId: string, rating: number) => {
    // Rate item
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "tutorial":
        return <BookOpen className="h-4 w-4" />;
      case "faq":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help & Learning Center
          </CardTitle>
          <CardDescription>
            Find answers, learn new skills, and get the most out of Rockket
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search help articles, tutorials, and FAQs..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-muted-foreground">Tutorials</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-xs text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">156</div>
            <div className="text-xs text-muted-foreground">Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <HelpCircle className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">89</div>
            <div className="text-xs text-muted-foreground">FAQs</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Tutorials */}
        <TabsContent value="tutorials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpItems
              .filter((item) => item.type === "tutorial")
              .map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge
                            className={getDifficultyColor(item.difficulty)}
                          >
                            {item.difficulty}
                          </Badge>
                          {item.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}
                          {item.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpItems
              .filter((item) => item.type === "video")
              .map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge
                            className={getDifficultyColor(item.difficulty)}
                          >
                            {item.difficulty}
                          </Badge>
                          {item.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}
                          {item.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* Articles */}
        <TabsContent value="articles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpItems
              .filter((item) => item.type === "article")
              .map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge
                            className={getDifficultyColor(item.difficulty)}
                          >
                            {item.difficulty}
                          </Badge>
                          {item.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}
                          {item.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpItems
              .filter((item) => item.type === "faq")
              .map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{item.title}</h4>
                          <Badge
                            className={getDifficultyColor(item.difficulty)}
                          >
                            {item.difficulty}
                          </Badge>
                          {item.isBookmarked && (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          )}
                          {item.isCompleted && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            {item.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.views}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Item Detail */}
      {selectedItem && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTypeIcon(selectedItem.type)}
              {selectedItem.title}
            </CardTitle>
            <CardDescription>{selectedItem.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Badge className={getDifficultyColor(selectedItem.difficulty)}>
                {selectedItem.difficulty}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {selectedItem.duration}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                {selectedItem.rating}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {selectedItem.views} views
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button>
                <Play className="h-4 w-4 mr-2" />
                Start Learning
              </Button>
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Bookmark
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            Need More Help?
          </CardTitle>
          <CardDescription>
            Our support team is here to help you succeed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Live Chat</div>
                <div className="text-xs text-muted-foreground">
                  Get instant help
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Mail className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Email Support</div>
                <div className="text-xs text-muted-foreground">
                  24/7 response
                </div>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Phone className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="font-medium">Phone Support</div>
                <div className="text-xs text-muted-foreground">
                  Business hours
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
