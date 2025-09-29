"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function CRMDashboard() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [c, p, d, a] = await Promise.all([
        fetch(`/api/crm/contacts?tenantId=demo-tenant`).then((r) => r.json()),
        fetch(`/api/crm/pipelines?tenantId=demo-tenant`).then((r) => r.json()),
        fetch(`/api/crm/deals?tenantId=demo-tenant`).then((r) => r.json()),
        fetch(`/api/crm/activities?tenantId=demo-tenant`).then((r) => r.json()),
      ]);
      setContacts(c.contacts || []);
      setPipelines(p.pipelines || []);
      setDeals(d.deals || []);
      setActivities(a.activities || []);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading CRM...</div>
        </div>
      </div>
    );
  }

  const openDeals = deals.filter((d) => d.status === "open");
  const wonDeals = deals.filter((d) => d.status === "won");
  const totalPipeline = openDeals.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">CRM</h1>
        <p className="text-gray-600">
          Contacts, pipelines, deals, and activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{contacts.length}</div>
            <div className="text-sm text-gray-600">Contacts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{openDeals.length}</div>
            <div className="text-sm text-gray-600">Open Deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${totalPipeline.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Pipeline Value</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-4">
          {contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No contacts yet
              </CardContent>
            </Card>
          ) : (
            contacts.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {c.name} <Badge>{c.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {c.email} • Deals: {c._count?.deals ?? 0} • Activities:{" "}
                    {c._count?.activities ?? 0}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="pipelines" className="space-y-4">
          {pipelines.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No pipelines yet
              </CardContent>
            </Card>
          ) : (
            pipelines.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {p.name} {p.isDefault && <Badge>Default</Badge>}
                  </CardTitle>
                  <CardDescription>
                    Stages: {p._count?.stages ?? p.stages?.length ?? 0} • Deals:{" "}
                    {p._count?.deals ?? 0}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="deals" className="space-y-4">
          {deals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No deals yet
              </CardContent>
            </Card>
          ) : (
            deals.map((d) => (
              <Card key={d.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {d.title} <Badge>{d.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    ${d.value.toFixed(2)} • Stage: {d.stage?.name} • Owner:{" "}
                    {d.owner?.name || "Unassigned"}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          {activities.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No activities yet
              </CardContent>
            </Card>
          ) : (
            activities.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {a.type} {a.completedAt && <Badge>Completed</Badge>}
                  </CardTitle>
                  <CardDescription>{a.content}</CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
