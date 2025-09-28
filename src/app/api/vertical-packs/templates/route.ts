import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  getIndustryTemplates,
  INDUSTRY_TEMPLATES,
} from "@/lib/vertical-packs/industries";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const industry = searchParams.get("industry");
      const category = searchParams.get("category");
      const complexity = searchParams.get("complexity");

      let templates = INDUSTRY_TEMPLATES;

      if (industry) {
        templates = getIndustryTemplates(industry);
      }

      if (category) {
        templates = templates.filter(
          (template) => template.category === category
        );
      }

      if (complexity) {
        templates = templates.filter(
          (template) => template.complexity === complexity
        );
      }

      return NextResponse.json({
        success: true,
        templates,
      });
    } catch (error) {
      console.error("Get industry templates error:", error);
      return NextResponse.json(
        { error: "Failed to get industry templates" },
        { status: 500 }
      );
    }
  });
}
