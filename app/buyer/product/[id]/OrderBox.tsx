"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderBox({ product }: { product: any }) {
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  if (product.isActive === false) {
    return (
      <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm">
        This product is unavailable
      </div>
    );
  }

  async function handleOrderSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const quantity = Number(formData.get("buyQuantity"));
    const pincode = String(formData.get("pincode"));
    const address = String(formData.get("address"));

    setLoading(true);

    const res = await fetch("/api/buyer/orders", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artisanId: product.artisanId,
        productId: product.id,
        title: product.name,
        amount: product.price * quantity,
        isCustom: false,
        pincode,
        address,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to place order");
      return;
    }

    setShowOrderSuccess(true);
    setTimeout(() => {
      window.location.href = "/buyer/orders";
    }, 1200);
  }

  return (
    <div className="border border-gray-100 rounded-3xl bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          Place an order
        </h2>

        {showOrderSuccess && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
            <FiCheckCircle className="w-3 h-3" />
            Order created
          </span>
        )}
      </div>

      <form
        onSubmit={handleOrderSubmit}
        className="space-y-2 text-xs rounded-2xl bg-gray-50 border border-gray-100 p-3"
      >
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>Quantity</label>
            <input
              type="number"
              min={1}
              defaultValue={1}
              name="buyQuantity"
              required
              className="w-full rounded-xl border px-3 py-1.5"
            />
          </div>

          <div>
            <label>Pincode</label>
            <input
              name="pincode"
              required
              className="w-full rounded-xl border px-3 py-1.5"
            />
          </div>
        </div>

        <div>
          <label>Address</label>
          <input
            name="address"
            required
            className="w-full rounded-xl border px-3 py-1.5"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-xs"
        >
          {loading ? "Creating..." : "Create order"}
        </button>
      </form>
    </div>
  );
}
