import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { negotiationId, action, counterPrice } = await req.json();

    if (!negotiationId || !action) {
      return NextResponse.json(
        { error: "Missing negotiationId or action" },
        { status: 400 }
      );
    }

    const negotiation = await prisma.negotiation.findUnique({
      where: { id: negotiationId },
    });

    if (!negotiation) {
      return NextResponse.json(
        { error: "Negotiation not found" },
        { status: 404 }
      );
    }

    // 🔒 Only pending negotiations can be responded to
    if (negotiation.status !== "PENDING") {
      return NextResponse.json(
        { error: "Negotiation already resolved" },
        { status: 400 }
      );
    }

    // 🔐 Artisan-only check (placeholder)
    const artisanId = req.headers.get("x-user-id");
    if (artisanId && artisanId !== negotiation.artisanId) {
      return NextResponse.json(
        { error: "Unauthorized artisan" },
        { status: 403 }
      );
    }

    // ACTION HANDLING
    if (action === "ACCEPT") {
      await prisma.negotiation.update({
        where: { id: negotiationId },
        data: { status: "ACCEPTED" },
      });
    }

    else if (action === "REJECT") {
      await prisma.negotiation.update({
        where: { id: negotiationId },
        data: { status: "REJECTED" },
      });
    }

    else if (action === "COUNTER") {
      if (!counterPrice || counterPrice <= negotiation.buyerOffer) {
        return NextResponse.json(
          { error: "Counter must be higher than buyer offer" },
          { status: 400 }
        );
      }

      await prisma.negotiation.update({
        where: { id: negotiationId },
        data: {
          artisanCounter: counterPrice,
          status: "COUNTERED",
        },
      });
    }

    else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Negotiation respond error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
