import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    // 🔒 AUTH CHECK
    if (!userId || role !== "ARTISAN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📦 FETCH ORDERS FOR THIS ARTISAN
    const orders = await prisma.order.findMany({
      where: {
        artisanId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        orderNumber: true,
        title: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET artisan orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: Request) {
  try {
    const cookieStore = cookies();
    const artisanId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!artisanId || role !== "ARTISAN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status } = await req.json();

    if (!orderId || !["FULFILLED", "CANCELLED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
        artisanId, // extra safety
      },
      data: {
        status,
      },
    });

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
