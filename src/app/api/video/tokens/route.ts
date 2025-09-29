import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

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

    const tokens = await prisma.videoAccessToken.findMany({
      where: whereClause,
      include: {
        asset: { select: { id: true, title: true, filename: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Error fetching video access tokens:", error);
    return NextResponse.json(
      { error: "Failed to fetch video access tokens" },
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
      expiresInHours = 24,
      permissions = {},
      ipAddress,
      userAgent,
      tenantId,
    } = body;

    if (!tenantId || !assetId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const accessToken = await prisma.videoAccessToken.create({
      data: {
        assetId,
        userId,
        token,
        expiresAt,
        permissions,
        ipAddress,
        userAgent,
        tenantId,
      },
      include: {
        asset: { select: { id: true, title: true, filename: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({ accessToken }, { status: 201 });
  } catch (error) {
    console.error("Error creating video access token:", error);
    return NextResponse.json(
      { error: "Failed to create video access token" },
      { status: 500 }
    );
  }
}
