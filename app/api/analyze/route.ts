// app/api/analyze/route.ts
// Requires: npm install @google/genai

import { GoogleGenAI } from "@google/genai";
import { Buffer } from "buffer";
import { GEMINI_VISION_PROMPT } from "@/src/lib/ai/geminiVisionPrompt";

export async function POST(req: Request) {
  try {
    console.log("------ /api/analyze HIT ------");

    const form = await req.formData();
    const file = form.get("image") as File | null;

    if (!file) {
      return Response.json(
        { error: "Image file missing. Use field name 'image'." },
        { status: 400 }
      );
    }

    const mimeType = file.type || "image/png";

    // convert image → base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // init Gemini (API key auto-picked from env)
    const ai = new GoogleGenAI({});

    console.log("Sending image to Gemini Vision...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: GEMINI_VISION_PROMPT },
            {
              inlineData: {
                data: base64,
                mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text;
    console.log("GEMINI RAW >>>", rawText);

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      console.error("JSON PARSE ERROR >>>", err);
      return Response.json(
        { error: "Gemini returned invalid JSON", raw: rawText },
        { status: 500 }
      );
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("SERVER ERROR >>>", error);
    return Response.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
