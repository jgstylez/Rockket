import { NextRequest, NextResponse } from "next/server";
import { directusClient } from "@/lib/cms/directus-client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "page";

    let data;
    switch (type) {
      case "page":
        data = await directusClient.getContentPage(resolvedParams.id);
        break;
      case "block":
        data = await directusClient.getContentBlocks(resolvedParams.id);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("CMS API error:", error);
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
      case "page":
        result = await directusClient.updateContentPage(
          resolvedParams.id,
          data
        );
        break;
      case "block":
        result = await directusClient.updateContentBlock(
          resolvedParams.id,
          data
        );
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("CMS API error:", error);
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
    const type = searchParams.get("type") || "page";

    let result;
    switch (type) {
      case "page":
        result = await directusClient.deleteContentPage(resolvedParams.id);
        break;
      case "block":
        result = await directusClient.deleteContentBlock(resolvedParams.id);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("CMS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
