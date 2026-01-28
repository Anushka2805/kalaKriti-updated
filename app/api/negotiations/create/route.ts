import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Extract body once at the top
    const body = await req.json();
    const { productId, buyerOffer, basePrice, artisanId, name, image } = body;

    // Validation
    if (!productId || !buyerOffer) {
      return NextResponse.json(
        { error: "Missing productId or buyerOffer" },
        { status: 400 }
      );
    }

    // 2️⃣ Upsert Product (Create if not exists)
    const product = await prisma.product.upsert({
      where: { id: productId },
      update: {}, 
      create: {
        id: productId,
        name: name || "Handmade Product", 
        image: image || "",
        price: basePrice || 1000,
        artisanId: artisanId || "unknown-artisan",
      },
    });

    // 3️⃣ Enforce 30% max discount rule
    const minAllowed = Math.floor(product.price * 0.7);

    if (buyerOffer < minAllowed) {
      return NextResponse.json(
        { error: `Offer too low. Minimum allowed is ₹${minAllowed}` },
        { status: 400 }
      );
    }

    // 4️⃣ Create Negotiation & Link Conversation
    const negotiation = await prisma.negotiation.create({
      data: {
        // Use 'connect' (Relation Mode) to fix the TypeScript error
        product: {
          connect: { id: product.id }
        },
        buyerId: req.headers.get("x-user-id") ?? "buyer-demo",
        artisanId: product.artisanId,
        basePrice: product.price,
        buyerOffer,
        status: "PENDING",
        
        // Create the conversation inline
        conversation: {
          create: {
            title: `Negotiation for ${product.name || product.id}`,
          }
        }
      },
    });

    return NextResponse.json(negotiation);

  } catch (err: any) {
    console.error("Negotiation error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}