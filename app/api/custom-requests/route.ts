import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// GET /api/custom-requests?conversationId=xxx
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

    const list = await prisma.customRequest.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(list);
  } catch (err) {
    console.error("CR GET error:", err);
    return NextResponse.json(
      { error: "Failed to fetch custom requests" },
      { status: 500 }
    );
  }
}

// POST /api/custom-requests
// body: { conversationId, title, note, imageUrl? }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, title, note, imageUrl } = body;

    if (!conversationId || !title || !note) {
      return NextResponse.json(
        { error: "conversationId, title, note are required" },
        { status: 400 }
      );
    }

    const created = await prisma.customRequest.create({
      data: {
        conversationId,
        title,
        note,
        imageUrl: imageUrl || null,
        status: "SENT",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("CR POST error:", err);
    return NextResponse.json(
      { error: "Failed to create custom request" },
      { status: 500 }
    );
  }
}

// PATCH /api/custom-requests
// body: { id, status?, title?, note?, imageUrl? }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, title, note, imageUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.customRequest.update({
      where: { id },
      data: {
        status,
        title,
        note,
        imageUrl,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("CR PATCH error:", err);
    return NextResponse.json(
      { error: "Failed to update custom request" },
      { status: 500 }
    );
  }
}
