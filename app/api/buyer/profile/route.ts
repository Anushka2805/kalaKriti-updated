import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

/* ===== GET BUYER PROFILE ===== */
export async function GET() {
  try {
    const userId = cookies().get("userId")?.value;
    const role = cookies().get("role")?.value;

    if (!userId || role !== "BUYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        phone: true,
        email: true,
        city: true,
        createdAt: true,
      },
    });

    return NextResponse.json(buyer);
  } catch (err) {
    console.error("BUYER PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
