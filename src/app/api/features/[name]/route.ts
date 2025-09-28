import { NextRequest, NextResponse } from "next/server";
import { withAuth, withAuthAndRole } from "@/lib/auth/middleware";
import {
  getFeatureFlag,
  updateFeatureFlag,
  deleteFeatureFlag,
} from "@/lib/features/feature-flags";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const resolvedParams = await params;
  return withAuth(request, async (req) => {
    try {
      const flag = await getFeatureFlag(resolvedParams.name);

      if (!flag) {
        return NextResponse.json(
          { error: "Feature flag not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        flag,
      });
    } catch (error) {
      console.error("Get feature flag error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const resolvedParams = await params;
  return withAuthAndRole(request, ["admin", "owner"], async (req) => {
    try {
      const body = await request.json();
      const { description, enabled, variants, rules } = body;

      const flag = await updateFeatureFlag(resolvedParams.name, {
        description,
        enabled,
        variants,
        rules,
      });

      if (!flag) {
        return NextResponse.json(
          { error: "Feature flag not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        flag,
      });
    } catch (error) {
      console.error("Update feature flag error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const resolvedParams = await params;
  return withAuthAndRole(request, ["owner"], async (req) => {
    try {
      const success = await deleteFeatureFlag(resolvedParams.name);

      if (!success) {
        return NextResponse.json(
          { error: "Feature flag not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Feature flag deleted successfully",
      });
    } catch (error) {
      console.error("Delete feature flag error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
