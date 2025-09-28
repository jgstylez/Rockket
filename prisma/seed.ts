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
      settings: {
        theme: "dark",
        features: {
          aiGenerator: true,
          visualBuilder: true,
          cms: true,
          ecommerce: true,
          analytics: true,
        },
      },
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
      role: "owner",
      tenantId: defaultTenant.id,
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  // Create feature flags
  const featureFlags = [
    {
      name: "ai_generator",
      description: "AI-powered application generator",
      enabled: true,
      variants: [],
      rules: [],
    },
    {
      name: "visual_builder",
      description: "Drag-and-drop visual builder",
      enabled: true,
      variants: [],
      rules: [],
    },
    {
      name: "cms",
      description: "Content management system",
      enabled: true,
      variants: [],
      rules: [],
    },
    {
      name: "ecommerce",
      description: "E-commerce functionality",
      enabled: true,
      variants: [],
      rules: [],
    },
    {
      name: "analytics",
      description: "Analytics and reporting",
      enabled: true,
      variants: [],
      rules: [],
    },
    {
      name: "beta_features",
      description: "Beta features for testing",
      enabled: false,
      variants: [],
      rules: [],
    },
  ];

  for (const flag of featureFlags) {
    await prisma.featureFlag.upsert({
      where: { name: flag.name },
      update: flag,
      create: flag,
    });
  }

  console.log("✅ Created feature flags");

  // Create sample content
  const sampleContent = await prisma.content.create({
    data: {
      title: "Welcome to Rockket",
      slug: "welcome",
      type: "page",
      status: "published",
      content:
        "# Welcome to Rockket\n\nLaunch your vision with our powerful platform.",
      metadata: {
        seo: {
          title: "Welcome to Rockket",
          description: "Launch your vision with our powerful platform.",
        },
        tags: ["welcome", "getting-started"],
      },
      tenantId: defaultTenant.id,
      authorId: adminUser.id,
      publishedAt: new Date(),
    },
  });

  console.log("✅ Created sample content");

  // Create sample product
  const sampleProduct = await prisma.product.create({
    data: {
      name: "Rockket Pro Plan",
      description: "Professional plan with advanced features",
      price: 97.0,
      currency: "USD",
      sku: "PRO-001",
      inventory: 1000,
      images: [
        {
          url: "/images/pro-plan.png",
          alt: "Pro Plan",
        },
      ],
      variants: [
        {
          name: "Monthly",
          price: 97.0,
          sku: "PRO-MONTHLY",
        },
        {
          name: "Yearly",
          price: 970.0,
          sku: "PRO-YEARLY",
        },
      ],
      tenantId: defaultTenant.id,
    },
  });

  console.log("✅ Created sample product");

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
