import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

// GET /api/conversations  → list all conversations (latest first)
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const shaped = conversations.map((c: any) => ({
      id: c.id,
      title: c.title,
      createdAt: c.createdAt,
      lastMessage: c.messages[0]?.text || null,
    }));

    return NextResponse.json(shaped);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST /api/conversations  → create new conversation
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const title =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : "Chat with artisan";

    const conv = await prisma.conversation.create({
      data: { title },
    });

    return NextResponse.json(conv, { status: 201 });
  } catch (err) {
    console.error("Error creating conversation:", err);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
