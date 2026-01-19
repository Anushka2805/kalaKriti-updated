import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* ---------------- CREATE PRODUCT (ARTISAN) ---------------- */
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || role !== "ARTISAN") {
      return NextResponse.json(
        { error: "Not logged in as artisan" },
        { status: 401 }
      );
    }

    const { name, description, price, basePrice, images } = await req.json();

    if (!name || !price) {
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
        artisanId: userId, // ✅ SAME ID USED EVERYWHERE
        images: {
          create: (images || []).map((url: string) => ({ url })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/artisan/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

/* ---------------- GET PRODUCTS (ARTISAN) ---------------- */
export async function GET() {
  const userId = cookies().get("userId")?.value;
  const role = cookies().get("role")?.value;

  if (!userId || role !== "ARTISAN") {
    return NextResponse.json([], { status: 200 });
  }

  const products = await prisma.product.findMany({
    where: { artisanId: userId },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
    