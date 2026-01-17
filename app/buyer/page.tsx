"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiSearch } from "react-icons/fi";

/* ---------------- TYPES ---------------- */
type SortOption = "recommended" | "priceLow" | "priceHigh";

/* ---------------- PRODUCT CARD ---------------- */
function ProductCard({ product }: { product: any }) {
  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url || "/placeholder.png"
  );

  return (
    <article className="border rounded-2xl bg-white overflow-hidden">
      {/* Main Image */}
      <div className="aspect-[4/3] bg-gray-100">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {product.images?.length > 1 && (
        <div className="flex gap-2 p-3">
          {product.images.map((img: any) => (
            <img
              key={img.id}
              src={img.url}
              onClick={() => setActiveImage(img.url)}
              className={`h-14 w-14 object-cover rounded-lg cursor-pointer border
                ${
                  activeImage === img.url
                    ? "border-emerald-600"
                    : "border-gray-200"
                }`}
            />
          ))}
        </div>
      )}

      {/* Info */}
      <div className="p-4 space-y-2">
        <h2 className="font-semibold">{product.name}</h2>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiMapPin className="text-emerald-600" />
          {product.artisan?.fullName || "Artisan"}
        </p>

        <p className="text-lg font-bold">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <Link
          href={`/buyer/products/${product.id}`}
          className="text-emerald-600 text-sm font-medium"
        >
          View Details →
        </Link>
      </div>
    </article>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function BuyerMarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  /* ---------------- FILTER + SORT ---------------- */
  const filteredProducts = useMemo(() => {
    let list = products.filter(
      (p) => p.images && p.images.length > 0
    );

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.artisan?.fullName?.toLowerCase().includes(q)
      );
    }

    if (maxPrice !== null) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    if (sortBy === "priceLow") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "priceHigh") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [products, search, maxPrice, sortBy]);

  if (loading) {
    return <p className="p-10 text-center">Loading products…</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Marketplace</h1>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or artisans…"
          className="w-full pl-10 pr-4 py-2 border rounded-xl"
        />
      </div>

      {/* Grid */}
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
