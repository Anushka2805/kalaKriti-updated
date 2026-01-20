import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* ===== AUTH HELPER ===== */
function getArtisanId() {
  const store = cookies();
  const userId = store.get("userId")?.value;
  const role = store.get("role")?.value;
  return role === "ARTISAN" ? userId : null;
}

/* ===== CREATE PRODUCT ===== */
export async function POST(req: Request) {
  try {
    const artisanId = getArtisanId();
    if (!artisanId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, price, basePrice, images } = await req.json();

    if (!name || !price)
      return NextResponse.json(
        { error: "Name & price required" },
        { status: 400 }
      );

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
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

/* ===== GET PRODUCTS (ONLY ACTIVE) ===== */
export async function GET() {
  try {
    const artisanId = getArtisanId();
    if (!artisanId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const products = await prisma.product.findMany({
      where: {
        artisanId,
        isActive: true, // ✅ IMPORTANT
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

/* ===== ARCHIVE PRODUCT (NOT DELETE) ===== */
export async function DELETE(req: Request) {
  try {
    const artisanId = getArtisanId();
    if (!artisanId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId)
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    await prisma.product.update({
      where: {
        id: productId,
        artisanId,
      },
      data: {
        isActive: false, // ✅ ARCHIVE
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to archive product" },
      { status: 500 }
    );
  }
}
