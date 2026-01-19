import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* ---------------- GET WISHLIST ---------------- */
export async function GET() {
  try {
    const cookieStore = cookies();
    const buyerId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!buyerId || role !== "BUYER") {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { buyerId },
      include: {
        product: {
          include: {
            images: true,
            artisan: {
              select: {
                fullName: true,
                location: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error("GET wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch wishlist" },
      { status: 500 }
    );
  }
}

/* ---------------- ADD TO WISHLIST ---------------- */
export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const buyerId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!buyerId || role !== "BUYER") {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlist.create({
      data: { buyerId, productId },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Already in wishlist" },
        { status: 409 }
      );
    }

    console.error("POST wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

/* ---------------- REMOVE FROM WISHLIST ---------------- */
export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const buyerId = cookieStore.get("userId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!buyerId || role !== "BUYER") {
      return NextResponse.json(
        { error: "Not logged in" },
        { status: 401 }
      );
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        buyerId_productId: {
          buyerId,
          productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE wishlist error:", error);
    return NextResponse.json(
      { error: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}
