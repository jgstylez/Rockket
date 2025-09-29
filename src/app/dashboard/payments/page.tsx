"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  isActive: boolean;
  stripePriceId?: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
  };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PaymentsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("plans");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [plansRes, subscriptionsRes, paymentsRes] = await Promise.all([
        fetch("/api/payments/plans?tenantId=demo-tenant"),
        fetch("/api/payments/subscriptions?tenantId=demo-tenant"),
        fetch("/api/payments/payments?tenantId=demo-tenant"),
      ]);

      const plansData = await plansRes.json();
      const subscriptionsData = await subscriptionsRes.json();
      const paymentsData = await paymentsRes.json();

      setPlans(plansData.plans || []);
      setSubscriptions(subscriptionsData.subscriptions || []);
      setPayments(paymentsData.payments || []);
    } catch (error) {
      console.error("Failed to load payments data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "succeeded":
        return "bg-green-100 text-green-800";
      case "incomplete":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "past_due":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      case "trialing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
      case "succeeded":
        return <CheckCircle className="h-4 w-4" />;
      case "incomplete":
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "past_due":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "trialing":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const stats = {
    totalPlans: plans.length,
    totalSubscriptions: subscriptions.length,
    activeSubscriptions: subscriptions.filter((s) => s.status === "active")
      .length,
    totalRevenue: payments
      .filter((p) => p.status === "succeeded")
      .reduce((sum, payment) => sum + payment.amount, 0),
    monthlyRevenue: payments
      .filter(
        (p) =>
          p.status === "succeeded" &&
          new Date(p.createdAt) >
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      )
      .reduce((sum, payment) => sum + payment.amount, 0),
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Payments</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Plan
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
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
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
          ) : activeTab === "plans" ? (
            <div className="space-y-2">
              {plans.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500">No plans found</p>
                </div>
              ) : (
                plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="cursor-pointer hover:border-gray-300"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {plan.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {plan.description}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <span className="mr-2">
                              ${plan.price}/{plan.interval}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.isActive ? "active" : "cancelled")}`}
                            >
                              {plan.isActive ? "Active" : "Inactive"}
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
              {subscriptions.map((subscription) => (
                <Card
                  key={subscription.id}
                  className="cursor-pointer hover:border-gray-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {subscription.user.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {subscription.plan.name}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}
                          >
                            {subscription.status}
                          </span>
                          <span className="ml-2">
                            ${subscription.plan.price}/
                            {subscription.plan.interval}
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
              <h1 className="text-xl font-semibold">Payments Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage your subscription plans and payments
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalPlans}
                </div>
                <div className="text-xs text-gray-500">Plans</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.activeSubscriptions}
                </div>
                <div className="text-xs text-gray-500">
                  Active Subscriptions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${stats.monthlyRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Monthly Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${stats.totalRevenue.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Total Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscription Plans
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPlans}</div>
                    <p className="text-xs text-muted-foreground">
                      Available plans
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Subscriptions
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stats.activeSubscriptions}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently active
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.monthlyRevenue.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="plans" className="mt-6">
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Subscription Plans
                </h3>
                <p className="text-gray-500 mb-4">
                  Create and manage your subscription plans
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Plan
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="mt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Subscriptions</h3>
                <p className="text-gray-500 mb-4">
                  View and manage customer subscriptions
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment History</h3>
                <p className="text-gray-500 mb-4">
                  View payment transactions and analytics
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
