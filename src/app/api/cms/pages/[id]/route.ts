import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db/client";
import { ContentService } from "@/lib/cms/content";

const contentService = new ContentService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  return withAuth(request, async (req) => {
    try {
      const page = await db.content.findFirst({
        where: {
          id: resolvedParams.id,
          tenantId: req.user!.tenantId,
          type: "cms_page",
        },
      });

      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      const content = JSON.parse(page.content);

      return NextResponse.json({
        success: true,
        page: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          description: (page.metadata as any)?.description || "",
          content: content.content,
          status: content.status,
          publishedAt: content.publishedAt,
          authorId: page.authorId,
          tags: content.tags || [],
          category: content.category,
          seo: content.seo,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        },
      });
    } catch (error) {
      console.error("Get CMS page error:", error);
      return NextResponse.json(
        { error: "Failed to get CMS page" },
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
      const { title, slug, description, content, status, tags, category, seo } =
        body;

      // Validate content if provided
      if (content) {
        const validation = await contentService.validateContent(content);
        if (!validation.valid) {
          return NextResponse.json(
            { error: "Invalid content", details: validation.errors },
            { status: 400 }
          );
        }
      }

      const existingPage = await db.content.findFirst({
        where: {
          id: resolvedParams.id,
          tenantId: req.user!.tenantId,
          type: "cms_page",
        },
      });

      if (!existingPage) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }

      const currentContent = JSON.parse(existingPage.content);
      const updatedContent = {
        ...currentContent,
        content: content || currentContent.content,
        status: status || currentContent.status,
        tags: tags || currentContent.tags,
        category: category || currentContent.category,
        seo: seo || currentContent.seo,
        publishedAt:
          status === "published" && currentContent.status !== "published"
            ? new Date().toISOString()
            : currentContent.publishedAt,
      };

      const page = await db.content.update({
        where: { id: resolvedParams.id },
        data: {
          title: title || existingPage.title,
          slug: slug || existingPage.slug,
          content: JSON.stringify(updatedContent),
          metadata: {
            description:
              description || (existingPage.metadata as any)?.description || "",
            tags,
            category,
            seo,
          },
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        page: {
          id: page.id,
          title: page.title,
          slug: page.slug,
          description: (page.metadata as any)?.description || "",
          content: updatedContent.content,
          status: updatedContent.status,
          publishedAt: updatedContent.publishedAt,
          authorId: page.authorId,
          tags: updatedContent.tags,
          category: updatedContent.category,
          seo: updatedContent.seo,
          createdAt: page.createdAt,
          updatedAt: page.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update CMS page error:", error);
      return NextResponse.json(
        { error: "Failed to update CMS page" },
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
        message: "Page deleted successfully",
      });
    } catch (error) {
      console.error("Delete CMS page error:", error);
      return NextResponse.json(
        { error: "Failed to delete CMS page" },
        { status: 500 }
      );
    }
  });
}
