"use client";

import { useEffect, useState } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

/* ================= TYPES ================= */
type AnalysisResult = {
  caption?: string;
  hashtags?: string[];
  promo?: string;
  pricing?: {
    suggested_range?: string;
  };
};

export default function MarketAssistant() {
  /* ---------- IMAGE / POST ---------- */
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  /* ---------- VIDEO ---------- */
  const [videoImages, setVideoImages] = useState<File[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  /* ---------- VOICE ---------- */
  const { speak, listen } = useVoiceAssistant();

  /* 🔊 INTRO */
  useEffect(() => {
    speak(
      "AI Market Assistant ready hai. Mic dabakar upload image, generate post, ya generate video bol sakti ho."
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMic = () => {
    listen(handleVoice);
  };

  const handleVoice = (text: string) => {
    const t = text.toLowerCase();

    if (t.includes("upload")) {
      document.getElementById("upload")?.click();
      return;
    }

    if (t.includes("generate") && t.includes("post")) {
      generatePost();
      return;
    }

    if (t.includes("generate") && t.includes("video")) {
      generateVideo();
      return;
    }
  };

  /* ================= IMAGE UPLOAD ================= */
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setAnalysis(null);
  }

  /* ================= POST GENERATION ================= */
  async function generatePost() {
    if (!image) return;

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
      alert("Failed to generate post");
      return;
    }

    setAnalysis(json);
  }

  /* ================= VIDEO ================= */
  function handleVideoImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setVideoImages(files.slice(0, 6));
  }

  async function generateVideo() {
    if (videoImages.length === 0) return;

    const form = new FormData();
    videoImages.forEach((img) => form.append("images", img));

    setVideoLoading(true);
    const res = await fetch("/api/generate-video", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setVideoLoading(false);

    if (!res.ok) {
      alert("Video generation failed");
      return;
    }

    setVideoUrl(json.videoUrl);
  }

  /* ================= UI ================= */
  return (
    <main className="p-10 text-black">
      {/* 🎤 MIC */}
      <button
        onClick={handleMic}
        className="mb-4 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>

      <h1 className="text-3xl font-bold">AI Market Assistant</h1>
      <p className="text-gray-700 mt-1">
        Upload product image to generate caption, hashtags & pricing
      </p>

      {/* IMAGE UPLOAD */}
      <div className="mt-6 border p-6 rounded bg-white">
        <input
          id="upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
        />
        <label htmlFor="upload" className="cursor-pointer font-medium">
          Upload Product Image
        </label>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-48 mt-4 rounded border shadow"
          />
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={generatePost}
          disabled={!image || loading}
          className="bg-green-600 text-white px-5 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate Post"}
        </button>
      </div>

      {/* GENERATED POST */}
      {analysis && (
        <div className="mt-8 bg-white border p-6 rounded">
          <h3 className="font-bold">Generated Caption</h3>
          <p>{analysis.caption || "—"}</p>

          <h3 className="font-bold mt-4">Hashtags</h3>
          <p>
            {Array.isArray(analysis.hashtags)
              ? analysis.hashtags.join(" ")
              : "—"}
          </p>

          <h3 className="font-bold mt-4">Suggested Price</h3>
          <p>{analysis.pricing?.suggested_range ?? "—"}</p>
        </div>
      )}

      {/* VIDEO SECTION */}
      <div className="mt-10 bg-white border p-6 rounded">
        <h2 className="font-bold mb-3">Promo Video</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleVideoImages}
        />

        <button
          onClick={generateVideo}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          {videoLoading ? "Generating…" : "Generate Video"}
        </button>

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="mt-4 w-full rounded"
          />
        )}
      </div>
    </main>
  );
}
