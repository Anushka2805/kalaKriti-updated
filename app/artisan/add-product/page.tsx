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

  useEffect(() => {
    speak(`Abhi ${steps[step]} ka step khula hai`);
    listen(handleProductVoice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleProductVoice = (text: string) => {
    text = text.toLowerCase();

    if (step === 0 && !productName) {
      setProductName(text);
      speak("Price boliye");
      listen(handleProductVoice);
      return;
    }

    if (step === 0 && !price && /\d/.test(text)) {
      setPrice(text.replace(/\D/g, ""));
      speak("Description boliye ya next bolo");
      listen(handleProductVoice);
      return;
    }

    if (step === 1 && text.includes("upload")) {
      document.getElementById("imageUpload")?.click();
      speak("Image upload ho rahi hai");
      return;
    }

    if (text.includes("next")) {
      nextStep();
      return;
    }

    if (step === 4 && text.includes("publish")) {
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
      alert("failed to publish product");
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Add New Handicraft
      </h1>

      <div className="flex items-center justify-between mb-10">
        {steps.map((label, index) => (
          <div key={index} className="flex-1 flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                index <= step
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`ml-2 text-sm font-medium ${
                index <= step ? "text-emerald-600" : "text-gray-500"
              }`}
            >
              {label}
            </p>
            {index !== steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-gray-200 mx-4" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl">
        {step === 0 && (
          <div className="space-y-4">
            <input
              className="input"
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Price (₹)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <textarea
              className="input h-28 resize-none"
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              id="imageUpload"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            disabled={step === 0}
            onClick={prevStep}
            className="px-6 py-2 rounded-lg border text-gray-600 disabled:opacity-40"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white"
            >
              Publish Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
