"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

import { useProduct } from "./hooks/useProduct";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import NegotiationBox from "./NegotiationBox";
import OrderBox from "./OrderBox";
import PlacementGuide from "./PlacementGuide";

export default function BuyerProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { product, loading } = useProduct(params.id);

  if (loading) {
    return <p className="p-10 text-center">Loading product…</p>;
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500">
        <h2 className="text-xl font-bold">Product not found</h2>
        <Link href="/buyer" className="text-emerald-600 underline mt-4 block">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Link
        href="/buyer"
        className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700"
      >
        <FiArrowLeft className="w-3 h-3" />
        Back to marketplace
      </Link>

      <div className="grid lg:grid-cols-[1.1fr,1.5fr] gap-6">
        <ProductImages product={product} />
        <div className="space-y-4">
          <ProductInfo product={product} />
          <NegotiationBox product={product} />
          {/* <OrderBox product={product} /> */}
          {product.isArchived ? (
  <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
    This product is currently unavailable
  </div>
) : (
  <OrderBox product={product} />
)}


        </div>
      </div>

      <PlacementGuide product={product} />
    </main>
  );
}





