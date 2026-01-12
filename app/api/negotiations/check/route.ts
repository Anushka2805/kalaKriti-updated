import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const buyerId = req.headers.get("x-user-id") || "buyer-demo"; // Matching your hardcoded buyer

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    // Find the most recent active negotiation for this buyer & product
    const negotiation = await prisma.negotiation.findFirst({
      where: {
        productId: productId,
        buyerId: buyerId,
        // We generally want the one that isn't cancelled, or just the latest one
        NOT: { status: "CANCELLED" }
      },
      orderBy: { createdAt: "desc" },
    });

    // If no negotiation exists, return null (not an error, just empty)
    return NextResponse.json(negotiation || null);

  } catch (error) {
    console.error("Check negotiation error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}