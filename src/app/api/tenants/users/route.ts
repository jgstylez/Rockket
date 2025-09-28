import { NextRequest, NextResponse } from "next/server";
import { withAuth, requireRole } from "@/lib/auth/middleware";
import {
  getTenantUsers,
  addUserToTenant,
  removeUserFromTenant,
} from "@/lib/db/tenant";
import { createUser } from "@/lib/db/user";

export async function GET(request: NextRequest) {
  return withAuth(request, requireRole(["admin", "owner"]), async (req) => {
    try {
      const users = await getTenantUsers(req.user!.tenantId);

      return NextResponse.json({
        success: true,
        users: users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      });
    } catch (error) {
      console.error("Get tenant users error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, requireRole(["admin", "owner"]), async (req) => {
    try {
      const body = await request.json();
      const { email, name, role = "member" } = body;

      if (!email || !name) {
        return NextResponse.json(
          { error: "Email and name are required" },
          { status: 400 }
        );
      }

      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-12) + "!A1";

      const user = await createUser({
        email,
        name,
        password: tempPassword,
        tenantId: req.user!.tenantId,
        role,
      });

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tempPassword, // In production, send this via email
        },
      });
    } catch (error) {
      console.error("Add user error:", error);

      if (
        error instanceof Error &&
        error.message.includes("Unique constraint")
      ) {
        return NextResponse.json(
          { error: "User with this email already exists" },
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

export async function DELETE(request: NextRequest) {
  return withAuth(request, requireRole(["owner"]), async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get("userId");

      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      await removeUserFromTenant(req.user!.tenantId, userId);

      return NextResponse.json({
        success: true,
        message: "User removed successfully",
      });
    } catch (error) {
      console.error("Remove user error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
