import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const forumId = searchParams.get("forumId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (forumId) {
      where.forumId = forumId;
    }

    const threads = await prisma.forumThread.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        forum: {
          select: { id: true, name: true, slug: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "asc" },
          take: 3,
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: [
        { isPinned: "desc" },
        { lastReplyAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching forum threads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, forumId, authorId, tenantId } = body;

    if (!title || !content || !forumId || !authorId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const thread = await prisma.forumThread.create({
      data: {
        title,
        slug,
        content,
        forumId,
        authorId,
        tenantId,
        lastReplyAt: new Date(),
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        forum: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    // Update forum thread count
    await prisma.forum.update({
      where: { id: forumId },
      data: {
        threads: {
          connect: { id: thread.id },
        },
      },
    });

    return NextResponse.json({ thread }, { status: 201 });
  } catch (error) {
    console.error("Error creating forum thread:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
