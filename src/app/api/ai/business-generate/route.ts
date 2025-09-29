import { NextResponse } from "next/server";
import { BusinessComponentFactory } from "@/lib/builder/business-components";
import { BusinessLogicBuilder } from "@/lib/builder/business-logic";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      type,
      name,
      description,
      industry,
      features,
      integrations,
      deployment,
    } = data;

    // Initialize business logic builder
    const businessLogicBuilder = new BusinessLogicBuilder();

    // Get pre-built business logic based on type
    let businessLogic;
    switch (type) {
      case "ecommerce":
        businessLogic = businessLogicBuilder.getEcommerceLogic();
        break;
      case "saas":
        businessLogic = businessLogicBuilder.getSaaSLogic();
        break;
      case "content":
        businessLogic = businessLogicBuilder.getContentLogic();
        break;
      default:
        businessLogic = { rules: [], workflows: [] };
    }

    // Create form fields based on features
    const formFields = features.map((feature: string) => ({
      id: feature.toLowerCase().replace(/\s+/g, "_"),
      name: feature.toLowerCase().replace(/\s+/g, "_"),
      type: "text",
      label: feature,
      placeholder: `Enter ${feature.toLowerCase()}`,
      required: true,
      validation: [
        {
          id: `${feature.toLowerCase()}_required`,
          field: feature.toLowerCase().replace(/\s+/g, "_"),
          type: "required",
          message: `${feature} is required`,
        },
      ],
      businessLogic: {
        rules: [],
        workflows: [],
      },
    }));

    // Create business form component
    const businessForm = BusinessComponentFactory.createBusinessForm({
      fields: formFields,
      submitAction: "process_form",
      businessRules: businessLogic.rules,
      workflows: businessLogic.workflows,
    });

    // Create workflow component
    const businessWorkflow = BusinessComponentFactory.createBusinessWorkflow({
      workflow: {
        id: "main_workflow",
        name: "Main Workflow",
        description: "Main business process workflow",
        trigger: "form_submit",
        steps: [
          {
            id: "validate_input",
            type: "condition",
            name: "Validate Input",
            config: { condition: "form.isValid" },
          },
          {
            id: "process_data",
            type: "action",
            name: "Process Data",
            config: { action: "process_data" },
          },
          {
            id: "notify_user",
            type: "notification",
            name: "Notify User",
            config: { type: "email", template: "success" },
          },
        ],
        conditions: [],
        enabled: true,
      },
      triggers: ["form_submit", "data_update"],
      conditions: [],
    });

    // Create checkout component if ecommerce
    const businessCheckout =
      type === "ecommerce"
        ? BusinessComponentFactory.createBusinessCheckout({
            paymentMethods: ["stripe", "paypal"],
            shippingOptions: [
              {
                id: "standard",
                name: "Standard Shipping",
                cost: 5.99,
                conditions: ["order_total > 50"],
              },
            ],
            businessRules: businessLogic.rules,
          })
        : null;

    // Generate application structure
    const application = {
      name,
      description,
      industry,
      techStack: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Prisma",
        "PostgreSQL",
        ...integrations,
      ],
      features,
      architecture: {
        frontend: "Next.js with TypeScript",
        backend: "Next.js API Routes",
        database: "PostgreSQL with Prisma",
        deployment: deployment || "Vercel",
      },
      code: {
        frontend: "// Generated frontend code will be here",
        backend: "// Generated backend code will be here",
        database: "// Generated database schema will be here",
        configuration: "// Generated configuration will be here",
      },
      integrations: {
        payments: integrations.includes("Stripe") ? "Stripe" : "None",
        cms: integrations.includes("Contentful") ? "Contentful" : "None",
        auth: integrations.includes("Auth0") ? "Auth0" : "NextAuth.js",
        analytics: integrations.includes("Google Analytics")
          ? "Google Analytics"
          : "None",
      },
      deployment: {
        instructions: `
1. Set up environment variables
2. Install dependencies: npm install
3. Run database migrations: npx prisma migrate deploy
4. Build the application: npm run build
5. Deploy to ${deployment || "Vercel"}
        `.trim(),
        environment: deployment || "Vercel",
        secrets: [
          "DATABASE_URL",
          "NEXTAUTH_SECRET",
          ...(integrations.includes("Stripe") ? ["STRIPE_SECRET_KEY"] : []),
          ...(integrations.includes("Auth0")
            ? ["AUTH0_SECRET", "AUTH0_BASE_URL", "AUTH0_ISSUER_BASE_URL"]
            : []),
        ],
      },
      businessLogic: {
        workflows: businessLogic.workflows,
        rules: businessLogic.rules,
        automations: [
          "Form validation",
          "Data processing",
          "User notifications",
          ...(type === "ecommerce"
            ? ["Inventory management", "Order processing"]
            : []),
        ],
      },
      components: {
        businessForm,
        businessWorkflow,
        ...(businessCheckout && { businessCheckout }),
      },
    };

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Business generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate application",
      },
      { status: 500 }
    );
  }
}
