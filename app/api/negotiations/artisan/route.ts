import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Fetch ALL negotiations (ignoring ID for testing purposes)
    const negotiations = await prisma.negotiation.findMany({
      include: {
        product: {
          select: { name: true, images: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(negotiations);
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch negotiations" }, { status: 500 });
  }
}