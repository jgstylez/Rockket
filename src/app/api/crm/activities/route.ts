import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const dealId = searchParams.get("dealId");
    const contactId = searchParams.get("contactId");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const activities = await prisma.cRMActivity.findMany({
      where: {
        tenantId,
        ...(dealId ? { dealId } : {}),
        ...(contactId ? { contactId } : {}),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        deal: { select: { id: true, title: true } },
        contact: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, content, dueAt, ownerId, dealId, contactId, tenantId } = body;
    if (!tenantId || !type || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const activity = await prisma.cRMActivity.create({
      data: {
        type,
        content,
        dueAt: dueAt ? new Date(dueAt) : null,
        ownerId,
        dealId,
        contactId,
        tenantId,
      },
      include: { owner: true, deal: true, contact: true },
    });
    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}
