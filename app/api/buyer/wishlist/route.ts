import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ---------------- GET WISHLIST ---------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("buyerId");

    if (!buyerId) {
      return NextResponse.json(
        { error: "buyerId is required" },
        { status: 400 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { buyerId },
      include: {
        product: {
          include: {
            images: true,
            artisan: {
              select: { fullName: true, location: true },
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
    const { buyerId, productId } = await req.json();

    if (!buyerId || !productId) {
      return NextResponse.json(
        { error: "buyerId and productId required" },
        { status: 400 }
      );
    }

    const item = await prisma.wishlist.create({
      data: { buyerId, productId },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error: any) {
    // Handle duplicate wishlist add
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
    const { buyerId, productId } = await req.json();

    if (!buyerId || !productId) {
      return NextResponse.json(
        { error: "buyerId and productId required" },
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
