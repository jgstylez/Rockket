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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Sparkles,
  Brain,
  Plus,
  Download,
  Upload,
  Calculator,
  PieChart,
  BarChart3,
  Calendar,
  FileText,
  Receipt,
  CreditCard,
  Building,
  Filter
} from "lucide-react";

interface FinancialPlan {
  id: string;
  name: string;
  type: "budget" | "forecast" | "scenario";
  status: "active" | "draft" | "archived";
  revenue: number;
  expenses: number;
  profit: number;
  created: Date;
  updated: Date;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: Date;
  status: "pending" | "completed" | "cancelled";
}

export default function FinancialDashboard() {
  const [userLevel, setUserLevel] = useState<"beginner" | "intermediate" | "expert">("beginner");
  const [activeTab, setActiveTab] = useState("overview");
  const [plans, setPlans] = useState<FinancialPlan[]>([
    {
      id: "1",
      name: "Q4 2024 Budget",
      type: "budget",
      status: "active",
      revenue: 125000,
      expenses: 85000,
      profit: 40000,
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Growth Scenario",
      type: "scenario",
      status: "draft",
      revenue: 150000,
      expenses: 95000,
      profit: 55000,
      created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      description: "Monthly SaaS Revenue",
      amount: 25000,
      type: "income",
      category: "Revenue",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: "completed"
    },
    {
      id: "2",
      description: "Office Rent",
      amount: 5000,
      type: "expense",
      category: "Operations",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      status: "completed"
    },
    {
      id: "3",
      description: "Marketing Campaign",
      amount: 3000,
      type: "expense",
      category: "Marketing",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "pending"
    }
  ]);

  const [insights, setInsights] = useState([
    {
      id: "1",
      type: "success",
      title: "Revenue Target Achieved",
      description: "You've exceeded your monthly revenue target by 15%",
      impact: "positive",
      suggestion: "Consider increasing next month's target"
    },
    {
      id: "2",
      type: "warning",
      title: "Expense Alert",
      description: "Marketing expenses are 20% over budget this month",
      impact: "medium",
      suggestion: "Review marketing ROI and adjust spend"
    },
    {
      id: "3",
      type: "opportunity",
      title: "Cash Flow Optimization",
      description: "You have $15K in unused budget that could be invested",
      impact: "high",
      suggestion: "Consider investing in growth initiatives"
    }
  ]);

  const { suggestions, addSuggestion, removeSuggestion } = useAICopilot();

  useEffect(() => {
    // Simulate AI suggestions for financial planning
    const financialSuggestions = [
      {
        type: "proactive" as const,
        title: "Set up Automated Budget Tracking",
        description: "Connect your bank accounts for real-time financial monitoring.",
        action: "Connect accounts",
        priority: "high" as const,
        category: "automation"
      },
      {
        type: "educational" as const,
        title: "Learn about Cash Flow Management",
        description: "Master the fundamentals of business cash flow optimization.",
        action: "Start learning",
        priority: "medium" as const,
        category: "education"
      }
    ];

    financialSuggestions.forEach(suggestion => {
      setTimeout(() => addSuggestion(suggestion), 2500);
    });
  }, [addSuggestion]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalExpenses = plans.reduce((sum, plan) => sum + plan.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const activePlans = plans.filter(plan => plan.status === "active");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "budget":
        return "bg-blue-100 text-blue-800";
      case "forecast":
        return "bg-purple-100 text-purple-800";
      case "scenario":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Smart Sidebar */}
      <SmartSidebar 
        userLevel={userLevel}
        activeProject="Financial Planning"
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
                  <DollarSign className="h-6 w-6 text-primary" />
                  Financial Planning
                </h1>
                <p className="text-sm text-muted-foreground">
                  Plan, track, and optimize your business finances
          </p>
        </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
                  <div className="text-xs text-muted-foreground">Expenses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(netIncome)}</div>
                  <div className="text-xs text-muted-foreground">Net Income</div>
            </div>
            </div>

              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </Button>
            </div>
      </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* AI Insights - Intent-Based Navigation */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Financial Intelligence
                        </CardTitle>
                        <CardDescription>
                I've analyzed your finances and found key opportunities
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
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {insight.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {insight.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                        {insight.type === "opportunity" && <Target className="h-4 w-4 text-blue-600" />}
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

          {/* Key Metrics - Intent-Based: "Making Money" */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Total Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{formatCurrency(totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Total Expenses
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{formatCurrency(totalExpenses)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-red-600">+5%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Net Income
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{formatCurrency(netIncome)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+18%</span> from last month
                </p>
                  </CardContent>
                </Card>

              <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">
                  Active Plans
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{activePlans.length}</div>
                <p className="text-xs text-muted-foreground">
                  {plans.length} total plans
                </p>
                </CardContent>
              </Card>
          </div>

          {/* Navigation Tabs - Intent-Based Organization */}
          <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="plans">Plans</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue vs Expenses */}
                  <Card>
                  <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5 text-primary" />
                        Revenue vs Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Revenue</span>
                      </div>
                          <span className="font-semibold">{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm">Expenses</span>
                          </div>
                          <span className="font-semibold">{formatCurrency(totalExpenses)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Net Income</span>
                      </div>
                          <span className="font-semibold">{formatCurrency(netIncome)}</span>
                        </div>
                        <Progress value={(netIncome / totalRevenue) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Profit margin: {((netIncome / totalRevenue) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Transactions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary" />
                        Recent Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {transactions.slice(0, 3).map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                transaction.type === "income" 
                                  ? "bg-green-100 text-green-600" 
                                  : "bg-red-100 text-red-600"
                              }`}>
                                {transaction.type === "income" ? (
                                  <TrendingUp className="h-4 w-4" />
                                ) : (
                                  <TrendingDown className="h-4 w-4" />
                                )}
                        </div>
                        <div>
                                <p className="text-sm font-medium">{transaction.description}</p>
                                <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                            <div className="text-right">
                              <p className={`text-sm font-semibold ${
                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                              }`}>
                                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                              </p>
                              <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                                {transaction.status}
                              </Badge>
                        </div>
                      </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
          </div>
        </TabsContent>

              <TabsContent value="plans" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search plans..."
                        className="pl-4 pr-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Plan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                      </div>
                        <Badge className={getTypeColor(plan.type)}>
                          {plan.type}
                        </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Revenue</span>
                            <span className="font-semibold text-green-600">{formatCurrency(plan.revenue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Expenses</span>
                            <span className="font-semibold text-red-600">{formatCurrency(plan.expenses)}</span>
                            </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Profit</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(plan.profit)}</span>
                            </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Updated</span>
                            <span className="text-xs text-muted-foreground">{plan.updated.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search transactions..."
                        className="pl-4 pr-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Transaction
                    </Button>
                  </div>
                            </div>

                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                              transaction.type === "income" 
                                ? "bg-green-100 text-green-600" 
                                : "bg-red-100 text-red-600"
                            }`}>
                              {transaction.type === "income" ? (
                                <TrendingUp className="h-5 w-5" />
                              ) : (
                                <TrendingDown className="h-5 w-5" />
                              )}
                          </div>
                          <div>
                              <h3 className="font-semibold">{transaction.description}</h3>
                              <p className="text-sm text-muted-foreground">{transaction.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className={`text-lg font-semibold ${
                                transaction.type === "income" ? "text-green-600" : "text-red-600"
                              }`}>
                                {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                            </div>
                              <div className="text-xs text-muted-foreground">{transaction.date.toLocaleDateString()}</div>
                            </div>
                            <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                              {transaction.status}
                            </Badge>
                          </div>
                    </div>
                  </CardContent>
                </Card>
                  ))}
          </div>
        </TabsContent>

              <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Generate financial reports to analyze your business performance
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate Report
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
          console.log("Financial suggestion clicked:", suggestion);
          removeSuggestion(suggestion.id);
        }}
        onDismiss={removeSuggestion}
      />
    </div>
  );
}