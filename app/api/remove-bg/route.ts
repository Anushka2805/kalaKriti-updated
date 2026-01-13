import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.REMOVE_BG_KEY!,
    },
    body: formData,
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Background removal failed" },
      { status: 500 }
    );
  }

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: { "Content-Type": "image/png" },
  });
}
