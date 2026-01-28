"use client";

import { FiInfo, FiCheckCircle } from "react-icons/fi";
import { useState } from "react";

export default function PlacementGuide({ product }: { product: any }) {
  const [showCustomizationSuccess, setShowCustomizationSuccess] =
    useState(false);

  function handleCustomizationSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowCustomizationSuccess(true);
  }

  const placementLabel = "Shelf / table / wall display";

  return (
    <div className="grid md:grid-cols-[1.3fr,1fr] gap-4">
      {/* LEFT: Room preview */}
      <div className="border border-gray-100 rounded-3xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-gray-900">
            Room preview (static demo)
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <FiInfo className="w-3 h-3" />
            <span>Not interactive · buyer-side only</span>
          </div>
        </div>

        <div className="relative aspect-[16/9] bg-gray-900">
          <img
            src="https://images.pexels.com/photos/6585763/pexels-photo-6585763.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Room mockup"
            className="w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-6 md:inset-10 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-md">
              {product.images?.[0] && (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-48 md:h-56 object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Placement tips */}
      <div className="border border-gray-100 rounded-3xl bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            How to place this
          </h2>
          <span className="text-[11px] text-gray-400">
            Static guidelines
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="rounded-2xl bg-gray-50 p-3 space-y-1.5">
            <p className="font-medium text-gray-800">Suggested spot</p>
            <p className="text-gray-600 text-[11px]">{placementLabel}</p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 space-y-1.5">
            <p className="font-medium text-gray-800">Lighting</p>
            <p className="text-gray-600 text-[11px]">
              Soft, warm lighting works best. Avoid harsh direct light.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3 space-y-1.5">
            <p className="font-medium text-gray-800">
              Customization request
            </p>

            {showCustomizationSuccess && (
              <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                <FiCheckCircle className="w-3 h-3" />
                Sent to artisan
              </p>
            )}

            <form
              onSubmit={handleCustomizationSubmit}
              className="space-y-2 mt-1"
            >
              <textarea
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Ask for color, size, name engraving, etc."
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-full bg-emerald-700 text-white text-[11px] font-medium hover:bg-emerald-800"
                >
                  Send request
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 pt-1">
          These are simple placement ideas, not AI recommendations.
        </p>
      </div>
    </div>
  );
}
