import { NextRequest, NextResponse } from "next/server";
import { directusClient } from "@/lib/cms/directus-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "pages";
    const filters = searchParams.get("filters")
      ? JSON.parse(searchParams.get("filters")!)
      : {};

    let data;
    switch (type) {
      case "pages":
        data = await directusClient.getContentPages(filters);
        break;
      case "blocks":
        const pageId = searchParams.get("pageId");
        data = await directusClient.getContentBlocks(pageId || undefined);
        break;
      case "media":
        data = await directusClient.getMediaFiles(filters);
        break;
      case "categories":
        data = await directusClient.getCategories();
        break;
      case "tags":
        data = await directusClient.getTags();
        break;
      case "collections":
        data = await directusClient.getCollections();
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let result;
    switch (type) {
      case "page":
        result = await directusClient.createContentPage(data);
        break;
      case "block":
        result = await directusClient.createContentBlock(data);
        break;
      case "media":
        // Handle file upload
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folderId = formData.get("folderId") as string;
        result = await directusClient.uploadMediaFile(file, folderId);
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
