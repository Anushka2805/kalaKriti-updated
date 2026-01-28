export const GEMINI_VISION_PROMPT = `
Analyze the uploaded image of a handmade artisan product.

Your task:
- Visually infer the product type, materials, and design style.
- Naturally merge these details INTO the caption itself.
- Do NOT output raw analysis or separate insight fields.

Return ONLY valid JSON in the exact structure below.
No markdown. No explanations. No extra text.

{
  "content": {
    "caption": "",
    "hashtags": []
  },
  "pricing": {
    "suggested_range": ""
  }
}

Caption rules:
- Max 2 sentences.
- MUST naturally include:
  - product type
  - material(s)
  - design style
- Caption should sound like a real social media post.

Hashtag rules:
- Generate 8–12 relevant hashtags.

Pricing rules:
- Price MUST be in **Indian Rupees (₹)** only.
- Example format: "₹800 – ₹1200"
- Do NOT use dollars ($) or any other currency.
- Give a RANGE only, not a single price.

Infer everything ONLY from the image.
`;
