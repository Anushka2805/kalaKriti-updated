"use client";

import { useState } from "react";
import { useImageStore } from "@/lib/store/imageStore";

/* 🔹 helper: File → base64 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function MarketAssistant() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>("");

  const { analysis, setImageData } = useImageStore();

  /* 🔹 upload image */
  async function onUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setImage(file);
    setPreview(base64); // ✅ base64, NOT blob
  }

  /* 🔹 call AI */
  async function analyzeImage() {
    if (!image || !preview) return;

    const form = new FormData();
    form.append("image", image);

    setLoading(true);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert("Failed to analyze image");
      return;
    }

    // ✅ store base64 + analysis
    setImageData(preview, json);
    setIsEditingPrice(false);
    setCustomPrice("");
  }

  function handlePost() {
    const finalPrice = customPrice
      ? `₹${customPrice}`
      : analysis?.pricing.suggested_range;

    alert(`Post ready 🚀\nSelling Price: ${finalPrice}`);
  }

  return (
    <main className="p-10 text-black">
      <h1 className="text-3xl font-bold">AI Market Assistant</h1>
      <p className="text-gray-800 mt-1">
        Upload a product image to generate caption, hashtags & pricing.
      </p>

      {/* Upload */}
      <div className="mt-6 border p-6 rounded bg-white">
        <input
          type="file"
          id="upload"
          className="hidden"
          accept="image/*"
          onChange={onUpload}
        />
        <label htmlFor="upload" className="cursor-pointer font-medium">
          Upload Product Image
        </label>

        {preview && (
          <img
            src={preview}
            className="w-48 mt-4 rounded shadow border"
            alt="Preview"
          />
        )}
      </div>

      {/* Generate */}
      <button
        onClick={analyzeImage}
        disabled={!image || loading}
        className="mt-6 bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Generate Post"}
      </button>

      {/* OUTPUT */}
      {analysis && (
        <div className="mt-8 p-6 border rounded bg-white space-y-4">
          <div>
            <h2 className="font-semibold">Caption</h2>
            <p>{analysis.content.caption}</p>
          </div>

          <div>
            <h2 className="font-semibold">Hashtags</h2>
            <p>{analysis.content.hashtags.join(" ")}</p>
          </div>

          {/* PRICE SECTION */}
          <div>
            <h2 className="font-semibold">Suggested Price Range</h2>
            <p>{analysis.pricing.suggested_range}</p>

            {!isEditingPrice ? (
              <button
                onClick={() => setIsEditingPrice(true)}
                className="mt-3 px-4 py-1.5 text-sm border border-gray-400 rounded text-gray-800 hover:bg-gray-100"
              >
                Change Price
              </button>
            ) : (
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Enter selling price (₹)"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  className="border px-3 py-1.5 rounded w-44"
                />
                <button
                  onClick={() => setIsEditingPrice(false)}
                  className="px-4 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Done
                </button>
              </div>
            )}

            {customPrice && (
              <p className="text-sm mt-2 text-gray-700">
                Final Selling Price: <strong>₹{customPrice}</strong>
              </p>
            )}
          </div>

          {/* POST BUTTON */}
          <button
            onClick={handlePost}
            className="mt-6 bg-green-700 text-white px-6 py-2 rounded"
          >
            Post
          </button>
        </div>
      )}
    </main>
  );
}
