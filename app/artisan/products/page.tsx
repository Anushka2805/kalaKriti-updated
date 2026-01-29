"use client";

import { useEffect, useState } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

type Product = {
  id: string;
  name: string;
  description?: string;
  price: number;
  images?: { url: string }[];
};

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  /* 🔊 INTRO (NO LISTEN) */
  useEffect(() => {
    fetch("/api/artisan/products", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        speak(
          data.length === 0
            ? "Aapke koi active products nahi hain."
            : `My products page khuli hai. ${data.length} products listed hain. Mic dabakar archive bol sakte ho.`
        );
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* 🎤 MIC CLICK */
  const handleMicClick = () => {
    listen(handleProductsVoice);
  };

  /* 🧠 VOICE LOGIC */
  const handleProductsVoice = (text: string) => {
    const t = text.toLowerCase();

    if (products.length === 0) {
      speak("Abhi archive karne ke liye koi product nahi hai.");
      return;
    }

    if (t.includes("archive")) {
      speak("Pehla product archive kiya ja raha hai.");
      archiveProduct(products[0].id);
      return;
    }

    if (t.includes("repeat")) {
      speak(
        "Aap bol sakte ho archive first product, ya sirf archive."
      );
    }
  };

  async function archiveProduct(productId: string) {
    if (!confirm("Archive this product? Buyers won't see it anymore.")) return;

    const res = await fetch("/api/artisan/products", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      return;
    }

    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  if (loading) return <p className="p-6">Loading...</p>;
  if (products.length === 0) return <p className="p-6">No products</p>;

  /* ================= UI (UNCHANGED) ================= */

  return (
    <main className="p-6">
      {/* 🎤 MIC (ONLY ADDITION) */}
      <button
        onClick={handleMicClick}
        className="mb-4 p-3 rounded-full bg-emerald-600 text-white text-xl"
      >
        🎤
      </button>

      <h1 className="text-2xl font-bold mb-6">My Products</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-xl p-4 bg-white">
            {p.images?.[0] && (
              <img
                src={p.images[0].url}
                className="h-40 w-full object-cover rounded mb-3"
              />
            )}

            <h2 className="font-semibold">{p.name}</h2>
            {p.description && (
              <p className="text-sm text-gray-600">{p.description}</p>
            )}
            <p className="font-bold mt-2">₹{p.price}</p>

            <button
              onClick={() => archiveProduct(p.id)}
              className="mt-3 text-sm text-red-600 hover:underline"
            >
              Archive
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
