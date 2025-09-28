import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  APP_TEMPLATES,
  getTemplatesByCategory,
  getTemplatesByComplexity,
  getCategories,
} from "@/lib/ai/templates";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get("category");
      const complexity = searchParams.get("complexity");

      let templates = APP_TEMPLATES;

      if (category) {
        templates = getTemplatesByCategory(category);
      }

      if (complexity) {
        templates = templates.filter(
          (template) => template.complexity === complexity
        );
      }

      return NextResponse.json({
        success: true,
        templates,
        categories: getCategories(),
      });
    } catch (error) {
      console.error("Get templates error:", error);
      return NextResponse.json(
        { error: "Failed to get templates" },
        { status: 500 }
      );
    }
  });
}
