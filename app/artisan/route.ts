import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const artisanId = req.cookies.get("userId")?.value;
    const role = req.cookies.get("role")?.value;

    if (!artisanId || role !== "ARTISAN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const negotiations = await prisma.negotiation.findMany({
      where: { artisanId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(negotiations);
  } catch (error) {
    console.error("GET /api/negotiations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch negotiations" },
      { status: 500 }
    );
  }
}
