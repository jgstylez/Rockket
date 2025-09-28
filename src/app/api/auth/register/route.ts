import { NextRequest, NextResponse } from "next/server";
import { createToken, setAuthCookie } from "@/lib/auth/jwt";
import { createUser } from "@/lib/db/user";
import { createTenant } from "@/lib/db/tenant";
import { validatePassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, company } = body;

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name are required" },
        { status: 400 }
      );
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password validation failed",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Create tenant slug from company name or email
    const tenantSlug = company
      ? company.toLowerCase().replace(/[^a-z0-9]/g, "-")
      : email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-");

    // Create tenant and user
    const tenant = await createTenant({
      name: company || `${name}'s Organization`,
      slug: tenantSlug,
      ownerEmail: email,
      ownerName: name,
      ownerPassword: password,
    });

    // Create JWT token
    const token = await createToken({
      userId: tenant.users[0].id,
      tenantId: tenant.id,
      email: tenant.users[0].email,
      role: tenant.users[0].role,
    });

    // Set auth cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: tenant.users[0].id,
        email: tenant.users[0].email,
        name: tenant.users[0].name,
        role: tenant.users[0].role,
        tenantId: tenant.id,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Email or organization already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
