import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const abandonedCartId = searchParams.get("abandonedCartId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { tenantId };
    if (abandonedCartId) {
      whereClause.abandonedCartId = abandonedCartId;
    }

    const recoveryEmails = await prisma.cartRecoveryEmail.findMany({
      where: whereClause,
      include: {
        abandonedCart: {
          select: {
            id: true,
            sessionId: true,
            email: true,
            total: true,
            currency: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ recoveryEmails });
  } catch (error) {
    console.error("Error fetching recovery emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch recovery emails" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      abandonedCartId,
      emailType,
      subject,
      content,
      discountCode,
      tenantId,
    } = body;

    if (!abandonedCartId || !tenantId) {
      return NextResponse.json(
        { error: "Abandoned Cart ID and Tenant ID are required" },
        { status: 400 }
      );
    }

    const recoveryEmail = await prisma.cartRecoveryEmail.create({
      data: {
        abandonedCartId,
        emailType,
        subject,
        content,
        discountCode,
        tenantId,
      },
      include: {
        abandonedCart: {
          select: {
            id: true,
            sessionId: true,
            email: true,
            total: true,
            currency: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ recoveryEmail }, { status: 201 });
  } catch (error) {
    console.error("Error creating recovery email:", error);
    return NextResponse.json(
      { error: "Failed to create recovery email" },
      { status: 500 }
    );
  }
}
