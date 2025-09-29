import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    if (!threadId) {
      return NextResponse.json(
        { error: "Thread ID required" },
        { status: 400 }
      );
    }

    const replies = await prisma.forumReply.findMany({
      where: { threadId },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Error fetching forum replies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, threadId, authorId, tenantId, isSolution = false } = body;

    if (!content || !threadId || !authorId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reply = await prisma.forumReply.create({
      data: {
        content,
        threadId,
        authorId,
        tenantId,
        isSolution,
      },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });

    // Update thread reply count and last reply time
    await prisma.forumThread.update({
      where: { id: threadId },
      data: {
        replyCount: {
          increment: 1,
        },
        lastReplyAt: new Date(),
      },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("Error creating forum reply:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
