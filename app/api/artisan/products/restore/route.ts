import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(req: Request) {
  const store = cookies();
  const artisanId = store.get("userId")?.value;
  const role = store.get("role")?.value;

  if (!artisanId || role !== "ARTISAN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  await prisma.product.update({
    where: { id: productId, artisanId },
    data: { isActive: true },
  });

  return NextResponse.json({ success: true });
}
