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

    const sequences = await prisma.emailSequence.findMany({
      where: { tenantId },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        steps: {
          include: {
            template: {
              select: { id: true, name: true, subject: true },
            },
          },
          orderBy: { stepOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sequences });
  } catch (error) {
    console.error("Error fetching email sequences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, trigger, tenantId, authorId, steps } = body;

    if (!name || !trigger || !tenantId || !authorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sequence = await prisma.emailSequence.create({
      data: {
        name,
        description,
        trigger,
        tenantId,
        authorId,
        isActive: true,
        steps: {
          create:
            steps?.map((step: any, index: number) => ({
              stepOrder: index + 1,
              delayDays: step.delayDays || 0,
              delayHours: step.delayHours || 0,
              templateId: step.templateId,
              conditions: step.conditions || {},
            })) || [],
        },
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        steps: {
          include: {
            template: {
              select: { id: true, name: true, subject: true },
            },
          },
          orderBy: { stepOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ sequence }, { status: 201 });
  } catch (error) {
    console.error("Error creating email sequence:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
