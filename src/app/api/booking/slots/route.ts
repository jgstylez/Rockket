import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const slots = await prisma.bookingSlot.findMany({
      where: { tenantId },
      include: {
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching booking slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      duration,
      price,
      currency,
      isActive,
      maxBookings,
      bufferTime,
      availability,
      tenantId,
    } = body;

    if (!tenantId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const slot = await prisma.bookingSlot.create({
      data: {
        title,
        description,
        duration: duration ?? 30,
        price: price ?? 0,
        currency: currency ?? "USD",
        isActive: isActive ?? true,
        maxBookings: maxBookings ?? 1,
        bufferTime: bufferTime ?? 0,
        availability: availability || {},
        tenantId,
      },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking slot:", error);
    return NextResponse.json(
      { error: "Failed to create booking slot" },
      { status: 500 }
    );
  }
}
