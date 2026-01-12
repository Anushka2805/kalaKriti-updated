import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // In a real app, get artisanId from session/token
    // For demo, we assume a header or hardcoded ID
    // ✅ FIX: Match the ID used in the Buyer Page ("demo-artisan")
const artisanId = req.headers.get("x-user-id") || "demo-artisan";
    // OR matching the ID you used in products.ts: "artisan-ramesh"

    const negotiations = await prisma.negotiation.findMany({
      where: { artisanId: artisanId },
      include: {
        product: {
          select: { name: true, image: true, price: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(negotiations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch negotiations" }, { status: 500 });
  }
}