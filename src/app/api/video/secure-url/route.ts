import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId, userId, permissions = {}, tenantId } = body;

    if (!tenantId || !assetId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the video asset
    const asset = await prisma.videoAsset.findFirst({
      where: { id: assetId, tenantId },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Video asset not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this asset
    if (!asset.isPublic && asset.accessLevel !== "free") {
      // In a real implementation, you would check user permissions here
      // For now, we'll allow access if userId is provided
      if (!userId) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }
    }

    // Generate signed URL with expiration
    const expiresIn = 3600; // 1 hour
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn;

    // Create a secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Store access token in database
    const accessToken = await prisma.videoAccessToken.create({
      data: {
        assetId,
        userId,
        token,
        expiresAt: new Date(expiresAt * 1000),
        permissions,
        tenantId,
      },
    });

    // Generate signed URL (simplified - in production you'd use proper signing)
    const baseUrl = process.env.VIDEO_CDN_URL || "https://cdn.example.com";
    const signedUrl = `${baseUrl}/video/${assetId}?token=${token}&expires=${expiresAt}`;

    return NextResponse.json({
      signedUrl,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      token: accessToken.token,
      asset: {
        id: asset.id,
        title: asset.title,
        duration: asset.duration,
        thumbnail: asset.thumbnail,
        drmEnabled: asset.drmEnabled,
      },
    });
  } catch (error) {
    console.error("Error generating secure URL:", error);
    return NextResponse.json(
      { error: "Failed to generate secure URL" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const tenantId = searchParams.get("tenantId");

    if (!token || !tenantId) {
      return NextResponse.json(
        { error: "Token and Tenant ID are required" },
        { status: 400 }
      );
    }

    // Validate token
    const accessToken = await prisma.videoAccessToken.findFirst({
      where: {
        token,
        tenantId,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
      include: {
        asset: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }

    // Update access tracking
    await prisma.videoAccessToken.update({
      where: { id: accessToken.id },
      data: {
        // Track access in a real implementation
      },
    });

    return NextResponse.json({
      valid: true,
      asset: {
        id: accessToken.asset.id,
        title: accessToken.asset.title,
        filename: accessToken.asset.filename,
        duration: accessToken.asset.duration,
        thumbnail: accessToken.asset.thumbnail,
        drmEnabled: accessToken.asset.drmEnabled,
        accessLevel: accessToken.asset.accessLevel,
      },
      permissions: accessToken.permissions,
      expiresAt: accessToken.expiresAt,
    });
  } catch (error) {
    console.error("Error validating token:", error);
    return NextResponse.json(
      { error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
