"use client";

import { useEffect, useState } from "react";

export default function ArchivedProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/artisan/products/archived", { credentials: "include" })
      .then(res => res.json())
      .then(setProducts);
  }, []);

  async function restoreProduct(productId: string) {
    await fetch("/api/artisan/products/restore", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setProducts(prev => prev.filter(p => p.id !== productId));
  }

  if (products.length === 0) {
    return <p className="p-6 text-gray-500">No archived products</p>;
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Archived Products</h1>

      <div className="grid md:grid-cols-3 gap-4">
        {products.map(p => (
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
