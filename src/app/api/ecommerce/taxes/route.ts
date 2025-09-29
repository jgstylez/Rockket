import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const region = searchParams.get("region");
    const type = searchParams.get("type");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId, isActive: true };
    if (region) {
      where.region = region;
    }
    if (type) {
      where.type = type;
    }

    const taxRates = await prisma.taxRate.findMany({
      where,
      orderBy: { region: "asc" },
    });

    return NextResponse.json({ taxRates });
  } catch (error) {
    console.error("Error fetching tax rates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, rate, type, region, tenantId } = body;

    if (!name || !rate || !type || !region || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const taxRate = await prisma.taxRate.create({
      data: {
        name,
        rate,
        type,
        region,
        tenantId,
        isActive: true,
      },
    });

    return NextResponse.json({ taxRate }, { status: 201 });
  } catch (error) {
    console.error("Error creating tax rate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, rate, type, region, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Tax rate ID required" },
        { status: 400 }
      );
    }

    const taxRate = await prisma.taxRate.update({
      where: { id },
      data: {
        name,
        rate,
        type,
        region,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ taxRate });
  } catch (error) {
    console.error("Error updating tax rate:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
