import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Store webhook event
    await prisma.webhookEvent.create({
      data: {
        stripeId: event.id,
        type: event.type,
        data: JSON.parse(JSON.stringify(event.data)) as any, // Convert to plain object
        tenantId: "default-tenant", // You might want to extract this from metadata
        processed: false,
      },
    });

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionUpdate(event);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCancellation(event);
        break;

      case "invoice.payment_succeeded":
        await handlePaymentSuccess(event);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailure(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

async function handleSubscriptionUpdate(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionCancellation(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;

  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "cancelled",
      cancelledAt: new Date(),
    },
  });
}

async function handlePaymentSuccess(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  if (invoice.subscription) {
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: invoice.subscription as string },
      data: { status: "active" },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        subscriptionId: invoice.subscription as string,
        userId: "user-id", // Extract from metadata
        tenantId: "default-tenant", // Extract from metadata
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: "succeeded",
        stripePaymentIntentId: invoice.payment_intent as string,
        description: `Payment for subscription ${invoice.subscription}`,
      },
    });
  }
}

async function handlePaymentFailure(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;

  if (invoice.subscription) {
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { stripeSubscriptionId: invoice.subscription as string },
      data: { status: "past_due" },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        subscriptionId: invoice.subscription as string,
        userId: "user-id", // Extract from metadata
        tenantId: "default-tenant", // Extract from metadata
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        status: "failed",
        description: `Failed payment for subscription ${invoice.subscription}`,
      },
    });
  }
}
