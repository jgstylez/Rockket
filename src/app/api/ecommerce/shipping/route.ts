import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const country = searchParams.get("country");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId, isActive: true };

    const shippingZones = await prisma.shippingZone.findMany({
      where,
      orderBy: { name: "asc" },
    });

    // If country is specified, filter zones that include that country
    let applicableZones = shippingZones;
    if (country) {
      applicableZones = shippingZones.filter((zone) => {
        const countries = zone.countries as string[];
        return countries.includes(country);
      });
    }

    return NextResponse.json({ shippingZones: applicableZones });
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, countries, rates, tenantId } = body;

    if (!name || !countries || !rates || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const shippingZone = await prisma.shippingZone.create({
      data: {
        name,
        countries,
        rates,
        tenantId,
        isActive: true,
      },
    });

    return NextResponse.json({ shippingZone }, { status: 201 });
  } catch (error) {
    console.error("Error creating shipping zone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, countries, rates, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Shipping zone ID required" },
        { status: 400 }
      );
    }

    const shippingZone = await prisma.shippingZone.update({
      where: { id },
      data: {
        name,
        countries,
        rates,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ shippingZone });
  } catch (error) {
    console.error("Error updating shipping zone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
