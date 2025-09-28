import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db/client";
import { ContentService } from "@/lib/cms/content";

const contentService = new ContentService();

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      const tag = searchParams.get("tag");
      const limit = parseInt(searchParams.get("limit") || "20");

      const where: any = {
        tenantId: req.user!.tenantId,
        type: "cms_page",
      };

      if (status) {
        where.content = {
          path: ["status"],
          equals: status,
        };
      }

      const pages = await db.content.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
      });

      return NextResponse.json({
        success: true,
        pages: pages.map((page) => ({
          id: page.id,
          title: page.title,
          slug: page.slug,
          description: page.description,
          status: JSON.parse(page.content).status,
          publishedAt: JSON.parse(page.content).publishedAt,
          authorId: page.userId,
          tags: JSON.parse(page.content).tags || [],
          category: JSON.parse(page.content).category,
          seo: JSON.parse(page.content).seo,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Get CMS pages error:", error);
      return NextResponse.json(
        { error: "Failed to get CMS pages" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { title, slug, description, content, tags, category, seo } = body;

      if (!title || !slug) {
        return NextResponse.json(
          { error: "Title and slug are required" },
          { status: 400 }
        );
      }

      // Validate content
      const validation = await contentService.validateContent(content || []);
      if (!validation.valid) {
        return NextResponse.json(
          { error: "Invalid content", details: validation.errors },
          { status: 400 }
        );
      }

      const page = await db.content.create({
        data: {
          title,
          slug,
          description: description || "",
          type: "cms_page",
          content: JSON.stringify({
            content: content || [],
            status: "draft",
            tags: tags || [],
            category,
            seo,
          }),
          tenantId: req.user!.tenantId,
          userId: req.user!.userId,
        },
      });

      return NextResponse.json({
        success: true,
        page: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          description: page.description,
          status: "draft",
          authorId: page.userId,
          tags: tags || [],
          category,
          seo,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        },
      });
    } catch (error) {
      console.error("Create CMS page error:", error);
      return NextResponse.json(
        { error: "Failed to create CMS page" },
        { status: 500 }
      );
    }
  });
}
