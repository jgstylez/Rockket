"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description?: string;
  handle: string;
  status: "draft" | "proposed" | "published" | "rejected";
  thumbnail?: string;
  variants?: ProductVariant[];
  created_at: string;
  updated_at: string;
}

interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  prices: MoneyAmount[];
  inventory_quantity: number;
  manage_inventory: boolean;
}

interface MoneyAmount {
  id: string;
  currency_code: string;
  amount: number;
}

interface Order {
  id: string;
  status: "pending" | "completed" | "archived" | "canceled";
  display_id: number;
  email: string;
  currency_code: string;
  total?: number;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  has_account: boolean;
  created_at: string;
  updated_at: string;
}

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch("/api/ecommerce/medusa?type=products"),
        fetch("/api/ecommerce/medusa?type=orders"),
        fetch("/api/ecommerce/medusa?type=customers"),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const customersData = await customersRes.json();

      setProducts(productsData.data || []);
      setOrders(ordersData.data || []);
      setCustomers(customersData.data || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    const title = prompt("Enter product title:");
    if (!title) return;

    try {
      const response = await fetch("/api/ecommerce/medusa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product",
          data: {
            title,
            handle: title.toLowerCase().replace(/\s+/g, "-"),
            status: "draft",
            description: "",
          },
        }),
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(
        `/api/ecommerce/medusa/${productId}?type=product`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        loadData();
        if (selectedProduct?.id === productId) {
          setSelectedProduct(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "proposed":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: customers.length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">E-commerce</h2>
            <Button onClick={handleCreateProduct} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Product
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="proposed">Proposed</option>
              <option value="rejected">Rejected</option>
            </select>
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
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
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
          ) : activeTab === "products" ? (
            filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-colors ${
                      selectedProduct?.id === product.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {product.handle} • {product.status}
                          </p>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(product.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <Card
                  key={order.id}
                  className="cursor-pointer hover:border-gray-300"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm">
                          Order #{order.display_id}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.email}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {order.total
                            ? `$${(order.total / 100).toFixed(2)}`
                            : "N/A"}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
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
              <h1 className="text-xl font-semibold">E-commerce Dashboard</h1>
              <p className="text-sm text-gray-500">
                Manage your products, orders, and customers
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalProducts}
                </div>
                <div className="text-xs text-gray-500">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalOrders}
                </div>
                <div className="text-xs text-gray-500">Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalCustomers}
                </div>
                <div className="text-xs text-gray-500">Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  ${(stats.totalRevenue / 100).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {selectedProduct ? (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={selectedProduct.title}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Handle
                        </label>
                        <input
                          type="text"
                          value={selectedProduct.handle}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Description
                        </label>
                        <textarea
                          value={selectedProduct.description || ""}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Status
                        </label>
                        <select
                          value={selectedProduct.status}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="proposed">Proposed</option>
                          <option value="published">Published</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variants" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No variants yet</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No pricing set</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Set Pricing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inventory" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No inventory data</p>
                      <Button className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Manage Inventory
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Product Selected
                </h3>
                <p className="text-gray-500 mb-4">
                  Select a product from the sidebar to start managing
                </p>
                <Button onClick={handleCreateProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Product
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
