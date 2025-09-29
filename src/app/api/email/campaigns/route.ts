import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const campaigns = await prisma.emailCampaign.findMany({
      where: { tenantId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true, subject: true },
        },
        sequence: {
          select: { id: true, name: true, trigger: true },
        },
        _count: {
          select: { deliveries: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error fetching email campaigns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      subject,
      htmlContent,
      textContent,
      templateId,
      sequenceId,
      scheduledAt,
      tenantId,
      authorId,
    } = body;

    if (!name || !type || !subject || !htmlContent || !tenantId || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        type,
        subject,
        htmlContent,
        textContent,
        templateId: templateId || null,
        sequenceId: sequenceId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        tenantId,
        authorId,
        status: scheduledAt ? "scheduled" : "draft",
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true, subject: true },
        },
        sequence: {
          select: { id: true, name: true, trigger: true },
        },
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Error creating email campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
