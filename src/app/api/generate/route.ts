import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { prompt, options = {} } = body;

      if (!prompt || !prompt.trim()) {
        return NextResponse.json(
          { error: "Prompt is required" },
          { status: 400 }
        );
      }

      // Generate a unique ID for this generation
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // For now, we'll simulate the generation process
      // In a real implementation, this would integrate with VibeSDK or other AI services
      const mockGeneration = {
        id: generationId,
        status: "pending",
        progress: 0,
        phase: "Starting generation...",
        result: null,
        error: null,
      };

      // Store the generation in memory (in production, use a database or cache)
      // For now, we'll just return the generation ID

      return NextResponse.json({
        success: true,
        generationId,
        message: "Generation started",
      });
    } catch (error) {
      console.error("Generation error:", error);
      return NextResponse.json(
        { error: "Failed to start generation" },
        { status: 500 }
      );
    }
  });
}
