import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/* ========= GET PROFILE ========= */
export async function GET() {
  try {
    const userId = cookies().get("userId")?.value;
    const role = cookies().get("role")?.value;

    if (!userId || role !== "ARTISAN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const artisan = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        fullName: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        profilePic: true,
      },
    });

    if (!artisan) {
      return NextResponse.json(
        { error: "Artisan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artisan);
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

/* ========= UPDATE PROFILE ========= */
export async function PUT(req: Request) {
  try {
    const userId = cookies().get("userId")?.value;
    const role = cookies().get("role")?.value;

    if (!userId || role !== "ARTISAN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: body.fullName,
        phone: body.phone,
        bio: body.bio,
        location: body.location,
        profilePic: body.profilePic,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
