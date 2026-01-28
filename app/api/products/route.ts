import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

/* ---------- CREATE PRODUCT ---------- */
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
        isActive: true, // ✅ NEW product always active
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

/* ---------- GET ALL PRODUCTS (BUYER MARKETPLACE) ---------- */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true, // 🔥 THIS IS THE FIX
      },
      include: {
        images: {
          select: { url: true },
        },
        artisan: {
          select: { fullName: true },
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
