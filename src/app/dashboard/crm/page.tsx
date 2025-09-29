"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmartSidebar } from "@/components/layout/smart-sidebar";
import { AICopilot, useAICopilot } from "@/components/ui/ai-copilot";
import {
  Users,
  DollarSign,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  Plus,
  Search,
  Filter,
  Target,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Sparkles,
  Brain,
  UserPlus,
  Building,
  MessageSquare
} from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: "lead" | "prospect" | "customer" | "churned";
  value: number;
  lastContact: Date;
  source: string;
}

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: Date;
  contact: string;
}

export default function CRMDashboard() {
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "expert">("beginner");
  const [activeTab, setActiveTab] = useState("overview");
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@techcorp.com",
      company: "TechCorp",
      status: "prospect",
      value: 5000,
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      source: "Website"
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@startup.io",
      company: "StartupIO",
      status: "customer",
      value: 12000,
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      source: "Referral"
    }
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      title: "Enterprise License",
      value: 25000,
      stage: "Negotiation",
      probability: 75,
      closeDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      contact: "Sarah Johnson"
    },
    {
      id: "2",
      title: "Team Subscription",
      value: 5000,
      stage: "Proposal",
      probability: 60,
      closeDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      contact: "Mike Chen"
    }
  ]);

  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "opportunity",
      title: "High-Value Lead in Pipeline",
      description: "Sarah Johnson from TechCorp is ready to close a $25K deal",
      impact: "high",
      suggestion: "Schedule a call this week to finalize the contract"
    },
    {
      id: "2",
      type: "success",
      title: "Customer Retention Strong",
      description: "95% of customers are still active after 6 months",
      impact: "positive",
      suggestion: "Continue current support strategy"
    },
    {
      id: "3",
      type: "warning",
      title: "Follow-up Overdue",
      description: "3 prospects haven't been contacted in over a week",
      impact: "medium",
      suggestion: "Reach out today to maintain engagement"
    }
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for CRM
    const crmSuggestions = [
      {
        type: "proactive" as const,
        title: "Set up Email Sequences",
        description: "Automate follow-ups with new leads using email sequences.",
        action: "Set up automation",
        priority: "high" as const,
        category: "automation"
      },
      {
        type: "educational" as const,
        title: "Learn Sales Psychology",
        description: "Understand buyer behavior to improve your conversion rates.",
        action: "Start learning",
        priority: "medium" as const,
        category: "sales"
      }
    ];

    crmSuggestions.forEach(suggestion => {
      setTimeout(() => addSuggestion(suggestion), 2000);
    });
  }, [addSuggestion]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lead":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "prospect":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "customer":
        return "bg-green-100 text-green-800 border-green-200";
      case "churned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Lead":
        return "bg-blue-100 text-blue-800";
      case "Qualified":
        return "bg-yellow-100 text-yellow-800";
      case "Proposal":
        return "bg-orange-100 text-orange-800";
      case "Negotiation":
        return "bg-purple-100 text-purple-800";
      case "Closed Won":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPipeline = deals.reduce((sum, deal) => sum + deal.value, 0);
  const openDeals = deals.filter(deal => deal.stage !== "Closed Won").length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar 
        userLevel={userLevel}
        activeProject="CRM Dashboard"
        className="w-80"
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  CRM Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage relationships and grow your business
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{contacts.length}</div>
                  <div className="text-xs text-muted-foreground">Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{openDeals}</div>
                  <div className="text-xs text-muted-foreground">Open Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">${totalPipeline.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Pipeline</div>
                </div>
              </div>

              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights - Mental Model Organization */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Sales Intelligence
              </CardTitle>
              <CardDescription>
                I've analyzed your pipeline and found key opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${
                      insight.type === "success" 
                        ? "bg-green-50 border-green-200" 
                        : insight.type === "warning"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {insight.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {insight.type === "opportunity" && <Target className="h-4 w-4 text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        <p className="text-xs font-medium text-primary">
                          💡 {insight.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics - Mental Model: "Making Money" */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Total Contacts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{contacts.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2</span> this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Pipeline Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  ${totalPipeline.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+15%</span> this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Win Rate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">68%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+5%</span> this quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Avg. Deal Size
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">$15,000</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation Tabs - Mental Model Organization */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Contacts */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-primary" />
                        Recent Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {contacts.slice(0, 3).map((contact) => (
                          <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                  {contact.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{contact.name}</p>
                                <p className="text-xs text-muted-foreground">{contact.company}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(contact.status)}>
                              {contact.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pipeline Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Pipeline Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {deals.map((deal) => (
                          <div key={deal.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium">{deal.title}</p>
                                <p className="text-xs text-muted-foreground">{deal.contact}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold">${deal.value.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{deal.probability}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={deal.probability} className="flex-1 h-2" />
                              <Badge className={getStageColor(deal.stage)}>
                                {deal.stage}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{contact.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{contact.company}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{contact.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(contact.status)}>
                              {contact.status}
                            </Badge>
                            <span className="text-sm font-semibold">${contact.value.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last contact: {contact.lastContact.toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="deals" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search deals..."
                        className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Deal
                  </Button>
                </div>

                <div className="space-y-4">
                  {deals.map((deal) => (
                    <Card key={deal.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{deal.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{deal.contact}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Value: ${deal.value.toLocaleString()}</span>
                              <span>Close: {deal.closeDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold">${deal.value.toLocaleString()}</div>
                              <div className="text-sm text-muted-foreground">{deal.probability}% probability</div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStageColor(deal.stage)}>
                                {deal.stage}
                              </Badge>
                              <Progress value={deal.probability} className="w-24 h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Start tracking your sales activities to get insights
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Log Activity
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot
        suggestions={suggestions}
        onSuggestionClick={(suggestion) => {
          console.log("CRM suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}