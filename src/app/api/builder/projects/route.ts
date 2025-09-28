import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db/client";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const projects = await db.content.findMany({
        where: {
          tenantId: req.user!.tenantId,
          type: "builder_project",
        },
        orderBy: { updatedAt: "desc" },
      });

      return NextResponse.json({
        success: true,
        projects: projects.map((project) => ({
          id: project.id,
          name: project.title,
          description: (project.metadata as any)?.description || "",
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Get builder projects error:", error);
      return NextResponse.json(
        { error: "Failed to get builder projects" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { name, description } = body;

      if (!name) {
        return NextResponse.json(
          { error: "Project name is required" },
          { status: 400 }
        );
      }

      const project = await db.content.create({
        data: {
          title: name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          type: "builder_project",
          content: JSON.stringify({
            pages: [],
            globalStyles: {},
            settings: {},
          }),
          metadata: {
            description: description || "",
          },
          tenantId: req.user!.tenantId,
          authorId: req.user!.userId,
        },
      });

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          name: project.title,
          description: (project.metadata as any)?.description || "",
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
      });
    } catch (error) {
      console.error("Create builder project error:", error);
      return NextResponse.json(
        { error: "Failed to create builder project" },
        { status: 500 }
      );
    }
  });
}
