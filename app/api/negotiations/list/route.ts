// app/api/negotiations/list/route.ts
import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const negotiations = await prisma.negotiation.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(negotiations);
}
