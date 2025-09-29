import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const customerId = searchParams.get("customerId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }
    if (customerId) {
      where.customerId = customerId;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerEmail,
      items,
      shippingAddress,
      billingAddress,
      notes,
      tenantId,
    } = body;

    if (!customerId || !customerEmail || !items || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
    const total = subtotal + tax + shipping;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId,
        customerEmail,
        items,
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
        currency: "USD",
        status: "pending",
        paymentStatus: "pending",
        shippingStatus: "pending",
        shippingAddress: shippingAddress || {},
        billingAddress: billingAddress || {},
        notes,
        tenantId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: { id: true, name: true, sku: true },
            },
          },
        },
      },
    });

    // Create order items
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          orderId: order.id,
        },
      });
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
