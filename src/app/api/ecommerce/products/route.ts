import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/middleware";
import { db } from "@/lib/db/client";
import { ProductService } from "@/lib/ecommerce/products";

const productService = new ProductService();

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      const search = searchParams.get("search");
      const limit = parseInt(searchParams.get("limit") || "20");

      const where: any = {
        tenantId: req.user!.tenantId,
        type: "ecommerce_product",
      };

      if (status) {
        where.content = {
          path: ["status"],
          equals: status,
        };
      }

      const products = await db.content.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: limit,
      });

      return NextResponse.json({
        success: true,
        products: products.map((product) => {
          const content = JSON.parse(product.content);
          return {
            id: product.id,
            name: product.title,
            description: (product.metadata as any)?.description || "",
            slug: product.slug,
            sku: content.sku,
            price: content.price,
            comparePrice: content.comparePrice,
            cost: content.cost,
            status: content.status,
            inventory: content.inventory,
            images: content.images || [],
            variants: content.variants || [],
            categories: content.categories || [],
            tags: content.tags || [],
            seo: content.seo || {},
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          };
        }),
      });
    } catch (error) {
      console.error("Get e-commerce products error:", error);
      return NextResponse.json(
        { error: "Failed to get products" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json();
      const {
        name,
        description,
        price,
        sku,
        comparePrice,
        cost,
        categories,
        tags,
        images,
        variants,
        seo,
      } = body;

      if (!name || !description || price === undefined) {
        return NextResponse.json(
          { error: "Name, description, and price are required" },
          { status: 400 }
        );
      }

      const product = await productService.createProduct(
        name,
        description,
        price,
        req.user!.tenantId,
        {
          sku,
          comparePrice,
          cost,
          categories,
          tags,
          images,
          variants,
        }
      );

      // Save to database
      const savedProduct = await db.content.create({
        data: {
          title: product.name,
          slug: product.slug,
          type: "ecommerce_product",
          metadata: {
            description: product.description || "",
          },
          content: JSON.stringify({
            sku: product.sku,
            price: product.price,
            comparePrice: product.comparePrice,
            cost: product.cost,
            status: product.status,
            inventory: product.inventory,
            images: product.images,
            variants: product.variants,
            categories: product.categories,
            tags: product.tags,
            seo: product.seo,
          }),
          tenantId: req.user!.tenantId,
          authorId: req.user!.userId,
        },
      });

      return NextResponse.json({
        success: true,
        product: {
          id: savedProduct.id,
          name: product.name,
          description: product.description || "",
          slug: product.slug,
          sku: product.sku,
          price: product.price,
          comparePrice: product.comparePrice,
          cost: product.cost,
          status: product.status,
          inventory: product.inventory,
          images: product.images,
          variants: product.variants,
          categories: product.categories,
          tags: product.tags,
          seo: product.seo,
          createdAt: savedProduct.createdAt,
          updatedAt: savedProduct.updatedAt,
        },
      });
    } catch (error) {
      console.error("Create e-commerce product error:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 }
      );
    }
  });
}
