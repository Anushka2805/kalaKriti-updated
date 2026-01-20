import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

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
    const { artisanId, productId, title, amount, isCustom, pincode, address } = body;

    if (!artisanId || !title || !amount || !pincode || !address) {
  return NextResponse.json(
    { error: "Missing required fields" },
    { status: 400 }
  );
}


    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}`,
        buyerId,
        artisanId,
        productId: productId || null,
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
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
