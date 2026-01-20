import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const store = cookies();
  const artisanId = store.get("userId")?.value;
  const role = store.get("role")?.value;

  if (!artisanId || role !== "ARTISAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: {
      artisanId,
      isActive: false,
    },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
