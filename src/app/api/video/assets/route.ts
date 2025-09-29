import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    const accessLevel = searchParams.get("accessLevel");

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
    if (accessLevel) {
      whereClause.accessLevel = accessLevel;
    }

    const assets = await prisma.videoAsset.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            tokens: true,
            streams: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ assets });
  } catch (error) {
    console.error("Error fetching video assets:", error);
    return NextResponse.json(
      { error: "Failed to fetch video assets" },
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
      filename,
      fileSize,
      mimeType,
      duration,
      thumbnail,
      isPublic,
      drmEnabled,
      accessLevel,
      lessonId,
      tenantId,
    } = body;

    if (!tenantId || !title || !filename) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const asset = await prisma.videoAsset.create({
      data: {
        title,
        description,
        filename,
        fileSize: BigInt(fileSize || 0),
        mimeType,
        duration,
        thumbnail,
        isPublic: isPublic ?? false,
        drmEnabled: drmEnabled ?? false,
        accessLevel: accessLevel ?? "free",
        lessonId,
        tenantId,
      },
      include: {
        _count: {
          select: {
            tokens: true,
            streams: true,
          },
        },
      },
    });

    return NextResponse.json({ asset }, { status: 201 });
  } catch (error) {
    console.error("Error creating video asset:", error);
    return NextResponse.json(
      { error: "Failed to create video asset" },
      { status: 500 }
    );
  }
}
