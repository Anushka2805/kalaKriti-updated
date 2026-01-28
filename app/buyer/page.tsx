"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { useCart } from "@/store/cartContext";

/* ---------------- TYPES ---------------- */
type SortOption = "recommended" | "priceLow" | "priceHigh";

type Product = {
  id: string;
  name: string;
  price: number;
  isArchived?: boolean;
  images?: { id: string; url: string }[];
  artisan?: { fullName?: string };
};

/* ---------------- PRODUCT CARD ---------------- */
function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url || "/placeholder.png"
  );

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images?.[0]?.url,
    });
  }

  return (
    <article className="border rounded-2xl bg-white overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {product.images && product.images.length > 1 && (
        <div className="flex gap-2 p-3">
          {product.images.map((img) => (
            <img
              key={img.id}
              src={img.url}
              onClick={() => setActiveImage(img.url)}
              className={`h-14 w-14 object-cover rounded-lg cursor-pointer border ${
                activeImage === img.url
                  ? "border-emerald-600"
                  : "border-gray-200"
              }`}
            />
          ))}
        </div>
      )}

      <div className="p-4 space-y-2">
        <h2 className="font-semibold">{product.name}</h2>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiMapPin className="text-emerald-600" />
          {product.artisan?.fullName || "Artisan"}
        </p>

        <p className="text-lg font-bold">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium"
          >
            Add to Cart
          </button>

          <Link
            href={`/buyer/product/${product.id}`}
            className="flex-1 text-center border border-emerald-600 text-emerald-600 py-2 rounded-xl text-sm font-medium"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function BuyerMarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products]
      .filter((p) => !p.isArchived)
      .filter((p) => p.images && p.images.length > 0);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.artisan?.fullName?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, sortBy]);

  if (loading) return <p className="p-10 text-center">Loading…</p>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or artisans…"
          className="w-full pl-10 pr-4 py-2 border rounded-xl"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 py-20">
          No products found.
        </p>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
