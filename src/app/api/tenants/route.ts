import { NextRequest, NextResponse } from "next/server";
import { withAuth, withAuthAndRole } from "@/lib/auth/middleware";
import { getTenantById, updateTenantSettings } from "@/lib/db/tenant";

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const tenant = await getTenantById(req.user!.tenantId);

      if (!tenant) {
        return NextResponse.json(
          { error: "Tenant not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          domain: tenant.domain,
          settings: JSON.parse(tenant.settings as string),
          plan: tenant.plan,
          status: tenant.status,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        },
      });
    } catch (error) {
      console.error("Get tenant error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAuthAndRole(request, ["admin", "owner"], async (req) => {
    try {
      const body = await request.json();
      const { name, domain, settings } = body;

      const updateData: any = {};
      if (name) updateData.name = name;
      if (domain !== undefined) updateData.domain = domain;
      if (settings) updateData.settings = JSON.stringify(settings);

      const tenant = await updateTenantSettings(req.user!.tenantId, updateData);

      return NextResponse.json({
        success: true,
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
          domain: tenant.domain,
          settings: JSON.parse(tenant.settings as string),
          plan: tenant.plan,
          status: tenant.status,
        },
      });
    } catch (error) {
      console.error("Update tenant error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  });
}
