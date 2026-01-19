"use client";

import { useEffect, useState } from "react";

export default function BuyerWishlist() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch wishlist
  useEffect(() => {
    fetch("/api/buyer/wishlist", {
      credentials: "include", // 🔥 cookies auto send
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔹 Remove from wishlist
  const removeFromWishlist = async (productId: string) => {
    await fetch("/api/buyer/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    setItems((prev) =>
      prev.filter((item) => item.productId !== productId)
    );
  };

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-gray-600">No items in wishlist</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border p-3"
              >
                {product.images?.[0] && (
                  <img
                    src={product.images[0].url}
                    className="rounded-lg w-full h-40 object-cover"
                  />
                )}

                <p className="mt-3 font-medium">{product.name}</p>
                <p className="font-bold text-gray-900">₹{product.price}</p>

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="mt-2 w-full border border-red-500 text-red-500 rounded-lg py-2 text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
