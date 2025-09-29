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
import { Button } from "@/components/ui/button";

export default function AffiliatesDashboard() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [pg, af, lk, rf, po] = await Promise.all([
        fetch(`/api/affiliates/programs?tenantId=demo-tenant`).then((r) =>
          r.json()
        ),
        fetch(`/api/affiliates?tenantId=demo-tenant`).then((r) => r.json()),
        fetch(`/api/affiliates/links?tenantId=demo-tenant`).then((r) =>
          r.json()
        ),
        fetch(`/api/affiliates/referrals?tenantId=demo-tenant`).then((r) =>
          r.json()
        ),
        fetch(`/api/affiliates/payouts?tenantId=demo-tenant`).then((r) =>
          r.json()
        ),
      ]);
      setPrograms(pg.programs || []);
      setAffiliates(af.affiliates || []);
      setLinks(lk.links || []);
      setReferrals(rf.referrals || []);
      setPayouts(po.payouts || []);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading affiliates...</div>
        </div>
      </div>
    );
  }

  const totalCommission = referrals.reduce(
    (s, r) => s + (r.commissionAmount || 0),
    0
  );
  const pendingCommission = referrals
    .filter((r) => r.status === "pending")
    .reduce((s, r) => s + (r.commissionAmount || 0), 0);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Program</h1>
          <p className="text-gray-600">
            Manage programs, affiliates, links, referrals, and payouts
          </p>
        </div>
        <Button>Create Program</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{programs.length}</div>
            <div className="text-sm text-gray-600">Programs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{affiliates.length}</div>
            <div className="text-sm text-gray-600">Affiliates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              ${totalCommission.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Commission</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          {programs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No programs yet
              </CardContent>
            </Card>
          ) : (
            programs.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {p.name} <Badge>{p.isActive ? "Active" : "Inactive"}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Commission:{" "}
                    {p.commissionType === "percentage"
                      ? `${p.commissionValue}%`
                      : `$${p.commissionValue}`}{" "}
                    • Cookie: {p.cookieDays} days
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-4">
          {affiliates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No affiliates yet
              </CardContent>
            </Card>
          ) : (
            affiliates.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {a.name} <Badge>{a.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    {a.email} • Links: {a._count.links} • Referrals:{" "}
                    {a._count.referrals}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          {links.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No links yet
              </CardContent>
            </Card>
          ) : (
            links.map((l) => (
              <Card key={l.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {l.code} <Badge>{l.isActive ? "Active" : "Inactive"}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Affiliate: {l.affiliate?.name} • Clicks: {l._count.clicks} •
                    Referrals: {l._count.referrals}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          {referrals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No referrals yet
              </CardContent>
            </Card>
          ) : (
            referrals.map((r) => (
              <Card key={r.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ${r.amount.toFixed(2)} • <Badge>{r.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Commission: ${r.commissionAmount.toFixed(2)} • Affiliate:{" "}
                    {r.affiliate?.name}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          {payouts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-600">
                No payouts yet
              </CardContent>
            </Card>
          ) : (
            payouts.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    ${p.amount.toFixed(2)} • <Badge>{p.status}</Badge>
                  </CardTitle>
                  <CardDescription>
                    Affiliate: {p.affiliate?.name} • Method: {p.method}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
