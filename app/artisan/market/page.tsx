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
  // --- Existing State (UNCHANGED) ---
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [customPrice, setCustomPrice] = useState<string>("");

  // --- Video State ---
  const [showVideoUI, setShowVideoUI] = useState(false);
  const [videoImages, setVideoImages] = useState<File[]>([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const { analysis, setImageData } = useImageStore();

  /* 🔹 upload image (UNCHANGED) */
  async function onUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);

    setImage(file);
    setPreview(base64); 
  }

  /* 🔹 call AI (UNCHANGED) */
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

    setImageData(preview, json);
    setIsEditingPrice(false);
    setCustomPrice("");
  }

  /* 🔹 Video Logic (UPDATED) */
  function handleVideoImages(e: any) {
    const files = Array.from(e.target.files || []) as File[];
    
    // ✅ Check if adding new files exceeds the limit of 6
    if (videoImages.length + files.length > 6) {
      alert(`You can only upload a maximum of 6 images. You already have ${videoImages.length}.`);
      e.target.value = "";
      return;
    }

    // ✅ Append new files to existing ones
    setVideoImages((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  // ✅ Helper to remove a specific image
  function removeVideoImage(indexToRemove: number) {
    setVideoImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function generateVideo() {
    if (videoImages.length === 0) return;

    const form = new FormData();
    videoImages.forEach((img) => form.append("images", img));

    setVideoLoading(true);

    // ✅ Corrected: Only fetch is needed here. Removed the invalid app.post block.
    const res = await fetch("/api/generate-video", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setVideoLoading(false);

    if (!res.ok) {
      alert("Video generation failed: " + (json.error || "Unknown error"));
      return;
    }

    setVideoUrl(json.videoUrl);
  }

  /* 🔹 Handle Post (UNCHANGED) */
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

      {/* Upload (UNCHANGED) */}
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

      {/* Buttons */}
      <div className="mt-6 flex gap-4 items-center">
        <button
          onClick={analyzeImage}
          disabled={!image || loading}
          className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Generate Post"}
        </button>

        <button
          onClick={() => setShowVideoUI((v) => !v)}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Generate Video
        </button>
      </div>

      {/* Video UI */}
      {showVideoUI && (
        <div className="mt-8 border p-6 rounded bg-white">
          <h2 className="font-semibold mb-2">Create Promo Video</h2>
          
          <p className="text-sm text-gray-700 mb-3">
            Upload up to 6 product images <strong>(JPEG, PNG, WebP)</strong> to generate a short video.
          </p>
          
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Selected: {videoImages.length} / 6
          </p>

          <input
            type="file"
            accept="image/png, image/jpeg, image/webp" 
            multiple
            disabled={videoImages.length >= 6} 
            onChange={handleVideoImages}
            className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />

          {videoImages.length > 0 && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border">
              <p className="font-medium text-gray-800 mb-2">Files to Process:</p>
              <ul className="space-y-1">
                {videoImages.map((file, idx) => (
                  <li key={idx} className="flex items-center justify-between bg-white px-2 py-1 rounded border">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <button 
                      onClick={() => removeVideoImage(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-2"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={generateVideo}
            disabled={videoImages.length === 0 || videoLoading}
            className="mt-4 bg-purple-600 text-white px-5 py-2 rounded disabled:opacity-50"
          >
            {videoLoading ? "Creating Video…" : "Create Video"}
          </button>

          {videoUrl && (
            <div className="mt-4">
              <video
                src={videoUrl}
                controls
                className="w-64 rounded border"
              />
            </div>
          )}
        </div>
      )}

      {/* OUTPUT (UNCHANGED) */}
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