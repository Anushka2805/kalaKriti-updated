import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------------- CREATE PRODUCT (ARTISAN) ---------------- */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, description, price, basePrice, artisanId, images } = body;

    if (!name || !price || !artisanId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        basePrice: basePrice ? Number(basePrice) : null,
        artisanId,
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

/* ---------------- GET PRODUCTS ---------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const artisanId = searchParams.get("artisanId");

    /* 🔹 ARTISAN VIEW */
    if (artisanId) {
      const products = await prisma.product.findMany({
        where: { artisanId },
        include: { images: true },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(products);
    }

    /* 🔹 BUYER VIEW (ALL PRODUCTS) */
    const products = await prisma.product.findMany({
      include: {
        images: true,
        artisan: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
