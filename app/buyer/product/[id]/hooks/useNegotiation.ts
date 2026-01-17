"use client";

import { useEffect, useState } from "react";

export function useNegotiation(product: any) {
  const [offerPrice, setOfferPrice] = useState("");
  const [negotiation, setNegotiation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔁 check existing negotiation
  useEffect(() => {
    if (!product?.id) return;

    async function checkExisting() {
      try {
        const res = await fetch(
          `/api/negotiations/check?productId=${product.id}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.id) {
            setNegotiation(data);
            setOfferPrice(String(data.buyerOffer));
          }
        }
      } catch (err) {
        console.error("Negotiation check failed", err);
      }
    }

    checkExisting();
  }, [product?.id]);

  // 💬 submit offer
  async function submitOffer() {
    if (!product) return;

    setError("");
    setLoading(true);

    const numericPrice = Number(offerPrice);
    const base = product.basePrice ?? product.price;
    const minPrice = Math.floor(base * 0.7);

    if (!offerPrice || isNaN(numericPrice)) {
      setError("Please enter a valid price");
      setLoading(false);
      return;
    }

    if (numericPrice < minPrice) {
      setError(`Minimum offer is ₹${minPrice}`);
      setLoading(false);
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
          image: product.images?.[0]?.url,
          basePrice: base,
          artisanId: product.artisanId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setNegotiation(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // ✅ accept counter
  async function acceptCounter() {
    if (!negotiation) return;

    await fetch("/api/negotiations/buyer-response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        negotiationId: negotiation.id,
        action: "ACCEPT",
      }),
    });

    setNegotiation({ ...negotiation, status: "ACCEPTED" });
  }

  // ❌ leave deal
  async function leaveDeal() {
    if (!negotiation) return;

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
  }

  return {
    offerPrice,
    setOfferPrice,
    negotiation,
    loading,
    error,
    submitOffer,
    acceptCounter,
    leaveDeal,
  };
}
