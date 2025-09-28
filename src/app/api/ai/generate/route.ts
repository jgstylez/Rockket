import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { AIGenerationService } from "@/lib/ai/providers";
import { getTemplateById } from "@/lib/ai/templates";

const aiService = new AIGenerationService();

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const { prompt, templateId, provider = "openai", context = {} } = body;

      if (!prompt && !templateId) {
        return NextResponse.json(
          { error: "Either prompt or templateId is required" },
          { status: 400 }
        );
      }

      let finalPrompt = prompt;

      // If templateId is provided, use the template's prompt
      if (templateId) {
        const template = getTemplateById(templateId);
        if (!template) {
          return NextResponse.json(
            { error: "Template not found" },
            { status: 404 }
          );
        }
        finalPrompt = template.prompt;
      }

      // Add user context
      const enhancedContext = {
        ...context,
        userId: req.user!.userId,
        tenantId: req.user!.tenantId,
        userRole: req.user!.role,
      };

      const result = await aiService.generateApp(
        finalPrompt,
        provider,
        enhancedContext
      );

      return NextResponse.json({
        success: true,
        result,
      });
    } catch (error) {
      console.error("AI generation error:", error);
      return NextResponse.json(
        { error: "Failed to generate application" },
        { status: 500 }
      );
    }
  });
}
