"use client";

import { useEffect, useState } from "react";
import { useVoiceAssistant } from "@/app/hooks/useVoiceAssistant";

export default function ArchivedProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  /* ================= VOICE ASSISTANT ================= */
  const { speak, listen } = useVoiceAssistant();

  useEffect(() => {
    fetch("/api/artisan/products/archived", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        speak(
          data.length === 0
            ? "Koi archived product nahi hai."
            : `Archived products page khuli hai. ${data.length} products archived hain. Aap bol sakte ho restore first product.`
        );
        listen(handleArchiveVoice);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleArchiveVoice = (text: string) => {
    text = text.toLowerCase();

    if (products.length === 0) {
      speak("Abhi koi archived product nahi hai.");
      return;
    }

    if (text.includes("restore")) {
      speak("Pehla archived product restore kiya ja raha hai.");
      restoreProduct(products[0].id);
      return;
    }

    if (text.includes("repeat")) {
      speak(
        "Aap bol sakte ho restore first product, ya sirf restore."
      );
      listen(handleArchiveVoice);
    }
  };

  async function restoreProduct(productId: string) {
    await fetch("/api/artisan/products/restore", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setProducts((prev) => prev.filter((p) => p.id !== productId));
  }

  if (products.length === 0) {
    return <p className="p-6 text-gray-500">No archived products</p>;
  }

  /* ================= UI (UNCHANGED) ================= */

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Archived Products</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded-xl p-4 bg-white">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="font-bold mt-2">₹{p.price}</p>

            <button
              onClick={() => restoreProduct(p.id)}
              className="mt-3 text-sm text-emerald-600 hover:underline"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
