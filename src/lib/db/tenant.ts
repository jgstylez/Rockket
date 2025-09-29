import { db } from "./client";
import { type Tenant, type User } from "@/types";
import { hashPassword } from "@/lib/auth/password";

export async function createTenant(data: {
  name: string;
  slug: string;
  domain?: string;
  ownerEmail: string;
  ownerName: string;
  ownerPassword: string;
}) {
  const hashedPassword = await hashPassword(data.ownerPassword);

  return db.tenant.create({
    data: {
      name: data.name,
      slug: data.slug,
      domain: data.domain,
      users: {
        create: {
          email: data.ownerEmail,
          name: data.ownerName,
          password: hashedPassword,
          role: "owner",
        },
      },
    },
    include: {
      users: true,
    },
  });
}

export async function getTenantBySlug(slug: string) {
  return db.tenant.findUnique({
    where: { slug },
    include: {
      users: true,
    },
  });
}

export async function getTenantById(id: string) {
  return db.tenant.findUnique({
    where: { id },
    include: {
      users: true,
    },
  });
}

export async function updateTenantSettings(tenantId: string, settings: any) {
  return db.tenant.update({
    where: { id: tenantId },
    data: { settings },
  });
}

export async function getTenantUsers(tenantId: string) {
  return db.user.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function addUserToTenant(
  tenantId: string,
  userData: {
    email: string;
    name: string;
    role: string;
  }
) {
  return db.user.create({
    data: {
      ...userData,
      tenantId,
    },
  });
}

export async function removeUserFromTenant(tenantId: string, userId: string) {
  return db.user.delete({
    where: {
      id: userId,
      tenantId,
    },
  });
}
