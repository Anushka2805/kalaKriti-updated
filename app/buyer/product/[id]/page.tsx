"use client";

import { useParams } from "next/navigation";
// ✅ FIX 1: Added useEffect to imports
import { useMemo, useState, useEffect } from "react";
import { getProductById } from "../../data/products";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiDollarSign,
  FiInfo,
  FiMapPin,
  FiStar,
} from "react-icons/fi";
import Link from "next/link";

export default function BuyerProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = useMemo(() => getProductById(params.id), [params.id]);

  const [offerPrice, setOfferPrice] = useState("");
  const [negotiation, setNegotiation] = useState<any>(null);
  const [negotiationError, setNegotiationError] = useState("");
  const [loadingNegotiation, setLoadingNegotiation] = useState(false);
  const [showCustomizationSuccess, setShowCustomizationSuccess] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);

  // ✅ FIX 2: The Actual Early Return Block
  // This prevents crashes if the product URL is wrong
  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        <h2 className="text-xl font-bold">Product not found</h2>
        <p>Please check the URL or go back to the marketplace.</p>
        <Link href="/buyer" className="text-emerald-600 underline mt-4 block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  // ✅ Auto-check for existing negotiation on page load
  useEffect(() => {
    async function checkExisting() {
      try {
        const res = await fetch(`/api/negotiations/check?productId=${product!.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            setNegotiation(data);
            setOfferPrice(data.buyerOffer.toString());
          }
        }
      } catch (err) {
        console.error("Failed to check negotiation status", err);
      }
    }
    checkExisting();
  }, [product]);

  // --- Logic: Submit Initial Negotiation ---
  async function submitNegotiation() {
    // Safety check is technically handled by early return above, but good to keep
    if (!product) return;

    setNegotiationError("");
    setLoadingNegotiation(true);

    const numericPrice = Number(offerPrice);
    const minPrice = Math.floor(product.basePrice * 0.7);

    if (!offerPrice || isNaN(numericPrice)) {
      setNegotiationError("Please enter a valid price.");
      setLoadingNegotiation(false);
      return;
    }

    if (numericPrice < minPrice) {
      setNegotiationError(
        `Minimum offer is ₹${minPrice.toLocaleString("en-IN")}`
      );
      setLoadingNegotiation(false);
      return;
    }

    try {
      const res = await fetch("/api/negotiations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          buyerOffer: numericPrice,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice || product.price,
          // @ts-ignore - Temporary fix if artisanId is missing in data types
          artisanId: product.artisanId || "demo-artisan",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setNegotiation(data);
      } else {
        setNegotiationError(data.error || "Failed to start negotiation");
      }
    } catch (error) {
      console.error(error);
      setNegotiationError("Something went wrong. Please try again.");
    } finally {
      setLoadingNegotiation(false);
    }
  }

  // --- Logic: Place Order Stub ---
  function handleOrderSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowOrderSuccess(true);
  }

  // --- Logic: Customization Stub ---
  function handleCustomizationSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowCustomizationSuccess(true);
  }

  const placementLabel =
    product.category === "Toys"
      ? "Kids’ room / play corner"
      : product.category === "Food"
      ? "Dining / party table"
      : product.category === "Art"
      ? "Feature wall or corridor"
      : "Sofa side / console / shelf";

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Back link */}
      <Link
        href="/buyer"
        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700"
      >
        <FiArrowLeft className="w-3 h-3" />
        Back to marketplace
      </Link>

      <section className="space-y-6">
        {/* TOP: image left, details right */}
        <div className="grid lg:grid-cols-[1.1fr,1.5fr] gap-6">
          {/* LEFT: main image */}
          <div className="border border-gray-100 rounded-3xl bg-white shadow-sm p-4 flex flex-col items-center gap-3">
            <div className="relative w-full max-w-xs md:max-w-sm aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-gray-500 text-center">
              Handmade piece · actual colors may vary slightly on screen.
            </p>
          </div>

          {/* RIGHT: core info + negotiation + order */}
          <div className="space-y-4">
            {/* Basic info */}
            <div className="border border-gray-100 rounded-3xl bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                    {product.name}
                  </h1>
                  <p className="text-xs text-gray-700">{product.artisanName}</p>
                  <p className="text-[11px] text-gray-500 inline-flex items-center gap-1">
                    <FiMapPin className="w-3 h-3" />
                    {product.artisanLocation}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <span className="inline-flex items-center gap-1 text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                    <FiStar className="w-3 h-3 text-amber-400" />
                    {product.rating.toFixed(1)} · {product.reviews}
                  </span>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {product.deliveryEstimate}
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-700 line-clamp-3">
                {product.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Base price per unit
                  </p>
                </div>
                <div className="flex flex-wrap gap-1 justify-end">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-emerald-50 text-[11px] text-emerald-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* ✅ REAL NEGOTIATION LOGIC SECTION */}
            <div className="border border-gray-100 rounded-3xl bg-white p-4 space-y-3">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <FiDollarSign className="w-4 h-4 text-emerald-700" />
                Negotiate Price
              </h2>

              {!negotiation && (
                <>
                  <p className="text-xs text-gray-600">
                    You may negotiate up to 30% below the base price.
                  </p>

                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder={`Enter your offer (min ₹${Math.floor(
                      product.basePrice * 0.7
                    )})`}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />

                  {negotiationError && (
                    <p className="text-xs text-red-600">{negotiationError}</p>
                  )}

                  <button
                    onClick={submitNegotiation}
                    disabled={loadingNegotiation}
                    className="mt-2 px-4 py-2 rounded-full bg-emerald-700 text-white text-xs font-medium disabled:opacity-50"
                  >
                    {loadingNegotiation ? "Submitting..." : "Submit Offer"}
                  </button>
                </>
              )}

              {negotiation?.status === "PENDING" && (
                <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-xs text-yellow-800">
                    Waiting for artisan response…
                  </p>
                </div>
              )}

              {negotiation?.status === "COUNTERED" && (
                <div className="space-y-2 mt-2 bg-gray-50 p-3 rounded-xl border">
                  <p className="text-sm text-gray-800">
                    Artisan countered with{" "}
                    <strong className="text-emerald-700">
                      ₹{negotiation.artisanCounter}
                    </strong>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await fetch("/api/negotiations/buyer-response", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            negotiationId: negotiation.id,
                            action: "ACCEPT",
                          }),
                        });
                        setNegotiation({
                          ...negotiation,
                          status: "ACCEPTED",
                        });
                      }}
                      className="px-4 py-2 rounded-full bg-emerald-700 text-white text-xs"
                    >
                      Accept Counter
                    </button>

                    <button
                      onClick={async () => {
                        await fetch("/api/negotiations/buyer-response", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            negotiationId: negotiation.id,
                            action: "LEAVE",
                          }),
                        });
                        setNegotiation(null);
                        setOfferPrice("");
                      }}
                      // ✅ Changed to dark background
className="px-4 py-2 rounded-full bg-gray-900 text-white text-xs hover:bg-gray-800"
                    >
                      Leave Deal
                    </button>
                  </div>
                </div>
              )}
              {negotiation?.status === "ACCEPTED" && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                    <FiCheckCircle /> Price agreed! You can now place the order.
                  </p>
                </div>
              )}
            </div>

            {/* Order placement */}
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
                      className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      placeholder="e.g. 560001"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-600">Address</label>
                  <input
                    required
                    name="address"
                    className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="House / street / landmark"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-gray-500">
                    Payment & final shipping will be confirmed in the next step.
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
          </div>
        </div>

        {/* BOTTOM: AR/VR-style mockup + static “how to place” tips */}
        <div className="grid md:grid-cols-[1.3fr,1fr] gap-4">
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
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-100 rounded-3xl bg-white p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                How to place this
              </h2>
              <span className="text-[11px] text-gray-400">
                Static guidelines (no AI)
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
                  Soft, warm lighting usually works best. Avoid very harsh direct
                  light that can flatten textures.
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 p-3 space-y-1.5">
                <p className="font-medium text-gray-800">
                  Customization request
                </p>
                {showCustomizationSuccess && (
                  <p className="text-[11px] text-emerald-700 inline-flex items-center gap-1">
                    <FiCheckCircle className="w-3 h-3" />
                    Sent to artisan
                  </p>
                )}
                <form
                  onSubmit={handleCustomizationSubmit}
                  className="space-y-2 mt-1"
                >
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Write a short note about colors, names, packaging, etc."
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
              These are simple placement ideas, not AI recommendations. Final
              layout depends on your space.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}