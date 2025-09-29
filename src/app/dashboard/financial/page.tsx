"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FinancialDashboard() {
  const [plans, setPlans] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [exports, setExports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, itemsRes, scenariosRes, exportsRes] = await Promise.all([
        fetch("/api/financial/plans?tenantId=demo-tenant"),
        fetch("/api/financial/items?tenantId=demo-tenant"),
        fetch("/api/financial/scenarios?tenantId=demo-tenant"),
        fetch("/api/financial/exports?tenantId=demo-tenant"),
      ]);

      const [plansData, itemsData, scenariosData, exportsData] =
        await Promise.all([
          plansRes.json(),
          itemsRes.json(),
          scenariosRes.json(),
          exportsRes.json(),
        ]);

      setPlans(plansData.plans || []);
      setItems(itemsData.items || []);
      setScenarios(scenariosData.scenarios || []);
      setExports(exportsData.exports || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "business":
        return "bg-blue-100 text-blue-800";
      case "personal":
        return "bg-green-100 text-green-800";
      case "project":
        return "bg-purple-100 text-purple-800";
      case "optimistic":
        return "bg-green-100 text-green-800";
      case "realistic":
        return "bg-blue-100 text-blue-800";
      case "pessimistic":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "revenue":
        return "bg-green-100 text-green-800";
      case "expense":
        return "bg-red-100 text-red-800";
      case "asset":
        return "bg-blue-100 text-blue-800";
      case "liability":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading financial data...</div>
        </div>
      </div>
    );
  }

  const activePlans = plans.filter((p) => p.status === "active");
  const totalRevenue = items
    .filter((i) => i.category === "revenue")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = items
    .filter((i) => i.category === "expense")
    .reduce((sum, i) => sum + i.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Planning</h1>
          <p className="text-gray-600">
            Create plans, manage scenarios, and export financial reports
          </p>
        </div>
        <Button>Create Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
            <div className="text-sm text-gray-600">Total Expenses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(netIncome)}
            </div>
            <div className="text-sm text-gray-600">Net Income</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {activePlans.length}
            </div>
            <div className="text-sm text-gray-600">Active Plans</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList>
          <TabsTrigger value="plans">Financial Plans</TabsTrigger>
          <TabsTrigger value="items">Plan Items</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <div className="grid gap-6">
            {plans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No financial plans yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first financial plan
                    </p>
                    <Button>Create Plan</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              plans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {plan.name}
                          <Badge className={getStatusColor(plan.status)}>
                            {plan.status}
                          </Badge>
                          <Badge className={getTypeColor(plan.type)}>
                            {plan.type}
                          </Badge>
                          {plan.isTemplate && (
                            <Badge className="bg-purple-100 text-purple-800">
                              Template
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {plan.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Currency: {plan.currency}</div>
                        <div>
                          {plan.startDate && (
                            <div>Start: {formatDateTime(plan.startDate)}</div>
                          )}
                          {plan.endDate && (
                            <div>End: {formatDateTime(plan.endDate)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">Items</div>
                        <div>{plan._count?.items || 0}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Scenarios
                        </div>
                        <div>{plan._count?.scenarios || 0}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Exports</div>
                        <div>{plan._count?.exports || 0}</div>
                      </div>
                    </div>
                    {plan.user && (
                      <div className="mt-4 text-sm text-gray-600">
                        Owner: {plan.user.name}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-6">
          <div className="grid gap-6">
            {items.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No plan items yet
                    </h3>
                    <p className="text-gray-600">
                      Add items to your financial plans
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              items.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {item.name}
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          {item.isRecurring && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {item.frequency}
                            </Badge>
                          )}
                          {item.isVariable && (
                            <Badge className="bg-orange-100 text-orange-800">
                              Variable
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          {item.description || "No description"}
                          {item.subcategory && ` • ${item.subcategory}`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {item.plan?.name}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Frequency
                        </div>
                        <div>{item.frequency}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Start Date
                        </div>
                        <div>
                          {item.startDate
                            ? formatDateTime(item.startDate)
                            : "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          End Date
                        </div>
                        <div>
                          {item.endDate
                            ? formatDateTime(item.endDate)
                            : "Not set"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Type</div>
                        <div>{item.isRecurring ? "Recurring" : "One-time"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-6">
            {scenarios.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No scenarios yet
                    </h3>
                    <p className="text-gray-600">
                      Create scenarios to model different outcomes
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              scenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {scenario.name}
                          <Badge className={getTypeColor(scenario.type)}>
                            {scenario.type}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {scenario.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>Plan: {scenario.plan?.name}</div>
                        <div>Created: {formatDateTime(scenario.createdAt)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scenario.results && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-600">
                              Total Revenue
                            </div>
                            <div className="text-green-600">
                              {formatCurrency(
                                scenario.results.totalRevenue || 0
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              Total Expenses
                            </div>
                            <div className="text-red-600">
                              {formatCurrency(
                                scenario.results.totalExpenses || 0
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              Net Income
                            </div>
                            <div className="text-blue-600">
                              {formatCurrency(scenario.results.netIncome || 0)}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              Cash Flow
                            </div>
                            <div className="text-purple-600">
                              {formatCurrency(scenario.results.cashFlow || 0)}
                            </div>
                          </div>
                        </div>
                      )}
                      {scenario.user && (
                        <div className="text-sm text-gray-600">
                          Created by: {scenario.user.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-6">
          <div className="grid gap-6">
            {exports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No exports yet
                    </h3>
                    <p className="text-gray-600">
                      Generate exports from your financial plans
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              exports.map((exportItem) => (
                <Card key={exportItem.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {exportItem.fileName || "Export"}
                          <Badge className={getStatusColor(exportItem.status)}>
                            {exportItem.status}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {exportItem.type.toUpperCase()}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Format: {exportItem.format} •{" "}
                          {exportItem.plan?.name || exportItem.scenario?.name}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <div>
                          Created: {formatDateTime(exportItem.createdAt)}
                        </div>
                        {exportItem.completedAt && (
                          <div>
                            Completed: {formatDateTime(exportItem.completedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {exportItem.user &&
                          `Requested by: ${exportItem.user.name}`}
                      </div>
                      {exportItem.fileUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(exportItem.fileUrl, "_blank")
                          }
                        >
                          Download
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
