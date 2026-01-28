import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      role,
      fullName,
      phone,
      password,
      email,
      city,
      language,
      state,
      craftType,
      experience,
    } = body;

    if (!role || !fullName || !phone || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["ARTISAN", "BUYER"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        role,
        fullName,
        phone,
        password: hashedPassword,
        email,
        city,
        language,
        state,
        craftType,
        experience,
      },
    });

    /* ✅ AUTO LOGIN: SET COOKIES */
    const cookieStore = cookies();

    cookieStore.set("userId", user.id, {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
});

cookieStore.set("role", user.role, {
  httpOnly: true,
  path: "/",
  sameSite: "lax",
});


    return NextResponse.json(
      {
        message: "Signup successful",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
