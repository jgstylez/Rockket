"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  isActive: boolean;
  createdAt: string;
  author: {
    name: string;
  };
}

interface EmailSequence {
  id: string;
  name: string;
  description?: string;
  trigger: string;
  isActive: boolean;
  createdAt: string;
  author: {
    name: string;
  };
  steps: Array<{
    id: string;
    stepOrder: number;
    delayDays: number;
    delayHours: number;
    template: {
      name: string;
      subject: string;
    };
  }>;
}

interface EmailCampaign {
  id: string;
  name: string;
  type: string;
  status: string;
  subject: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  author: {
    name: string;
  };
  _count: {
    deliveries: number;
  };
}

interface EmailSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: string;
  tags: string[];
  subscribedAt: string;
  user?: {
    name: string;
  };
}

export default function EmailMarketingPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("templates");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [templatesRes, sequencesRes, campaignsRes, subscribersRes] =
        await Promise.all([
          fetch("/api/email/templates?tenantId=demo-tenant"),
          fetch("/api/email/sequences?tenantId=demo-tenant"),
          fetch("/api/email/campaigns?tenantId=demo-tenant"),
          fetch("/api/email/subscribers?tenantId=demo-tenant"),
        ]);

      const templatesData = await templatesRes.json();
      const sequencesData = await sequencesRes.json();
      const campaignsData = await campaignsRes.json();
      const subscribersData = await subscribersRes.json();

      setTemplates(templatesData.templates || []);
      setSequences(sequencesData.sequences || []);
      setCampaigns(campaignsData.campaigns || []);
      setSubscribers(subscribersData.subscribers || []);
    } catch (error) {
      console.error("Failed to load email marketing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "sending":
        return "bg-purple-100 text-purple-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "sent":
        return <CheckCircle className="h-4 w-4" />;
      case "draft":
        return <Edit className="h-4 w-4" />;
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "sending":
        return <Send className="h-4 w-4" />;
      case "paused":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const stats = {
    totalTemplates: templates.length,
    totalSequences: sequences.length,
    totalCampaigns: campaigns.length,
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter((s) => s.status === "active").length,
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Email Marketing</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 border-b border-gray-200">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading...</p>
            </div>
          ) : activeTab === "templates" ? (
            <div className="space-y-2">
              {templates.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No templates found</p>
                </div>
              ) : (
                templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-gray-300"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.subject}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(template.isActive ? "active" : "draft")}`}
                            >
                              {template.isActive ? "Active" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className="cursor-pointer hover:border-gray-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {campaign.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {campaign.subject}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </span>
                          <span className="ml-2">
                            {campaign._count.deliveries} recipients
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Stats */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                Email Marketing Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage your email templates, campaigns, and subscribers
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalTemplates}
                </div>
                <div className="text-xs text-gray-500">Templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalCampaigns}
                </div>
                <div className="text-xs text-gray-500">Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.activeSubscribers}
                </div>
                <div className="text-xs text-gray-500">Active Subscribers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalSubscribers}
                </div>
                <div className="text-xs text-gray-500">Total Subscribers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="sequences">Sequences</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Email Templates
                    </CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.totalTemplates}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active email templates
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Campaigns
                    </CardTitle>
                    <Send className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {
                        campaigns.filter(
                          (c) =>
                            c.status === "sending" || c.status === "scheduled"
                        ).length
                      }
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently running campaigns
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscriber Growth
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.activeSubscribers}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Active subscribers
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Templates</h3>
                <p className="text-gray-500 mb-4">
                  Create and manage your email templates
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="sequences" className="mt-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Sequences</h3>
                <p className="text-gray-500 mb-4">
                  Set up automated email sequences
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Sequence
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subscribers" className="mt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Subscribers</h3>
                <p className="text-gray-500 mb-4">
                  Manage your email subscribers
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subscriber
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
