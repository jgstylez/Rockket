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

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID required" },
        { status: 400 }
      );
    }

    const plans = await prisma.subscriptionPlan.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, currency, interval, features, tenantId } =
      body;

    if (!name || !price || !interval || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Stripe product
    const stripeProduct = await stripe.products.create({
      name,
      description,
    });

    // Create Stripe price
    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100), // Convert to cents
      currency: currency || "usd",
      recurring: {
        interval: interval === "month" ? "month" : "year",
      },
      product: stripeProduct.id,
    });

    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        description,
        price,
        currency: currency || "USD",
        interval,
        features: features || [],
        tenantId,
        stripePriceId: stripePrice.id,
        isActive: true,
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
