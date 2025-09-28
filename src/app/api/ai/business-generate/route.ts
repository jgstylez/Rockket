import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import {
  BusinessApplicationGenerator,
  BusinessRequirements,
} from "@/lib/ai/business-generator";

const businessGenerator = new BusinessApplicationGenerator();

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const {
        type = "custom",
        requirements,
        industry,
        features = [],
        userTypes = [],
        paymentRequired = false,
        contentManagement = false,
        userAccounts = false,
        integrations = [],
        deployment = "cloudflare",
      } = body;

      let businessApp;

      switch (type) {
        case "ecommerce":
          businessApp = await businessGenerator.generateEcommerceApp({
            name: requirements?.name,
            description: requirements?.description,
            industry,
            features,
            userTypes,
            integrations,
            deployment,
          });
          break;

        case "saas":
          businessApp = await businessGenerator.generateSaaSApp({
            name: requirements?.name,
            description: requirements?.description,
            industry,
            features,
            userTypes,
            integrations,
            deployment,
          });
          break;

        case "content":
          businessApp = await businessGenerator.generateContentApp({
            name: requirements?.name,
            description: requirements?.description,
            industry,
            features,
            userTypes,
            integrations,
            deployment,
          });
          break;

        case "custom":
        default:
          const customRequirements: BusinessRequirements = {
            name: requirements?.name || "Custom Business Application",
            description:
              requirements?.description || "AI-generated business application",
            industry: industry || "General",
            features: features.length > 0 ? features : ["Basic functionality"],
            userTypes: userTypes.length > 0 ? userTypes : ["Users", "Admins"],
            paymentRequired,
            contentManagement,
            userAccounts,
            integrations:
              integrations.length > 0 ? integrations : ["Basic integrations"],
            deployment: deployment as
              | "cloudflare"
              | "vercel"
              | "aws"
              | "docker",
          };

          businessApp =
            await businessGenerator.generateBusinessApp(customRequirements);
          break;
      }

      return NextResponse.json({
        success: true,
        application: businessApp,
        metadata: {
          generatedAt: new Date().toISOString(),
          userId: req.user!.userId,
          tenantId: req.user!.tenantId,
          type,
          industry,
          features: businessApp.features.length,
          integrations: businessApp.integrations,
        },
      });
    } catch (error) {
      console.error("Business application generation error:", error);
      return NextResponse.json(
        {
          error: "Failed to generate business application",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  });
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      // Return available business application types and templates
      const businessTypes = [
        {
          id: "ecommerce",
          name: "E-commerce Store",
          description:
            "Complete online store with payments, inventory, and customer management",
          features: [
            "Product catalog",
            "Shopping cart",
            "Payment processing",
            "Order management",
            "Customer accounts",
            "Admin dashboard",
          ],
          integrations: ["Stripe", "Email", "Analytics", "Inventory"],
          estimatedTime: "2-4 hours",
        },
        {
          id: "saas",
          name: "SaaS Application",
          description:
            "Software as a Service platform with subscriptions and multi-tenancy",
          features: [
            "User management",
            "Subscription billing",
            "Multi-tenancy",
            "API access",
            "Dashboard",
            "Analytics",
          ],
          integrations: ["Stripe", "Auth0", "Analytics", "Email"],
          estimatedTime: "4-6 hours",
        },
        {
          id: "content",
          name: "Content Platform",
          description:
            "Content management and publishing platform with SEO and analytics",
          features: [
            "Content creation",
            "Publishing workflow",
            "SEO optimization",
            "Analytics",
            "Media management",
            "Search",
          ],
          integrations: ["CMS", "Analytics", "Search", "Email"],
          estimatedTime: "2-3 hours",
        },
        {
          id: "custom",
          name: "Custom Application",
          description:
            "Tailored business application based on your specific requirements",
          features: ["Custom features based on requirements"],
          integrations: ["Custom integrations"],
          estimatedTime: "3-8 hours",
        },
      ];

      return NextResponse.json({
        success: true,
        businessTypes,
        metadata: {
          totalTypes: businessTypes.length,
          supportedIndustries: [
            "Retail",
            "Technology",
            "Healthcare",
            "Finance",
            "Education",
            "Media",
            "Real Estate",
            "Manufacturing",
            "Services",
            "Non-profit",
          ],
          supportedIntegrations: [
            "Stripe",
            "PayPal",
            "Auth0",
            "Firebase",
            "SendGrid",
            "Twilio",
            "Google Analytics",
            "Mixpanel",
            "Intercom",
            "Zapier",
          ],
        },
      });
    } catch (error) {
      console.error("Business types fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch business application types" },
        { status: 500 }
      );
    }
  });
}
