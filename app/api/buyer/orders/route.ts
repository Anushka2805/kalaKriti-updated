import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* ================= GET BUYER ORDERS ================= */
export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("GET buyer orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

/* ================= CREATE ORDER (POST) ================= */
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const buyerId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!buyerId || role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ FIRST read body
    const body = await req.json();
    const {
      artisanId,
      productId,
      title,
      amount,
      isCustom,
      pincode,
      address,
    } = body;

    if (!artisanId || !productId || !title || !amount || !pincode || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ THEN check product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || product.isArchived) {
      return NextResponse.json(
        { error: "This product is not available for ordering" },
        { status: 400 }
      );
    }

    // ✅ Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        buyerId,
        artisanId,
        productId,
        title,
        amount,
        isCustom: Boolean(isCustom),
        status: "PENDING",
        pincode,
        address,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
