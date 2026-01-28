import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get("image");

  if (!image) {
    return NextResponse.json({ error: "No image" }, { status: 400 });
  }

  const hfForm = new FormData();
  hfForm.append("image", image as Blob);

  const res = await fetch(
    "https://api-inference.huggingface.co/models/Intel/dpt-hybrid-midas",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
      },
      body: hfForm,
    }
  );

  const blob = await res.blob();
  return new NextResponse(blob, {
    headers: { "Content-Type": "image/png" },
  });
}
