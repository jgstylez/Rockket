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

interface Discount {
  id: string;
  name: string;
  code: string | null;
  type: string;
  value: number;
  minAmount: number | null;
  maxAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  _count: {
    usages: number;
  };
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minAmount: number | null;
  maxAmount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  _count: {
    usages: number;
  };
}

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  isActive: boolean;
  expiresAt: string | null;
  notes: string | null;
  createdAt: string;
  _count: {
    usages: number;
  };
}

export default function DiscountsDashboard() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [discountsRes, couponsRes, giftCardsRes] = await Promise.all([
        fetch("/api/discounts?tenantId=demo-tenant"),
        fetch("/api/coupons?tenantId=demo-tenant"),
        fetch("/api/gift-cards?tenantId=demo-tenant"),
      ]);

      const [discountsData, couponsData, giftCardsData] = await Promise.all([
        discountsRes.json(),
        couponsRes.json(),
        giftCardsRes.json(),
      ]);

      setDiscounts(discountsData.discounts || []);
      setCoupons(couponsData.coupons || []);
      setGiftCards(giftCardsData.giftCards || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "percentage":
        return "bg-blue-100 text-blue-800";
      case "fixed_amount":
        return "bg-green-100 text-green-800";
      case "free_shipping":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean, expiresAt: string | null) => {
    if (!isActive) return "bg-red-100 text-red-800";
    if (expiresAt && new Date(expiresAt) < new Date()) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-green-100 text-green-800";
  };

  const formatValue = (type: string, value: number) => {
    if (type === "percentage") {
      return `${value}%`;
    }
    return `$${value.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading discounts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Discounts & Promotions</h1>
          <p className="text-gray-600">
            Manage discounts, coupons, and gift cards
          </p>
        </div>
        <Button>Create New Promotion</Button>
      </div>

      <Tabs defaultValue="discounts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="gift-cards">Gift Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="discounts" className="space-y-6">
          <div className="grid gap-6">
            {discounts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No discounts yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first discount to start promoting your
                      products
                    </p>
                    <Button>Create Discount</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              discounts.map((discount) => (
                <Card key={discount.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {discount.name}
                          <Badge className={getTypeColor(discount.type)}>
                            {discount.type}
                          </Badge>
                          <Badge
                            className={getStatusColor(
                              discount.isActive,
                              discount.expiresAt
                            )}
                          >
                            {discount.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {discount.code && `Code: ${discount.code}`} •{" "}
                          {discount._count.usages} uses
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatValue(discount.type, discount.value)}
                        </div>
                        <div className="text-sm text-gray-600">Discount</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Min. Order
                        </div>
                        <div>
                          {discount.minAmount
                            ? `$${discount.minAmount}`
                            : "No minimum"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Usage Limit
                        </div>
                        <div>
                          {discount.usageLimit
                            ? `${discount.usageCount}/${discount.usageLimit}`
                            : "Unlimited"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Starts</div>
                        <div>
                          {discount.startsAt
                            ? new Date(discount.startsAt).toLocaleDateString()
                            : "Immediately"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Expires</div>
                        <div>
                          {discount.expiresAt
                            ? new Date(discount.expiresAt).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          <div className="grid gap-6">
            {coupons.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No coupons yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first coupon code for customers
                    </p>
                    <Button>Create Coupon</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              coupons.map((coupon) => (
                <Card key={coupon.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {coupon.code}
                          <Badge className={getTypeColor(coupon.type)}>
                            {coupon.type}
                          </Badge>
                          <Badge
                            className={getStatusColor(
                              coupon.isActive,
                              coupon.expiresAt
                            )}
                          >
                            {coupon.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {coupon._count.usages} uses
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {formatValue(coupon.type, coupon.value)}
                        </div>
                        <div className="text-sm text-gray-600">Discount</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Min. Order
                        </div>
                        <div>
                          {coupon.minAmount
                            ? `$${coupon.minAmount}`
                            : "No minimum"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">
                          Usage Limit
                        </div>
                        <div>
                          {coupon.usageLimit
                            ? `${coupon.usageCount}/${coupon.usageLimit}`
                            : "Unlimited"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Starts</div>
                        <div>
                          {coupon.startsAt
                            ? new Date(coupon.startsAt).toLocaleDateString()
                            : "Immediately"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Expires</div>
                        <div>
                          {coupon.expiresAt
                            ? new Date(coupon.expiresAt).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="gift-cards" className="space-y-6">
          <div className="grid gap-6">
            {giftCards.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">
                      No gift cards yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Create your first gift card for customers
                    </p>
                    <Button>Create Gift Card</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              giftCards.map((giftCard) => (
                <Card key={giftCard.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {giftCard.code}
                          <Badge
                            className={getStatusColor(
                              giftCard.isActive,
                              giftCard.expiresAt
                            )}
                          >
                            {giftCard.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {giftCard._count.usages} uses • Created{" "}
                          {new Date(giftCard.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ${giftCard.balance.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Balance (${giftCard.amount.toFixed(2)} total)
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-600">
                          Original Amount
                        </div>
                        <div>${giftCard.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Expires</div>
                        <div>
                          {giftCard.expiresAt
                            ? new Date(giftCard.expiresAt).toLocaleDateString()
                            : "Never"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-600">Notes</div>
                        <div>{giftCard.notes || "No notes"}</div>
                      </div>
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
