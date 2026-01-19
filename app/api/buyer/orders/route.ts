import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!userId || role !== "BUYER") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET buyer orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
