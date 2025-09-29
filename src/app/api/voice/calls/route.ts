import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const direction = searchParams.get("direction");
    const status = searchParams.get("status");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (direction) {
      whereClause.direction = direction;
    }
    if (status) {
      whereClause.status = status;
    }

    const calls = await prisma.callLog.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ calls });
  } catch (error) {
    console.error("Error fetching call logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch call logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, from, userId, tenantId } = body;

    if (!tenantId || !to || !from) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, you would initiate the call via Twilio here
    // For now, we'll just store it in the database
    const call = await prisma.callLog.create({
      data: {
        to,
        from,
        direction: "outbound",
        status: "initiated",
        userId,
        tenantId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Simulate Twilio response
    const twilioResponse = {
      sid: `CA${Math.random().toString(36).substr(2, 32)}`,
      status: "queued",
      price: "0.0225",
      price_unit: "USD",
    };

    // Update call with Twilio response
    const updatedCall = await prisma.callLog.update({
      where: { id: call.id },
      data: {
        callId: twilioResponse.sid,
        status: twilioResponse.status,
        price: parseFloat(twilioResponse.price),
        currency: twilioResponse.price_unit,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ call: updatedCall }, { status: 201 });
  } catch (error) {
    console.error("Error creating call:", error);
    return NextResponse.json(
      { error: "Failed to create call" },
      { status: 500 }
    );
  }
}
