import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (status) {
      whereClause.status = status;
    }
    if (startDate && endDate) {
      whereClause.startAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        slot: true,
        event: true,
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startAt: "desc" },
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slotId,
      eventId,
      customerName,
      customerEmail,
      customerPhone,
      startAt,
      endAt,
      status,
      notes,
      price,
      currency,
      paymentStatus,
      ownerId,
      tenantId,
    } = body;

    if (!tenantId || !customerName || !customerEmail || !startAt || !endAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        slotId,
        eventId,
        customerName,
        customerEmail,
        customerPhone,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        status: status ?? "pending",
        notes,
        price: price ?? 0,
        currency: currency ?? "USD",
        paymentStatus: paymentStatus ?? "pending",
        ownerId,
        tenantId,
      },
      include: {
        slot: true,
        event: true,
        owner: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
