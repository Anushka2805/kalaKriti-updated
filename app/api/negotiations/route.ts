import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// GET /api/negotiations?conversationId=xxx
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 }
      );
    }

    const list = await prisma.negotiation.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(list);
  } catch (err) {
    console.error("NEG GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch negotiations" },
      { status: 500 }
    );
  }
}

// POST /api/negotiations
// body: { conversationId, buyerName?, productName?, offerAmount }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, buyerName, productName, offerAmount } = body;

    if (!conversationId || !offerAmount) {
      return NextResponse.json(
        { error: "conversationId and offerAmount are required" },
        { status: 400 }
      );
    }

    const created = await prisma.negotiation.create({
      data: {
        conversationId,
        buyerName: buyerName || null,
        productName: productName || null,
        offerAmount,
        status: "PENDING",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("NEG POST error:", err);
    return NextResponse.json(
      { error: "Failed to create negotiation" },
      { status: 500 }
    );
  }
}

// PATCH /api/negotiations
// body: { id, counterAmount?, status? }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, counterAmount, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.negotiation.update({
      where: { id },
      data: {
        counterAmount: counterAmount ?? undefined,
        status: status ?? undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("NEG PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update negotiation" },
      { status: 500 }
    );
  }
}
