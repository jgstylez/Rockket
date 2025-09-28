import { NextRequest, NextResponse } from "next/server";
import { medusaClient } from "@/lib/ecommerce/medusa-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "product";

    let data;
    switch (type) {
      case "product":
        data = await medusaClient.getProduct(resolvedParams.id);
        break;
      case "order":
        data = await medusaClient.getOrder(resolvedParams.id);
        break;
      case "customer":
        data = await medusaClient.getCustomer(resolvedParams.id);
        break;
      case "cart":
        data = await medusaClient.getCart(resolvedParams.id);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("E-commerce API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;
    switch (type) {
      case "product":
        result = await medusaClient.updateProduct(resolvedParams.id, data);
        break;
      case "order":
        result = await medusaClient.updateOrder(resolvedParams.id, data);
        break;
      case "customer":
        result = await medusaClient.updateCustomer(resolvedParams.id, data);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("E-commerce API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "product";

    let result;
    switch (type) {
      case "product":
        result = await medusaClient.deleteProduct(resolvedParams.id);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("E-commerce API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
