"use client";

import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/artisan/products", { credentials: "include" })
      .then((res) => res.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <main className="p-6">
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
