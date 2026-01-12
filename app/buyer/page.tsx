"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCTS, type Product } from "./data/products";
import {
  FiMapPin,
  FiStar,
  FiX,
  FiSearch, // Added for the search bar
} from "react-icons/fi";

const categories = ["All", "Home Decor", "Toys", "Food", "Art"] as const;
type CategoryFilter = (typeof categories)[number];

type SortOption = "recommended" | "priceLow" | "priceHigh" | "rating";

export default function BuyerMarketplacePage() {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Filtering & Sorting Logic ---
  const filteredProducts = useMemo<Product[]>(() => {
    let list: Product[] = [...PRODUCTS];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          p.artisanName.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    if (category !== "All") {
      list = list.filter((p: Product) => p.category === category);
    }

    if (maxPrice != null && maxPrice > 0) {
      list = list.filter((p: Product) => p.price <= maxPrice);
    }

    list.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          // recommended: rating * reviews
          return b.rating * b.reviews - a.rating * a.reviews;
      }
    });

    return list;
  }, [search, category, maxPrice, sortBy]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* --- Enhanced Header & Filter Section --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
        
        {/* Title & Sort Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
            <p className="text-gray-600 mt-1">
              Discover handmade pieces from verified Indian artisans.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer hover:border-gray-400 transition"
            >
              <option value="recommended">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, artisans, or styles..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-sm outline-none"
          />
        </div>

        {/* Filters Row (Categories & Price) */}
        <div className="flex flex-wrap items-center gap-3">
          {categories.map((cat: CategoryFilter) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition shadow-sm ${
                category === cat
                  ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}

          <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

          <select
            value={maxPrice ?? ""}
            onChange={(e) =>
              setMaxPrice(
                e.target.value ? Number.parseInt(e.target.value, 10) : null
              )
            }
            className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:border-gray-400 cursor-pointer shadow-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="">Max Price: No limit</option>
            <option value={500}>Under ₹500</option>
            <option value={1000}>Under ₹1,000</option>
            <option value={2000}>Under ₹2,000</option>
            <option value={5000}>Under ₹5,000</option>
          </select>
        </div>
      </div>

      {/* --- Product Grid --- */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          <p className="text-gray-500 font-medium">No products found matching your criteria.</p>
          <button 
            onClick={() => {setSearch(""); setCategory("All"); setMaxPrice(null);}}
            className="mt-2 text-emerald-600 hover:underline text-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product: Product) => (
            <article
              key={product.id}
              className="group border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
                <img
                  src={product.thumbnail || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[11px] font-medium px-2 py-1 rounded-full text-gray-700 flex items-center gap-1 shadow-sm">
                  <FiMapPin className="w-3 h-3 text-emerald-600" />
                  {product.artisanLocation}
                </span>
              </div>

              <div className="p-5 flex flex-col gap-3 flex-1">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {product.name}
                  </h2>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{product.artisanName}</span>
                    <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-medium">
                      <FiStar className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{product.rating.toFixed(1)}</span>
                      <span className="text-gray-400 font-normal">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {product.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {product.deliveryEstimate}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <Link
                      href={`/buyer/product/${product.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm hover:shadow transition-all"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* --- Quick View Modal --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick View
              </h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid md:grid-cols-2">
              <div className="relative bg-gray-100 aspect-square md:aspect-auto">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 md:p-8 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                    {selectedProduct.category}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    by {selectedProduct.artisanName} · {selectedProduct.artisanLocation}
                  </p>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-500">
                      Base price per unit
                    </p>
                  </div>
                  <Link
                    href={`/buyer/product/${selectedProduct.id}`}
                    className="px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
                  >
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}