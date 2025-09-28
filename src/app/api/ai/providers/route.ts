import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { AIGenerationService } from "@/lib/ai/providers";

const aiService = new AIGenerationService();

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const providers = aiService.getAvailableProviders();

      return NextResponse.json({
        success: true,
        providers,
      });
    } catch (error) {
      console.error("Get providers error:", error);
      return NextResponse.json(
        { error: "Failed to get AI providers" },
        { status: 500 }
      );
    }
  });
}
