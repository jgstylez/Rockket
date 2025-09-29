/*
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedFeatureFlags() {
  console.log("🌱 Seeding feature flags...");

  const featureFlags = [
    {
      name: "ai-generator",
      description: "AI-powered application generator",
      enabled: true,
      variants: [
        { id: "control", name: "Control", value: true, weight: 50 },
        { id: "enhanced", name: "Enhanced", value: true, weight: 50 },
      ],
      rules: [
        {
          id: "beta-users",
          condition: 'tenantId == "beta"',
          variant: "enhanced",
          weight: 100,
        },
      ],
    },
    {
      name: "visual-builder",
      description: "Visual drag-and-drop builder",
      enabled: false,
      variants: [{ id: "control", name: "Control", value: false, weight: 100 }],
      rules: [],
    },
    {
      name: "cms",
      description: "Content Management System",
      enabled: false,
      variants: [{ id: "control", name: "Control", value: false, weight: 100 }],
      rules: [],
    },
    {
      name: "ecommerce",
      description: "E-commerce functionality",
      enabled: false,
      variants: [{ id: "control", name: "Control", value: false, weight: 100 }],
      rules: [],
    },
    {
      name: "analytics",
      description: "Advanced analytics dashboard",
      enabled: true,
      variants: [
        { id: "basic", name: "Basic", value: true, weight: 70 },
        { id: "advanced", name: "Advanced", value: true, weight: 30 },
      ],
      rules: [
        {
          id: "enterprise",
          condition: 'tenantId == "enterprise"',
          variant: "advanced",
          weight: 100,
        },
      ],
    },
    {
      name: "billing",
      description: "Billing and subscription management",
      enabled: false,
      variants: [{ id: "control", name: "Control", value: false, weight: 100 }],
      rules: [],
    },
    {
      name: "multi-tenant",
      description: "Multi-tenant architecture",
      enabled: true,
      variants: [{ id: "control", name: "Control", value: true, weight: 100 }],
      rules: [],
    },
    {
      name: "progressive-onboarding",
      description: "Progressive onboarding flow",
      enabled: true,
      variants: [
        { id: "standard", name: "Standard", value: true, weight: 60 },
        { id: "guided", name: "Guided", value: true, weight: 40 },
      ],
      rules: [
        {
          id: "new-users",
          condition: 'userId == "new"',
          variant: "guided",
          weight: 100,
        },
      ],
    },
  ];

  for (const flag of featureFlags) {
    try {
      await prisma.featureFlag.upsert({
        where: { name: flag.name },
        update: {
          description: flag.description,
          enabled: flag.enabled,
          variants: JSON.stringify(flag.variants),
          rules: JSON.stringify(flag.rules),
        },
        create: {
          name: flag.name,
          description: flag.description,
          enabled: flag.enabled,
          variants: JSON.stringify(flag.variants),
          rules: JSON.stringify(flag.rules),
        },
      });
      console.log(`✅ Created/updated feature flag: ${flag.name}`);
    } catch (error) {
      console.error(`❌ Failed to create feature flag ${flag.name}:`, error);
    }
  }

  console.log("🎉 Feature flags seeded successfully!");
}

seedFeatureFlags()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
*/
