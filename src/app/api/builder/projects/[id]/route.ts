import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return withAuth(request, async (req) => {
    try {
      const project = await db.content.findFirst({
        where: {
          id: resolvedParams.id,
          tenantId: req.user!.tenantId,
          type: "builder_project",
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.title,
          description: (project.metadata as any)?.description || "",
          data: JSON.parse(project.content),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      console.error("Get builder project error:", error);
      return NextResponse.json(
        { error: "Failed to get builder project" },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { name, description, data } = body;

      const project = await db.content.update({
        where: {
          id: resolvedParams.id,
          tenantId: req.user!.tenantId,
        },
        data: {
          title: name,
          metadata: {
            description: description,
          },
          content: JSON.stringify(data),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.title,
          description: (project.metadata as any)?.description || "",
          data: JSON.parse(project.content),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update builder project error:", error);
      return NextResponse.json(
        { error: "Failed to update builder project" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return withAuth(request, async (req) => {
    try {
      await db.content.delete({
        where: {
          id: resolvedParams.id,
          tenantId: req.user!.tenantId,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Project deleted successfully",
      });
    } catch (error) {
      console.error("Delete builder project error:", error);
      return NextResponse.json(
        { error: "Failed to delete builder project" },
        { status: 500 }
      );
    }
  });
}
