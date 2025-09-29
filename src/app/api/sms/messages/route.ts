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

    const messages = await prisma.sMSMessage.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching SMS messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMS messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, from, body: messageBody, userId, tenantId } = body;

    if (!tenantId || !to || !from || !messageBody) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In a real implementation, you would send the SMS via Twilio here
    // For now, we'll just store it in the database
    const message = await prisma.sMSMessage.create({
      data: {
        to,
        from,
        body: messageBody,
        direction: "outbound",
        status: "pending",
        userId,
        tenantId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Simulate Twilio response
    const twilioResponse = {
      sid: `SM${Math.random().toString(36).substr(2, 32)}`,
      status: "queued",
      price: "0.0075",
      price_unit: "USD",
    };

    // Update message with Twilio response
    const updatedMessage = await prisma.sMSMessage.update({
      where: { id: message.id },
      data: {
        messageId: twilioResponse.sid,
        status: twilioResponse.status,
        price: parseFloat(twilioResponse.price),
        currency: twilioResponse.price_unit,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ message: updatedMessage }, { status: 201 });
  } catch (error) {
    console.error("Error creating SMS message:", error);
    return NextResponse.json(
      { error: "Failed to create SMS message" },
      { status: 500 }
    );
  }
}
