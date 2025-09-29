import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, orderAmount, tenantId, userId } = body;

    if (!code || !tenantId) {
      return NextResponse.json(
        { error: "Code and Tenant ID are required" },
        { status: 400 }
      );
    }

    // Check if it's a discount, coupon, or gift card
    const discount = await prisma.discount.findFirst({
      where: {
        code,
        tenantId,
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] },
          { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
        ],
      },
    });

    const coupon = await prisma.coupon.findFirst({
      where: {
        code,
        tenantId,
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] },
          { OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }] },
        ],
      },
    });

    const giftCard = await prisma.giftCard.findFirst({
      where: {
        code,
        tenantId,
        isActive: true,
        balance: { gt: 0 },
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });

    let validDiscount = null;
    let discountAmount = 0;

    if (discount) {
      // Check usage limits
      if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
        return NextResponse.json(
          { error: "Discount usage limit exceeded" },
          { status: 400 }
        );
      }

      // Check minimum order amount
      if (discount.minAmount && orderAmount < discount.minAmount) {
        return NextResponse.json(
          { error: `Minimum order amount of $${discount.minAmount} required` },
          { status: 400 }
        );
      }

      // Calculate discount amount
      if (discount.type === "percentage") {
        discountAmount = (orderAmount * discount.value) / 100;
        if (discount.maxAmount) {
          discountAmount = Math.min(discountAmount, discount.maxAmount);
        }
      } else if (discount.type === "fixed_amount") {
        discountAmount = Math.min(discount.value, orderAmount);
      } else if (discount.type === "free_shipping") {
        discountAmount = 0; // Free shipping logic would be handled separately
      }

      validDiscount = {
        id: discount.id,
        name: discount.name,
        type: discount.type,
        value: discount.value,
        amount: discountAmount,
        source: "discount",
      };
    } else if (coupon) {
      // Check usage limits
      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { error: "Coupon usage limit exceeded" },
          { status: 400 }
        );
      }

      // Check minimum order amount
      if (coupon.minAmount && orderAmount < coupon.minAmount) {
        return NextResponse.json(
          { error: `Minimum order amount of $${coupon.minAmount} required` },
          { status: 400 }
        );
      }

      // Calculate discount amount
      if (coupon.type === "percentage") {
        discountAmount = (orderAmount * coupon.value) / 100;
        if (coupon.maxAmount) {
          discountAmount = Math.min(discountAmount, coupon.maxAmount);
        }
      } else if (coupon.type === "fixed_amount") {
        discountAmount = Math.min(coupon.value, orderAmount);
      } else if (coupon.type === "free_shipping") {
        discountAmount = 0; // Free shipping logic would be handled separately
      }

      validDiscount = {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        amount: discountAmount,
        source: "coupon",
      };
    } else if (giftCard) {
      discountAmount = Math.min(giftCard.balance, orderAmount);

      validDiscount = {
        id: giftCard.id,
        code: giftCard.code,
        type: "gift_card",
        value: giftCard.balance,
        amount: discountAmount,
        source: "gift_card",
      };
    } else {
      return NextResponse.json(
        { error: "Invalid or expired code" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount: validDiscount,
    });
  } catch (error) {
    console.error("Error validating discount:", error);
    return NextResponse.json(
      { error: "Failed to validate discount" },
      { status: 500 }
    );
  }
}
