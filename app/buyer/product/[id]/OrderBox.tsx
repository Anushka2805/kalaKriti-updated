"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

export default function OrderBox() {
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowOrderSuccess(true);
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
            Order draft created
          </span>
        )}
      </div>

      <form
        className="space-y-2 text-xs rounded-2xl bg-gray-50 border border-gray-100 p-3"
        onSubmit={handleOrderSubmit}
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="block text-gray-600">Quantity</label>
            <input
              type="number"
              min={1}
              defaultValue={1}
              name="buyQuantity"
              className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-gray-600">Pincode</label>
            <input
              required
              name="pincode"
              placeholder="e.g. 560001"
              className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-gray-600">Address</label>
          <input
            required
            name="address"
            placeholder="House / street / landmark"
            className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-gray-500">
            Payment & shipping will be confirmed next.
          </p>

          <button
            type="submit"
            className="px-4 py-1.5 rounded-full bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800"
          >
            Create order draft
          </button>
        </div>
      </form>
    </div>
  );
}
