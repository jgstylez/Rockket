import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Default Organization",
      slug: "default",
      domain: "localhost",
      plan: "free",
      status: "active",
      settings: JSON.stringify({
        theme: "dark",
        features: {
          aiGenerator: true,
          visualBuilder: true,
          cms: true,
          ecommerce: true,
          analytics: true,
        },
      }),
    },
  });

  console.log("✅ Created default tenant:", defaultTenant.slug);

  // Create admin user
  const hashedPassword = await hashPassword("admin123");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@rockket.dev" },
    update: {},
    create: {
      email: "admin@rockket.dev",
      name: "Admin User",
      password: hashedPassword,
      role: "owner",
      tenantId: defaultTenant.id,
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  console.log("🎉 Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
