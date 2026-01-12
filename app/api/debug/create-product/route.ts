import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const product = await prisma.product.upsert({
    where: { id: "prod-1" },
    update: {},
    create: {
      id: "prod-1",
      price: 1200,
      artisanId: "artisan-1",
    },
  });

  return NextResponse.json(product);
}
