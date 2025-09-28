import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  getVerticalPacks,
  getIndustries,
} from "@/lib/vertical-packs/industries";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const industry = searchParams.get("industry");

      let packs = getVerticalPacks();

      if (industry) {
        packs = packs.filter((pack) => pack.industry === industry);
      }

      return NextResponse.json({
        success: true,
        packs,
        industries: getIndustries(),
      });
    } catch (error) {
      console.error("Get vertical packs error:", error);
      return NextResponse.json(
        { error: "Failed to get vertical packs" },
        { status: 500 }
      );
    }
  });
}
