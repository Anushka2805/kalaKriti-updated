// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// GET /api/messages?conversationId=xxx  → get messages of one conversation
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

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/messages  → send a message
// body: { conversationId: string; from: "buyer" | "artisan"; text: string }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conversationId, from, text } = body || {};

    if (
      !conversationId ||
      typeof conversationId !== "string" ||
      !from ||
      typeof from !== "string" ||
      !text ||
      typeof text !== "string" ||
      !text.trim()
    ) {
      return NextResponse.json(
        { error: "conversationId, from, and text are required" },
        { status: 400 }
      );
    }

    const msg = await prisma.message.create({
      data: {
        conversationId,
        from,
        text: text.trim(),
      },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (err) {
    console.error("Error creating message:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
