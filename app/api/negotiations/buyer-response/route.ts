import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { negotiationId, action } = await req.json();

    if (!negotiationId || !action) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const negotiation = await prisma.negotiation.findUnique({
      where: { id: negotiationId },
    });

    if (!negotiation || negotiation.status !== "COUNTERED") {
      return NextResponse.json(
        { error: "Invalid negotiation state" },
        { status: 400 }
      );
    }

    if (action === "ACCEPT") {
      await prisma.negotiation.update({
        where: { id: negotiationId },
        data: { status: "ACCEPTED" },
      });
    }

    if (action === "LEAVE") {
      await prisma.negotiation.update({
        where: { id: negotiationId },
        data: { status: "CANCELLED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Buyer response error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
