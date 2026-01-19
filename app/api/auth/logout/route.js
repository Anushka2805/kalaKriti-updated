import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out successfully" });

  res.cookies.set("userId", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });

  res.cookies.set("role", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: new Date(0),
  });

  return res;
}
