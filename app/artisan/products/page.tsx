"use client";

import { useEffect, useState } from "react";

export default function ArtisanProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const artisanId = typeof window !== "undefined"
  ? localStorage.getItem("userId")
  : null;

useEffect(() => {
  if (!artisanId) return;

  fetch(`/api/artisan/products?artisanId=${artisanId}`)
    .then(res => res.json())
    .then(setProducts);
}, [artisanId]);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Products</h1>

      {products.length === 0 ? (
        <p>No products yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p: any) => (
            <div
              key={p.id}
              className="border rounded-lg p-4 shadow-sm"
            >
              {p.images?.length > 0 && (
                <div className="flex gap-2 overflow-x-auto mb-2">
                  {p.images?.[0] &&(
                    <img
                      src={p.images[0].url}
                      className="h-40 w-full object-cover rounded-md"
                    />
                  )}
                </div>
              )}
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="mt-2 font-bold">₹{p.price}</p>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
