import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  COMPONENT_LIBRARY,
  getComponentsByCategory,
  getCategories,
} from "@/lib/builder/components";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get("category");

      let components = COMPONENT_LIBRARY;

      if (category) {
        components = getComponentsByCategory(category);
      }

      return NextResponse.json({
        success: true,
        components,
        categories: getCategories(),
      });
    } catch (error) {
      console.error("Get builder components error:", error);
      return NextResponse.json(
        { error: "Failed to get builder components" },
        { status: 500 }
      );
    }
  });
}
