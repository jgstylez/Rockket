import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId");

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const where: any = { tenantId };
    if (userId) {
      where.userId = userId;
    }

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            interval: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planId, tenantId, stripeCustomerId } = body;

    if (!userId || !planId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the plan
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Create or get Stripe customer
    let customerId = stripeCustomerId;
    if (!customerId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId,
          tenantId,
        },
      });

      customerId = customer.id;
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: plan.stripePriceId!,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    // Create local subscription record
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        tenantId,
        stripeSubscriptionId: stripeSubscription.id,
        stripeCustomerId: customerId,
        status: "incomplete",
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        plan: {
          select: {
            id: true,
            name: true,
            price: true,
            currency: true,
            interval: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        subscription,
        clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent
          ?.client_secret,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
