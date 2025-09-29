import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const eventType = searchParams.get("eventType");
    const processed = searchParams.get("processed");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (eventType) {
      whereClause.eventType = eventType;
    }
    if (processed !== null) {
      whereClause.processed = processed === "true";
    }

    const webhooks = await prisma.sMSWebhook.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ webhooks });
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, messageId, callId, payload, tenantId } = body;

    if (!tenantId || !eventType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const webhook = await prisma.sMSWebhook.create({
      data: {
        eventType,
        messageId,
        callId,
        payload: payload || {},
        tenantId,
      },
    });

    // Process webhook based on event type
    if (eventType === "message_status") {
      await processMessageStatusWebhook(webhook);
    } else if (eventType === "incoming_message") {
      await processIncomingMessageWebhook(webhook);
    } else if (eventType === "call_status") {
      await processCallStatusWebhook(webhook);
    }

    return NextResponse.json({ webhook }, { status: 201 });
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      { error: "Failed to create webhook" },
      { status: 500 }
    );
  }
}

async function processMessageStatusWebhook(webhook: any) {
  try {
    const payload = webhook.payload as any;
    const messageId = payload.MessageSid || webhook.messageId;

    if (messageId) {
      await prisma.sMSMessage.updateMany({
        where: { messageId },
        data: {
          status: payload.MessageStatus,
          errorCode: payload.ErrorCode,
          errorMessage: payload.ErrorMessage,
        },
      });
    }

    await prisma.sMSWebhook.update({
      where: { id: webhook.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error("Error processing message status webhook:", error);
  }
}

async function processIncomingMessageWebhook(webhook: any) {
  try {
    const payload = webhook.payload as any;

    // Create incoming message record
    await prisma.sMSMessage.create({
      data: {
        to: payload.To,
        from: payload.From,
        body: payload.Body,
        direction: "inbound",
        status: "delivered",
        messageId: payload.MessageSid,
        tenantId: webhook.tenantId,
      },
    });

    await prisma.sMSWebhook.update({
      where: { id: webhook.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error("Error processing incoming message webhook:", error);
  }
}

async function processCallStatusWebhook(webhook: any) {
  try {
    const payload = webhook.payload as any;
    const callId = payload.CallSid || webhook.callId;

    if (callId) {
      await prisma.callLog.updateMany({
        where: { callId },
        data: {
          status: payload.CallStatus,
          duration: payload.CallDuration ? parseInt(payload.CallDuration) : 0,
          startTime: payload.CallStartTime
            ? new Date(payload.CallStartTime)
            : null,
          endTime: payload.CallEndTime ? new Date(payload.CallEndTime) : null,
          recordingUrl: payload.RecordingUrl,
        },
      });
    }

    await prisma.sMSWebhook.update({
      where: { id: webhook.id },
      data: { processed: true },
    });
  } catch (error) {
    console.error("Error processing call status webhook:", error);
  }
}
