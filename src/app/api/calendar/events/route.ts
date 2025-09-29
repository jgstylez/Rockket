import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (startDate && endDate) {
      whereClause.startAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }
    if (type) {
      whereClause.type = type;
    }

    const events = await prisma.calendarEvent.findMany({
      where: whereClause,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { startAt: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar events" },
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
      startAt,
      endAt,
      isAllDay,
      location,
      type,
      status,
      isRecurring,
      recurrence,
      ownerId,
      tenantId,
    } = body;

    if (!tenantId || !title || !startAt || !endAt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.calendarEvent.create({
      data: {
        title,
        description,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        isAllDay: isAllDay ?? false,
        location,
        type: type ?? "meeting",
        status: status ?? "scheduled",
        isRecurring: isRecurring ?? false,
        recurrence: recurrence || null,
        ownerId,
        tenantId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
