"use client";

import { useEffect, useState } from "react";

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/artisan/products", {
        credentials: "include", // 🔥 REQUIRED
      });

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (products.length === 0) {
    return <p>No products yet</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            {p.images?.[0] && (
              <img
                src={p.images[0].url}
                className="h-40 w-full object-cover rounded-md mb-2"
              />
            )}

            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-600">{p.description}</p>
            <p className="mt-2 font-bold">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
