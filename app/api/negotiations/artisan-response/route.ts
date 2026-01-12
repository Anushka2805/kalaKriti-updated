import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { negotiationId, action, counterPrice } = await req.json();

    let updateData: any = {};

    if (action === "ACCEPT") {
      updateData = { status: "ACCEPTED" };
    } else if (action === "REJECT") {
      updateData = { status: "REJECTED" };
    } else if (action === "COUNTER") {
      if (!counterPrice) {
        return NextResponse.json({ error: "Counter price required" }, { status: 400 });
      }
      updateData = { 
        status: "COUNTERED",
        artisanCounter: Number(counterPrice)
      };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await prisma.negotiation.update({
      where: { id: negotiationId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}