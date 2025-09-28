import { NextRequest, NextResponse } from "next/server";
import { medusaClient } from "@/lib/ecommerce/medusa-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "products";
    const filters = searchParams.get("filters")
      ? JSON.parse(searchParams.get("filters")!)
      : {};

    let data;
    switch (type) {
      case "products":
        data = await medusaClient.getProducts(filters);
        break;
      case "orders":
        data = await medusaClient.getOrders(filters);
        break;
      case "customers":
        data = await medusaClient.getCustomers(filters);
        break;
      case "regions":
        data = await medusaClient.getRegions();
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;
    switch (type) {
      case "product":
        result = await medusaClient.createProduct(data);
        break;
      case "order":
        result = await medusaClient.createOrder(data);
        break;
      case "customer":
        result = await medusaClient.createCustomer(data);
        break;
      case "cart":
        result = await medusaClient.createCart(data);
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
