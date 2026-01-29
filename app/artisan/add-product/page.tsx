"use client";

import { useState, useEffect } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

type Step = 0 | 1 | 2 | 3 | 4;

const steps: string[] = [
  "Product Details",
  "Upload Images",
  "Size & Dimensions",
  "Category",
  "Publish",
];

interface Dimensions {
  length: string;
  width: string;
  height: string;
}

export default function AddProduct() {
  const [step, setStep] = useState<Step>(0);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [category, setCategory] = useState("");

  const [dimensions, setDimensions] = useState<Dimensions>({
    length: "",
    width: "",
    height: "",
  });

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  /* 🔊 INTRO (NO LISTEN HERE) */
  useEffect(() => {
    speak("Add product ka page khula hai. Mic button dabaiye aur details boliye.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🔊 STEP CHANGE INFO ONLY (NO LISTEN) */
  useEffect(() => {
    speak(`Abhi ${steps[step]} ka step khula hai.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* 🎤 MIC CLICK — ONLY PLACE WHERE LISTEN HAPPENS */
  const handleMicClick = () => {
    listen(handleProductVoice);
  };

  /* 🧠 VOICE LOGIC */
  const handleProductVoice = (text: string) => {
    const t = text.toLowerCase().trim();

    /* NEXT */
    if (t === "next") {
      nextStep();
      return;
    }

    /* STEP 0 — PRODUCT DETAILS */
    if (step === 0) {
      if (!productName) {
        setProductName(t);
        speak("Price boliye.");
        return;
      }

      if (!price && /\d/.test(t)) {
        setPrice(t.replace(/\D/g, ""));
        speak("Description boliye ya next boliye.");
        return;
      }

      if (!description && t !== "next") {
        setDescription(t);
        speak("Next boliye.");
        return;
      }
    }

    /* STEP 1 — IMAGE UPLOAD */
    if (step === 1 && t.includes("upload")) {
      document.getElementById("imageUpload")?.click();
      speak("Image upload ke liye option khul gaya hai.");
      return;
    }

    /* STEP 2 — DIMENSIONS */
    if (step === 2) {
      if (!dimensions.length && /\d/.test(t)) {
        setDimensions((d) => ({ ...d, length: t.replace(/\D/g, "") }));
        speak("Width boliye.");
        return;
      }

      if (!dimensions.width && /\d/.test(t)) {
        setDimensions((d) => ({ ...d, width: t.replace(/\D/g, "") }));
        speak("Height boliye.");
        return;
      }

      if (!dimensions.height && /\d/.test(t)) {
        setDimensions((d) => ({ ...d, height: t.replace(/\D/g, "") }));
        speak("Next boliye.");
        return;
      }
    }

    /* STEP 3 — CATEGORY */
    if (step === 3 && !category) {
      setCategory(t);
      speak("Category set ho gayi. Next boliye.");
      return;
    }

    /* STEP 4 — PUBLISH */
    if (step === 4 && t.includes("publish")) {
      handlePublish();
    }
  };

  /* ================= EXISTING LOGIC (UNCHANGED) ================= */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 4 - images.length;
    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    setImages((prev) => [...prev, ...filesToAdd]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    if (images.length === 0) return [];
    const uploadedUrls: string[] = [];

    for (const file of images) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json();
      uploadedUrls.push(data.url);
    }
    return uploadedUrls;
  };

  const handlePublish = async () => {
    if (!productName || !price) {
      alert("Product name and price required");
      return;
    }

    try {
      const imageUrls = await uploadImages();
      if (imageUrls.length === 0) {
        alert("Please upload at least one image");
        return;
      }

      const res = await fetch("/api/artisan/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: productName,
          description,
          price: Number(price),
          basePrice: Number(price),
          images: imageUrls,
          dimensions,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to publish");
        return;
      }

      alert("Product published 🎉");
      window.location.href = "/artisan/products";
    } catch (err) {
      console.error(err);
      alert("Failed to publish product");
    }
  };

  const nextStep = () => {
    if (step < 4) setStep((step + 1) as Step);
  };

  const prevStep = () => {
    if (step > 0) setStep((step - 1) as Step);
  };

  /* ================= UI (UNCHANGED) ================= */

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* 🎤 MIC */}
      <button
        onClick={handleMicClick}
        className="mb-4 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Add New Handicraft
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">
        {step === 0 && (
          <div className="space-y-4">
            <input className="input" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
            <input className="input" placeholder="Price (₹)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <textarea className="input h-28 resize-none" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <input id="imageUpload" type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-3 gap-4">
            <input className="input" placeholder="Length" value={dimensions.length} onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })} />
            <input className="input" placeholder="Width" value={dimensions.width} onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })} />
            <input className="input" placeholder="Height" value={dimensions.height} onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })} />
          </div>
        )}

        {step === 3 && (
          <input className="input" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        )}

        <div className="flex justify-between mt-8">
          <button disabled={step === 0} onClick={prevStep} className="px-6 py-2 rounded-lg border">Back</button>
          {step < 4 ? (
            <button onClick={nextStep} className="px-6 py-2 rounded-lg bg-emerald-600 text-white">Next</button>
          ) : (
            <button onClick={handlePublish} className="px-6 py-2 rounded-lg bg-emerald-600 text-white">Publish Product</button>
          )}
        </div>
      </div>
    </div>
  );
}
