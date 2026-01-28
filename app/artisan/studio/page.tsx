"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useImageStore } from "@/src/lib/store/imageStore";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

/* helper: File → base64 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function StudioPage() {
  const { imagePreview, analysis, setImageData } = useImageStore();
  const [loading, setLoading] = useState(false);

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    speak(
      "AI Studio khula hai. Aap image upload ya change kar sakte ho. Aap bol sakte ho explain trend, explain design, ya explain price."
    );
    listen(handleStudioVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis]);

  const handleStudioVoice = (text: string) => {
    text = text.toLowerCase();

    if (text.includes("upload") || text.includes("change")) {
      speak("Image upload karne ke liye file picker khol rahi hoon.");
      document.getElementById(imagePreview ? "changeImage" : "fileInput")?.click();
      return;
    }

    if (text.includes("trend")) {
      speak(
        "Trend insight ke according is product ki market demand medium hai."
      );
      listen(handleStudioVoice);
      return;
    }

    if (text.includes("design")) {
      speak(
        "Design recommendation hai matte finish, pastel colors aur minimal patterns."
      );
      listen(handleStudioVoice);
      return;
    }

    if (text.includes("price")) {
      speak(
        `Pricing advisor ke according suggested range ${analysis?.pricing.suggested_range}`
      );
      listen(handleStudioVoice);
      return;
    }

    if (text.includes("repeat")) {
      speak(
        "Aap bol sakte ho upload image, explain trend, explain design, ya explain price."
      );
      listen(handleStudioVoice);
    }
  };

  async function analyzeNewImage(file: File) {
    try {
      setLoading(true);

      const base64 = await fileToBase64(file);

      const form = new FormData();
      form.append("image", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "AI processing failed.");
        return;
      }

      setImageData(base64, json);
      speak("Image analyze ho gayi hai. Results screen par dikh rahe hain.");
    } catch (err) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    analyzeNewImage(file);
  }

  /* ================= UI (UNCHANGED) ================= */

  return (
    <main className="p-10 text-black">
      <h1 className="text-3xl font-bold">AI Studio</h1>
      <p className="text-gray-700 mt-2">
        Refine pricing, trends & design ideas.
      </p>

      <div className="mt-6 border-2 border-dashed rounded-xl p-6 text-center">
        {!imagePreview ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer text-gray-600">
              Upload image to start
            </label>
          </>
        ) : (
          <>
            <img
              src={imagePreview}
              className="mx-auto w-56 h-56 object-cover rounded-lg shadow"
              alt="Preview"
            />
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              id="changeImage"
            />
            <label
              htmlFor="changeImage"
              className="mt-4 inline-block cursor-pointer text-blue-600 underline"
            >
              Change Image
            </label>
          </>
        )}

        {loading && (
          <p className="mt-3 text-emerald-600 animate-pulse">
            Analyzing new image…
          </p>
        )}
      </div>

      {analysis && (
        <motion.div
          className="mt-10 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-lg font-bold text-emerald-700">
              Trend Insight
            </h2>
            <p className="mt-3 text-sm">
              Based on visual appeal & style, this product has
              <strong> medium market demand</strong>.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-lg font-bold text-blue-600">
              Design Recommendations
            </h2>
            <ul className="list-disc ml-5 mt-4 text-sm space-y-2">
              <li>Try a matte finish variant</li>
              <li>Introduce pastel color options</li>
              <li>Experiment with minimal patterns</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-lg font-bold text-yellow-600">
              Pricing Advisor
            </h2>
            <p className="mt-4 text-sm">
              Suggested Range:{" "}
              <strong>{analysis.pricing.suggested_range}</strong>
            </p>
            <p className="text-sm mt-2">
              Recommended Price: <strong>₹999</strong>
            </p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
