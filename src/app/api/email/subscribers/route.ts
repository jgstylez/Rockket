import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (status) {
      where.status = status;
    }

    const subscribers = await prisma.emailSubscriber.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ subscribers });
  } catch (error) {
    console.error("Error fetching email subscribers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, tags, metadata, tenantId, userId } =
      body;

    if (!email || !tenantId) {
      return NextResponse.json(
        { error: "Email and tenant ID required" },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.emailSubscriber.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Subscriber already exists" },
        { status: 409 }
      );
    }

    const subscriber = await prisma.emailSubscriber.create({
      data: {
        email,
        firstName,
        lastName,
        tags: tags || [],
        metadata: metadata || {},
        tenantId,
        userId: userId || null,
        status: "active",
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ subscriber }, { status: 201 });
  } catch (error) {
    console.error("Error creating email subscriber:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
