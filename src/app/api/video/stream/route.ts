import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const assetId = searchParams.get("assetId");
    const userId = searchParams.get("userId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (assetId) {
      whereClause.assetId = assetId;
    }
    if (userId) {
      whereClause.userId = userId;
    }

    const streams = await prisma.videoStream.findMany({
      where: whereClause,
      include: {
        asset: { select: { id: true, title: true, filename: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ streams });
  } catch (error) {
    console.error("Error fetching video streams:", error);
    return NextResponse.json(
      { error: "Failed to fetch video streams" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assetId,
      userId,
      sessionId,
      quality = "auto",
      ipAddress,
      userAgent,
      tenantId,
    } = body;

    if (!tenantId || !assetId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const stream = await prisma.videoStream.create({
      data: {
        assetId,
        userId,
        sessionId,
        quality,
        ipAddress,
        userAgent,
        tenantId,
      },
      include: {
        asset: { select: { id: true, title: true, filename: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ stream }, { status: 201 });
  } catch (error) {
    console.error("Error creating video stream:", error);
    return NextResponse.json(
      { error: "Failed to create video stream" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { streamId, duration, bytesStreamed, endTime, tenantId } = body;

    if (!tenantId || !streamId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (duration !== undefined) updateData.duration = duration;
    if (bytesStreamed !== undefined)
      updateData.bytesStreamed = BigInt(bytesStreamed);
    if (endTime) updateData.endTime = new Date(endTime);

    const stream = await prisma.videoStream.update({
      where: { id: streamId },
      data: updateData,
      include: {
        asset: { select: { id: true, title: true, filename: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ stream });
  } catch (error) {
    console.error("Error updating video stream:", error);
    return NextResponse.json(
      { error: "Failed to update video stream" },
      { status: 500 }
    );
  }
}
