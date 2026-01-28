import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const buyerId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!buyerId || role !== "BUYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { cart, name, phone, address, note } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    /* ---------------- CREATE ORDERS ---------------- */
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product ${item.name} is unavailable` },
          { status: 400 }
        );
      }

      await prisma.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          buyerId,
          artisanId: product.artisanId,
          productId: product.id,
          title: product.name,
          amount: product.price * item.qty,
          pincode: null,
          address,
          isCustom: false,
          status: "PENDING",
        },
      });
    }

    return NextResponse.json(
      { success: true },
      { status: 201 }
    );
  } catch (err) {
    console.error("CART CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 }
    );
  }
}
