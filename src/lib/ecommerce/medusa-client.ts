// Simplified MedusaJS client for basic functionality
// Note: This is a placeholder implementation for build compatibility

// Medusa types
interface MedusaProduct {
  id: string;
  title: string;
  description?: string;
  handle: string;
  status: "draft" | "proposed" | "published" | "rejected";
  thumbnail?: string;
  images?: string[];
  options?: any[];
  variants?: any[];
  tags?: any[];
  collection_id?: string;
  type_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface MedusaOrder {
  id: string;
  status: "pending" | "completed" | "archived" | "canceled" | "requires_action";
  fulfillment_status:
    | "not_fulfilled"
    | "partially_fulfilled"
    | "fulfilled"
    | "partially_shipped"
    | "shipped"
    | "partially_returned"
    | "returned"
    | "canceled"
    | "requires_action";
  payment_status:
    | "not_paid"
    | "awaiting"
    | "captured"
    | "partially_refunded"
    | "refunded"
    | "canceled"
    | "requires_action";
  display_id: number;
  cart_id?: string;
  customer_id?: string;
  email?: string;
  billing_address?: any;
  shipping_address?: any;
  region: any;
  currency_code: string;
  tax_rate?: number;
  discounts?: any[];
  gift_cards?: any[];
  shipping_methods?: any[];
  payments?: any[];
  fulfillments?: any[];
  returns?: any[];
  claims?: any[];
  refunds?: any[];
  swaps?: any[];
  draft_order_id?: string;
  draft_order?: any;
  items?: any[];
  edits?: any[];
  gift_card_transactions?: any[];
  canceled_at?: string;
  metadata?: any;
  idempotency_key?: string;
  external_id?: string;
  sales_channel_id?: string;
  shipping_total?: number;
  discount_total?: number;
  tax_total?: number;
  refunded_total?: number;
  total?: number;
  subtotal?: number;
  paid_total?: number;
  refundable_amount?: number;
  gift_card_total?: number;
  gift_card_tax_total?: number;
  returnable_items?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface MedusaCustomer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  billing_address_id?: string;
  billing_address?: any;
  shipping_addresses?: any[];
  phone?: string;
  has_account: boolean;
  orders?: any[];
  groups?: any[];
  metadata?: any;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

interface MedusaCart {
  id: string;
  region?: any;
  customer_id?: string;
  customer?: any;
  payment_id?: string;
  payment?: any;
  shipping_address_id?: string;
  shipping_address?: any;
  billing_address_id?: string;
  billing_address?: any;
  type: "default" | "swap" | "draft_order" | "payment_link" | "claim";
  completed_at?: string;
  payment_authorized_at?: string;
  idempotency_key?: string;
  context?: any;
  sales_channel_id?: string;
  shipping_total?: number;
  discount_total?: number;
  item_tax_total?: number;
  tax_total?: number;
  refunded_total?: number;
  total?: number;
  subtotal?: number;
  refundable_amount?: number;
  gift_card_total?: number;
  gift_card_tax_total?: number;
  shipping_tax_total?: number;
  shipping_total_with_tax?: number;
  items?: any[];
  region_id?: string;
  discounts?: any[];
  gift_cards?: any[];
  shipping_methods?: any[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

class MedusaClient {
  private baseUrl: string;
  private isAuthenticated: boolean = false;

  constructor() {
    this.baseUrl = process.env.MEDUSA_URL || "http://localhost:9000";
  }

  async authenticate(email: string, password: string) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      this.isAuthenticated = true;
      return await response.json();
    } catch (error) {
      console.error("Medusa authentication failed:", error);
      return null;
    }
  }

  async logout() {
    try {
      await fetch(`${this.baseUrl}/auth/logout`, { method: "POST" });
      this.isAuthenticated = false;
    } catch (error) {
      console.error("Medusa logout failed:", error);
    }
  }

  // Products
  async getProducts(filters?: any) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseUrl}/products?${params}`);
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  }

  async getProduct(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/products/${id}`);
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error("Failed to fetch product:", error);
      return null;
    }
  }

  async createProduct(data: Partial<MedusaProduct>) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.product;
    } catch (error) {
      console.error("Failed to create product:", error);
      return null;
    }
  }

  async updateProduct(id: string, data: Partial<MedusaProduct>) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/products/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.product;
    } catch (error) {
      console.error("Failed to update product:", error);
      return null;
    }
  }

  async deleteProduct(id: string) {
    try {
      await fetch(`${this.baseUrl}/admin/products/${id}`, { method: "DELETE" });
      return true;
    } catch (error) {
      console.error("Failed to delete product:", error);
      return false;
    }
  }

  // Carts
  async createCart(data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.cart;
    } catch (error) {
      console.error("Failed to create cart:", error);
      return null;
    }
  }

  async getCart(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/carts/${id}`);
      const data = await response.json();
      return data.cart;
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      return null;
    }
  }

  async addToCart(cartId: string, data: any) {
    try {
      const response = await fetch(
        `${this.baseUrl}/carts/${cartId}/line-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result.cart;
    } catch (error) {
      console.error("Failed to add to cart:", error);
      return null;
    }
  }

  async updateCartItem(cartId: string, lineId: string, data: any) {
    try {
      const response = await fetch(
        `${this.baseUrl}/carts/${cartId}/line-items/${lineId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      return result.cart;
    } catch (error) {
      console.error("Failed to update cart item:", error);
      return null;
    }
  }

  async removeFromCart(cartId: string, lineId: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/carts/${cartId}/line-items/${lineId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      return result.cart;
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      return null;
    }
  }

  // Orders
  async getOrders(filters?: any) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseUrl}/admin/orders?${params}`);
      const data = await response.json();
      return data.orders || [];
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return [];
    }
  }

  async getOrder(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders/${id}`);
      const data = await response.json();
      return data.order;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      return null;
    }
  }

  async createOrder(data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.order;
    } catch (error) {
      console.error("Failed to create order:", error);
      return null;
    }
  }

  async updateOrder(id: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/orders/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.order;
    } catch (error) {
      console.error("Failed to update order:", error);
      return null;
    }
  }

  // Customers
  async getCustomers(filters?: any) {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseUrl}/admin/customers?${params}`);
      const data = await response.json();
      return data.customers || [];
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      return [];
    }
  }

  async getCustomer(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/customers/${id}`);
      const data = await response.json();
      return data.customer;
    } catch (error) {
      console.error("Failed to fetch customer:", error);
      return null;
    }
  }

  async createCustomer(data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.customer;
    } catch (error) {
      console.error("Failed to create customer:", error);
      return null;
    }
  }

  async updateCustomer(id: string, data: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/customers/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result.customer;
    } catch (error) {
      console.error("Failed to update customer:", error);
      return null;
    }
  }

  // Regions
  async getRegions() {
    try {
      const response = await fetch(`${this.baseUrl}/regions`);
      const data = await response.json();
      return data.regions || [];
    } catch (error) {
      console.error("Failed to fetch regions:", error);
      return [];
    }
  }
}

export const medusaClient = new MedusaClient();
