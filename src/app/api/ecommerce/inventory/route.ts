import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const productId = searchParams.get("productId");
    const lowStock = searchParams.get("lowStock");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (productId) {
      where.productId = productId;
    }
    if (lowStock === "true") {
      where.available = {
        lte: prisma.inventory.fields.lowStockThreshold,
      };
    }

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Error fetching inventory:", error);
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
      productId,
      variantId,
      quantity,
      reserved,
      lowStockThreshold,
      location,
      tenantId,
    } = body;

    if (!productId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const available = quantity - (reserved || 0);

    const inventory = await prisma.inventory.create({
      data: {
        productId,
        variantId: variantId || null,
        quantity,
        reserved: reserved || 0,
        available,
        lowStockThreshold: lowStockThreshold || 10,
        location: location || null,
        tenantId,
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
      },
    });

    return NextResponse.json({ inventory }, { status: 201 });
  } catch (error) {
    console.error("Error creating inventory record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, quantity, reserved, location } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Inventory ID required" },
        { status: 400 }
      );
    }

    const available = quantity - (reserved || 0);

    const inventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity,
        reserved: reserved || 0,
        available,
        location: location || null,
        updatedAt: new Date(),
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
      },
    });

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
