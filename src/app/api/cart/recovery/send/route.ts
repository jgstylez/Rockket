import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenantId, emailType, delayHours } = body;

    if (!tenantId) {
      return NextResponse.json(
        { error: "Tenant ID is required" },
        { status: 400 }
      );
    }

    // Find abandoned carts that need recovery emails
    const cutoffTime = new Date();
    if (delayHours) {
      cutoffTime.setHours(cutoffTime.getHours() - delayHours);
    }

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: {
        tenantId,
        status: "abandoned",
        lastActivity: { lte: cutoffTime },
        OR: [{ email: { not: null } }, { user: { isNot: null } }],
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        emails: {
          where: {
            emailType,
            status: { not: "sent" },
          },
        },
      },
    });

    const emailsToSend = [];

    for (const cart of abandonedCarts) {
      // Skip if already sent this type of email
      if (cart.emails.length > 0) {
        continue;
      }

      const email = cart.email || cart.user?.email;
      if (!email) continue;

      // Generate discount code if this is a discount offer email
      let discountCode = null;
      if (emailType === "discount_offer") {
        // Create a 10% discount coupon
        const coupon = await prisma.coupon.create({
          data: {
            code: `CART${Date.now()}`,
            type: "percentage",
            value: 10,
            isActive: true,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            tenantId,
          },
        });
        discountCode = coupon.code;
      }

      // Create recovery email
      const recoveryEmail = await prisma.cartRecoveryEmail.create({
        data: {
          abandonedCartId: cart.id,
          emailType,
          subject: getEmailSubject(emailType, cart.total),
          content: getEmailContent(emailType, cart, discountCode),
          discountCode,
          tenantId,
        },
      });

      emailsToSend.push({
        id: recoveryEmail.id,
        email,
        subject: recoveryEmail.subject,
        content: recoveryEmail.content,
        cartId: cart.id,
      });
    }

    // In a real implementation, you would send emails here
    // For now, we'll just mark them as sent
    if (emailsToSend.length > 0) {
      await prisma.cartRecoveryEmail.updateMany({
        where: {
          id: { in: emailsToSend.map((e) => e.id) },
        },
        data: {
          status: "sent",
          sentAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      message: `Scheduled ${emailsToSend.length} recovery emails`,
      emails: emailsToSend,
    });
  } catch (error) {
    console.error("Error sending recovery emails:", error);
    return NextResponse.json(
      { error: "Failed to send recovery emails" },
      { status: 500 }
    );
  }
}

function getEmailSubject(emailType: string, total: number) {
  switch (emailType) {
    case "first_reminder":
      return "You left items in your cart";
    case "second_reminder":
      return "Don't miss out on your items";
    case "final_reminder":
      return "Last chance to complete your purchase";
    case "discount_offer":
      return `Complete your $${total.toFixed(2)} order with 10% off`;
    default:
      return "Complete your purchase";
  }
}

function getEmailContent(
  emailType: string,
  cart: any,
  discountCode: string | null
) {
  const items = Array.isArray(cart.items) ? cart.items : [];
  const itemList = items
    .map((item: any) => `- ${item.name} ($${item.price})`)
    .join("\n");

  let content = `Hi there,\n\n`;
  content += `You left some items in your cart:\n\n${itemList}\n\n`;
  content += `Total: $${cart.total.toFixed(2)}\n\n`;

  switch (emailType) {
    case "first_reminder":
      content += `Don't forget to complete your purchase! Your items are waiting for you.\n\n`;
      break;
    case "second_reminder":
      content += `Your items are still in your cart. Complete your purchase now before they're gone!\n\n`;
      break;
    case "final_reminder":
      content += `This is your final reminder. Complete your purchase now or your cart will be cleared.\n\n`;
      break;
    case "discount_offer":
      content += `Complete your purchase now and save 10% with code: ${discountCode}\n\n`;
      break;
  }

  content += `Click here to complete your purchase: [CART_LINK]\n\n`;
  content += `Best regards,\nThe Team`;

  return content;
}
