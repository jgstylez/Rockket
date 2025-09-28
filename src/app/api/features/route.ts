import { NextRequest, NextResponse } from "next/server";
import { withAuthAndRole } from "@/lib/auth/middleware";
import {
  getAllFeatureFlags,
  createFeatureFlag,
} from "@/lib/features/feature-flags";

export async function GET(request: NextRequest) {
  return withAuthAndRole(request, ["admin", "owner"], async (req) => {
    try {
      const flags = await getAllFeatureFlags();

      return NextResponse.json({
        success: true,
        flags,
      });
    } catch (error) {
      console.error("Get feature flags error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuthAndRole(request, ["admin", "owner"], async (req) => {
    try {
      const body = await request.json();
      const {
        name,
        description,
        enabled = false,
        variants = [],
        rules = [],
      } = body;

      if (!name || !description) {
        return NextResponse.json(
          { error: "Name and description are required" },
          { status: 400 }
        );
      }

      const flag = await createFeatureFlag({
        name,
        description,
        enabled,
        variants,
        rules,
      });

      return NextResponse.json({
        success: true,
        flag,
      });
    } catch (error) {
      console.error("Create feature flag error:", error);

      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return NextResponse.json(
          { error: "Feature flag with this name already exists" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
