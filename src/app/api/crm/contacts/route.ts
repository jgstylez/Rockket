import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const status = searchParams.get("status");
    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    const contacts = await prisma.cRMContact.findMany({
      where: { tenantId, ...(status ? { status } : {}) },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        deals: true,
        _count: { select: { deals: true, activities: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      tags,
      status,
      source,
      ownerId,
      userId,
      tenantId,
    } = body;
    if (!tenantId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const contact = await prisma.cRMContact.create({
      data: {
        name,
        email,
        phone,
        company,
        tags: Array.isArray(tags) ? tags : [],
        status: status ?? "lead",
        source,
        ownerId,
        userId,
        tenantId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
