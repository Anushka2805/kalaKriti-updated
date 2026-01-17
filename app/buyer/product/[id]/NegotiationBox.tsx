"use client";

import { FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { useNegotiation } from "./hooks/useNegotiation";

export default function NegotiationBox({ product }: { product: any }) {
  const {
    offerPrice,
    setOfferPrice,
    negotiation,
    loading,
    error,
    submitOffer,
    acceptCounter,
    leaveDeal,
  } = useNegotiation(product);

  return (
    <div className="border rounded-3xl bg-white p-4 space-y-3">
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <FiDollarSign /> Negotiate Price
      </h2>

      {!negotiation && (
        <>
          <input
            type="number"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Enter your offer"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            onClick={submitOffer}
            disabled={loading}
            className="px-4 py-2 bg-emerald-700 text-white rounded-full text-xs"
          >
            {loading ? "Submitting..." : "Submit Offer"}
          </button>
        </>
      )}

      {negotiation?.status === "PENDING" && (
        <p className="text-xs text-yellow-700">Waiting for artisan response…</p>
      )}

      {negotiation?.status === "COUNTERED" && (
        <div className="space-y-2">
          <p className="text-sm">
            Counter offer: ₹{negotiation.artisanCounter}
          </p>
          <div className="flex gap-2">
            <button onClick={acceptCounter} className="btn-primary">
              Accept
            </button>
            <button onClick={leaveDeal} className="btn-dark">
              Leave
            </button>
          </div>
        </div>
      )}

      {negotiation?.status === "ACCEPTED" && (
        <p className="text-xs text-emerald-700 flex items-center gap-1">
          <FiCheckCircle /> Price agreed
        </p>
      )}
    </div>
  );
}

