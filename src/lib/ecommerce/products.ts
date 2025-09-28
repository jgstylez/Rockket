export interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  status: "draft" | "active" | "archived";
  inventory: {
    track: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  categories: string[];
  tags: string[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  inventory: {
    track: boolean;
    quantity: number;
    lowStockThreshold: number;
    allowBackorder: boolean;
  };
  attributes: Record<string, string>;
  images: string[];
  status: "active" | "inactive";
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  isActive: boolean;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  attributes?: Record<string, string>;
}

export interface ShoppingCart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  orderNumber: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  customer: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  shippingAddress: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };
  billing: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentId?: string;
  notes?: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  attributes?: Record<string, string>;
}

export class ProductService {
  async createProduct(
    name: string,
    description: string,
    price: number,
    tenantId: string,
    options: {
      sku?: string;
      comparePrice?: number;
      cost?: number;
      categories?: string[];
      tags?: string[];
      images?: ProductImage[];
      variants?: ProductVariant[];
    } = {}
  ): Promise<Product> {
    const slug = await this.generateSlug(name);

    return {
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      slug,
      sku: options.sku || (await this.generateSKU(name)),
      price,
      comparePrice: options.comparePrice,
      cost: options.cost,
      status: "draft",
      inventory: {
        track: true,
        quantity: 0,
        lowStockThreshold: 10,
        allowBackorder: false,
      },
      images: options.images || [],
      variants: options.variants || [],
      categories: options.categories || [],
      tags: options.tags || [],
      seo: {},
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createProductCategory(
    name: string,
    tenantId: string,
    options: {
      description?: string;
      parentId?: string;
      image?: string;
    } = {}
  ): Promise<ProductCategory> {
    const slug = await this.generateSlug(name);

    return {
      id: `category_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      slug,
      description: options.description,
      parentId: options.parentId,
      image: options.image,
      isActive: true,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async createShoppingCart(
    tenantId: string,
    userId?: string,
    sessionId?: string
  ): Promise<ShoppingCart> {
    return {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      currency: "USD",
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  async addToCart(
    cart: ShoppingCart,
    productId: string,
    quantity: number,
    options: {
      variantId?: string;
      attributes?: Record<string, string>;
    } = {}
  ): Promise<ShoppingCart> {
    const existingItem = cart.items.find(
      (item) =>
        item.productId === productId && item.variantId === options.variantId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId,
        variantId: options.variantId,
        quantity,
        price: 0, // Will be set when product is loaded
        attributes: options.attributes,
      });
    }

    return this.recalculateCart(cart);
  }

  async removeFromCart(
    cart: ShoppingCart,
    itemId: string
  ): Promise<ShoppingCart> {
    cart.items = cart.items.filter((item) => item.id !== itemId);
    return this.recalculateCart(cart);
  }

  async updateCartItem(
    cart: ShoppingCart,
    itemId: string,
    quantity: number
  ): Promise<ShoppingCart> {
    const item = cart.items.find((item) => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        return this.removeFromCart(cart, itemId);
      }
    }
    return this.recalculateCart(cart);
  }

  async recalculateCart(cart: ShoppingCart): Promise<ShoppingCart> {
    cart.subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cart.tax = cart.subtotal * 0.08; // 8% tax rate
    cart.shipping = cart.subtotal > 50 ? 0 : 10; // Free shipping over $50
    cart.total = cart.subtotal + cart.tax + cart.shipping;
    cart.updatedAt = new Date();
    return cart;
  }

  async createOrder(
    cart: ShoppingCart,
    customer: Order["customer"],
    shipping: Order["shipping"],
    billing: Order["billing"],
    paymentMethod: string,
    paymentId: string
  ): Promise<Order> {
    const orderNumber = await this.generateOrderNumber();

    return {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      status: "pending",
      customer,
      shipping,
      shippingAddress: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        address1: billing.address1,
        address2: billing.address2,
        city: billing.city,
        state: billing.state,
        zip: billing.zip,
        country: billing.country,
        phone: customer.phone,
      },
      billing,
      items: cart.items.map((item) => ({
        id: `order_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        productId: item.productId,
        variantId: item.variantId,
        name: "", // Will be populated from product
        sku: "", // Will be populated from product
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        attributes: item.attributes,
      })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      discount: 0,
      total: cart.total,
      currency: cart.currency,
      paymentStatus: "pending",
      paymentMethod,
      paymentId,
      tenantId: cart.tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private async generateSlug(text: string): Promise<string> {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  private async generateSKU(name: string): Promise<string> {
    const prefix = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 3);

    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${timestamp}`;
  }

  private async generateOrderNumber(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }
}
