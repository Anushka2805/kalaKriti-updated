"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiSearch,
  FiShoppingCart,
  FiPackage,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useCart } from "@/store/cartContext";

export default function NavbarBuyer() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();

  // ✅ correct quantity calculation
  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    router.push("/buyer/signin");
  };

  const isActive = (href: string) => {
    if (href === "/buyer") return pathname === "/buyer";
    return pathname.startsWith(href);
  };

  const navLinkClasses = (href: string) =>
    `flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition ${
      isActive(href)
        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
        : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
    }`;

  return (
    <header className="w-full bg-white/90 backdrop-blur border-b sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto gap-4">

        {/* LEFT */}
        <Link href="/buyer" className="text-xl font-bold text-emerald-700">
          KalaKriti
        </Link>

        {/* SEARCH */}
        <div className="hidden sm:flex flex-1 justify-center">
          <div className="relative w-full max-w-xl">
            <FiSearch className="absolute left-4 top-2.5 text-gray-400 w-4 h-4" />
            <input
              className="w-full border rounded-full py-2 pl-10 pr-4 text-sm bg-gray-50"
              placeholder="Search crafts, artisans..."
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          <Link href="/buyer" className={navLinkClasses("/buyer")}>
            <FiShoppingBag /> Marketplace
          </Link>

          <Link href="/buyer/orders" className={navLinkClasses("/buyer/orders")}>
            <FiPackage /> Orders
          </Link>

          {/* ✅ SINGLE CART ICON WITH BADGE */}
          <Link href="/buyer/cart" className="relative p-2 rounded-full hover:bg-gray-50">
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          <Link href="/buyer/profile" className="p-2 rounded-full hover:bg-gray-50">
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-full text-red-600 hover:bg-red-50"
            title="Logout"
          >
            <FiLogOut size={18} />
          </button>

        </div>
      </div>
    </header>
  );
}
